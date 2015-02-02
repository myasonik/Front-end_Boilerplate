var $ = require('./common.js');
var config = require('./config.js');

var jade = require('gulp-jade');
var jadeInheritance = require('gulp-jade-inheritance');
var filter = require('gulp-filter');

var jadeSrc = './' + config.src + 'jade/';

$.gulp.task('templates', function() {
	$.gulp.src(jadeSrc + '**/*.jade')
		.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
		.pipe(jadeInheritance({ basedir: jadeSrc }))
		.pipe(jade({
			basedir: jadeSrc,
			pretty: true,
			locals: { production: config.prod }
		}))
		.pipe(filter(function(file) {
			var exclue;
			if (config.outputJadeIncludes) exclue = new RegExp('templates|mixins', 'g');
			else exclue = new RegExp('templates|mixins|includes', 'g');

			return !exclue.test(file.path);
		}))
		.pipe($.gulp.dest(config.dest));
});