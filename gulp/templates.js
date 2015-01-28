var $ = require('./common.js');
var config = require('./config.js');

var jade = require('gulp-jade');
var jadeInheritance = require('gulp-jade-inheritance');

var jadeSrc = './' + config.src + 'jade';

$.gulp.task('templates', function() {
	$.gulp.src(config.src + 'jade/*.jade')
		.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
		.pipe(jadeInheritance({ basdir: jadeSrc }))
		.pipe(jade({
			basedir: jadeSrc,
			pretty: true,
			locals: { production: config.prod }
		}))
		// hacky way to remove folder structure forced by jadeInheritance
		.pipe($.rename({ dirname: '' }))
		.pipe($.gulp.dest(config.dest));
});