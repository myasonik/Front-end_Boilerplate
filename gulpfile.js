var gulp			= require('gulp'),
	should			= require('gulp-if'),
	clean			= require('gulp-clean'),
	rename			= require('gulp-rename'),
	concat			= require('gulp-concat'),
	browserSync		= require('browser-sync'),
	connect			= require('gulp-connect'),
	plumber			= require('gulp-plumber'),
	// (S)CSS STUFF
	sass 			= require('gulp-ruby-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	minifycss 		= require('gulp-minify-css'),
	cmq				= require('gulp-combine-media-queries'),
	// image stuff
	cache 			= require('gulp-cache'),
	imagemin 		= require('gulp-imagemin'),
	svgmin 			= require('gulp-svgmin'),
	svg2png 		= require('gulp-svg2png'),
	// js stuff
	jshint 			= require('gulp-jshint'),
	stylish 		= require('jshint-stylish'),
	uglify 			= require('gulp-uglify'),
	// jade stuff
	jade 			= require('gulp-jade'),
	// variables
	paths = {
		jade: 'src/jade/**/*.jade',
		scss: 'src/scss/**/*.scss',
		imgs: 'src/images/**/*.{png,jpg,jpeg,gif,svg}',
		js: 'src/js/**/*.js',
		fonts: 'src/fonts/**/*.{eot,svg,ttf,woff}'
	}
	production = false;

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		server: { baseDir: './output/' },
		open: false
	});
});

gulp.task('connect', function() {
	connect.server({
		root: 'output',
		livereload: true,
	});
});

gulp.task('sass', function() {
	gulp.src(paths.scss)
		.pipe(plumber())
		.pipe(sass({ loadPath: ['./bower_components'] }))
		.pipe(autoprefixer('> 0%'))
		.pipe(should(production, cmq({ log: true })))
		.pipe(should(production, rename({suffix: '.min'})))
		.pipe(should(production, minifycss()))
		.pipe(gulp.dest('output/'))
});

gulp.task('ie8', function() {
	gulp.src([
		'bower_components/html5shiv/dist/html5shiv.min.js',
		'bower_components/selectivizr/selectivizr.js'
		])
		.pipe(concat('ie8.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('output/js/'))
});

gulp.task('lint-js', function() {
	return gulp.src('js/main.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('js', ['lint-js'], function() {
	gulp.src(paths.js)
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(should(production, uglify()))
		.pipe(should(production, rename({suffix: '.min'})))
		.pipe(gulp.dest('output/js/'));
});

gulp.task('templates', function() {
	gulp.src('src/jade/*.jade')
		.pipe(plumber())
		.pipe(jade({
			basedir: './src/jade',
			pretty: true,
			locals: { production: production }
		}))
		.pipe(gulp.dest('output/'))
});

gulp.task('images', function() {
	gulp.src('images/**/*.{png,jpg,jpeg,gif}')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('output/images'));
	gulp.src('images/**/*.svg')
		.pipe(cache(svgmin()))
		.pipe(gulp.dest('output/images'))
		.pipe(cache(svg2png()))
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('output/images'));
});

gulp.task('copy', function() {
	gulp.src(paths.fonts)
		.pipe(gulp.dest('output/fonts'));
});

gulp.task('clean', function() {
	return gulp.src(['output/**/*', '!.*'], {read: false})
		.pipe(clean());
});

gulp.task('watch', function() {
	gulp.watch(paths.jade, ['templates']);
	gulp.watch(paths.scss, ['sass']);
	gulp.watch(paths.imgs, ['images']);
	gulp.watch(paths.js, ['js']);
	gulp.watch(paths.fonts, ['copy']);
	gulp.watch(['output/**/*', '!output/ie-styles.css'], function(e) {
		gulp.src(e.path)
			.pipe(browserSync.reload({stream:true}))
			.pipe(connect.reload());
	});
});

gulp.task('default', ['clean'], function() {
	gulp.start('sass', 'copy', 'images', 'ie8', 'js', 'templates');
});

gulp.task('open', ['browser-sync', 'connect', 'watch']);

gulp.task('production', ['clean'], function() {
	production = true;
	gulp.start('default');
});