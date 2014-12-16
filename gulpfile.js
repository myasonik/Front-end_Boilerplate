'use strict';

var del				= require('del'),
	gulp			= require('gulp'),
	should			= require('gulp-if'),
	notify			= require('gulp-notify'),
	rename			= require('gulp-rename'),
	concat			= require('gulp-concat'),
	browserSync		= require('browser-sync'),
	connect			= require('gulp-connect'),
	plumber			= require('gulp-plumber'),
	// (S)CSS STUFF
	sass			= require('gulp-ruby-sass'),
	postcss			= require('gulp-postcss'),
	// image stuff
	imagemin		= require('gulp-imagemin'),
	// js stuff
	jshint			= require('gulp-jshint'),
	uglify			= require('gulp-uglify'),
	// jade stuff
	jade			= require('gulp-jade'),
	// variables
	production = false;

gulp.task('sass', function() {
	var postpros = [ require('autoprefixer-core')({'browsers': '> 0%'}) ];
	
	if (production) {
		postpros.push(
			require('css-mqpacker'),
			require('csswring')({ preserveHacks: true, removeAllComments: true })
		);
	}

	gulp.src([
		'breakpoint-sass/**/*.scss',
		'src/scss/**/*.scss'
	])
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(sass({
			'sourcemap=none': true,
			loadPath: [process.cwd() + '/bower_components']
		}))
		.pipe(postcss(postpros))
		.pipe(should(production, rename({ suffix: '.min' })))
		.pipe(gulp.dest('output/'));
});

gulp.task('lint-js', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(notify(function (file) {
			if (file.jshint.success) return false;
			var errors = file.jshint.results.map(function (data) {
				if (data.error) return '(' + data.error.line + ') ' + data.error.reason;
			}).join('\n');
			return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
		}));
});

gulp.task('js', ['lint-js'], function() {
	gulp.src('src/js/**/*.js')
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(concat('main.js'))
		.pipe(should(production, uglify()))
		.pipe(should(production, rename({ suffix: '.min' })))
		.pipe(gulp.dest('output/js/'));
});

gulp.task('templates', function() {
	gulp.src('src/jade/*.jade')
		.pipe(plumber({ errorHandler: notify.onError('<%= error.message %>') }))
		.pipe(jade({
			basedir: './src/jade',
			pretty: true,
			locals: { production: production }
		}))
		.pipe(gulp.dest('output/'));
});

gulp.task('imgs', function() {
	gulp.src('src/imgs/**/*.{png,jpg,jpeg,gif,svg}')
		.pipe(should(production, imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('output/imgs'));
});

gulp.task('copy', function() {
	// Fonts
	gulp.src('src/fonts/**/*.{eot,svg,ttf,woff}')
		.pipe(gulp.dest('output/fonts'));
	// JQuery fallback
	gulp.src('bower_components/jquery/jquery.min.js')
		.pipe(gulp.dest('output/js/'));
});

gulp.task('clean', del.bind(null, ['output/**/*', '!.*']));

gulp.task('watch', function() {
	browserSync.init(null, {
		server: { baseDir: './output/' },
		notify: false,
		open: false
	});

	connect.server({
		root: './output/',
		livereload: true,
	});

	gulp.watch('src/jade/**/*.jade', ['templates']);
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/imgs/**/*.{png,jpg,jpeg,gif,svg}', ['imgs']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/fonts/**/*.{eot,svg,ttf,woff}', ['copy']);
	gulp.watch(['output/**/*'], function(e) {
		gulp.src(e.path)
			.pipe(browserSync.reload({ stream:true }))
			.pipe(connect.reload());
	});
});

gulp.task('default', ['clean'], function() {
	gulp.start('sass', 'copy', 'imgs', 'js', 'templates');
});

gulp.task('prod', function() {
	production = true;
	gulp.start('default');
});