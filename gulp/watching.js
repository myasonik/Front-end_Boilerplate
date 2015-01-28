var $ = require('./common.js');
var config = require('./config.js');

var connect = require('gulp-connect');
var browserSync = require('browser-sync');

$.gulp.task('watching', function() {
	browserSync.init(null, {
		server: { baseDir: './' + config.dest },
		notify: false,
		open: false
	});

	connect.server({
		root: './' + config.dest,
		livereload: true,
	});

	$.gulp.watch(config.src + 'jade/**/*.jade', ['templates']);
	$.gulp.watch(config.src + 'scss/**/*.scss', ['sass']);
	$.gulp.watch(config.src + 'imgs/**/*.{png,jpg,jpeg,gif,svg}', ['imgs']);
	$.gulp.watch([config.dest + '**/*'], function(e) {
		$.gulp.src(e.path)
			.pipe(browserSync.reload({ stream:true }))
			.pipe(connect.reload());
	});

});