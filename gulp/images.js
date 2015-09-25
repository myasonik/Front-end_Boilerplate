var $ = require('./common.js');
var config = require('./config.js');

var imagemin = require('gulp-imagemin');

$.gulp.task('images', function() {
    $.gulp.src(config.src + 'images/**/*.{png,jpg,jpeg,gif,svg}')
        .pipe($.should(config.prod, imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe($.gulp.dest(config.dest + 'images'));
});