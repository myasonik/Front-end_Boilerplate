var $ = require('./common.js');
var config = require('./config.js');

var connect = require('gulp-connect');
var browserSync = require('browser-sync');

$.gulp.task('watching', function() {
	browserSync({
		server: { baseDir: config.dest },
		files: config.watchDest,
		notify: false,
		open: false
	});

	connect.server({
		root: config.dest,
		livereload: true,
	});

	$.gulp.watch(config.src + 'jade/**/*.jade', ['templates']);
	$.gulp.watch(config.src + 'scss/**/*.scss', ['sass']);
	$.gulp.watch(config.src + 'imgs/**/*.{png,jpg,jpeg,gif,svg}', ['imgs']);
	$.gulp.watch(config.watchDest, function(e) {
		$.gulp.src(e.path)
			.pipe(connect.reload());
	});

});