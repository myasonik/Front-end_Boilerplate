'use strict';

var del				= require('del'),
	gulp			= require('gulp'),
	should			= require('gulp-if'),
	notify			= require('gulp-notify'),
	rename			= require('gulp-rename'),
	browserSync		= require('browser-sync'),
	connect			= require('gulp-connect'),
	plumber			= require('gulp-plumber'),
	// (S)CSS STUFF
	sass			= require('gulp-ruby-sass'),
	postcss			= require('gulp-postcss'),
	// image stuff
	imagemin		= require('gulp-imagemin'),
	// js stuff
	uglify			= require('gulp-uglify'),
	jshint			= require('gulp-jshint'),
	source			= require('vinyl-source-stream'),
	to5ify			= require("6to5ify"),
	watchify		= require('watchify'),
	streamify		= require('gulp-streamify'),
	browserify		= require('browserify'),
	// jade stuff
	jade			= require('gulp-jade'),
	// variables
	watch = false,
	production = false;

gulp.task('sass', function() {
	var postpros = [ require('autoprefixer-core')({'browsers': '> 0%'}) ];
	
	if (production) {
		postpros.push(
			require('css-mqpacker'),
			require('csswring')({ preserveHacks: true, removeAllComments: true })
		);
	}

	sass('src/scss/main.scss')
		.on('error', notify.onError('<%= error.message %>'))
		.pipe(postcss(postpros))
		.pipe(should(production, rename({ suffix: '.min' })))
		.pipe(gulp.dest('output/'));
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

function doBrowserify(b) {
	b.bundle()
		.on('error', notify.onError('<%= error.message %>'))
		.pipe(source('main.js'))
		.pipe(should(production, streamify(uglify())))
		.pipe(should(production, rename({ suffix: '.min' })))
		.pipe(gulp.dest('output/'));
}

gulp.task('js', ['lint-js'], function() {
	var b = browserify({
				transform: [to5ify],
					debug: !production
			});

	if (watch) {
		b = watchify(b);
		b.on('update', function() {
			doBrowserify(b);
		});
	}

	b.add('./src/js/main.js')
	doBrowserify(b);
});

gulp.task('clean', del.bind(null, ['output/**/*', '!.*']));

gulp.task('watch', function() {
	watch = true;

	gulp.start('js');

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