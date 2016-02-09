var $ = require('./common.js');
var config = require('./config.js');
var eslintOptions = require('./eslintOptions.js');

var eslint = require('gulp-eslint');
var rollup = require('rollup-stream');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

$.gulp.task('lint-scripts', function() {
  return $.gulp.src(config.src + 'scripts/**/*.js')
    .pipe(eslint(eslintOptions))
    .pipe(eslint.format())
    .pipe($.should(config.prod, eslint.failOnError()))
});

$.gulp.task('scripts', ['lint-scripts'], function() {
  return rollup({entry: './' + config.src + '/scripts/main.js'})
    // .on('error', $.notify.onError('<%= error.message %>'))
    .pipe(source('main.js'))
    // .pipe(buffer())
    // .pipe($.should(!config.prod, sourcemaps.init({loadMaps: true})))
    // .pipe($.should(!config.prod, sourcemaps.write('.')))
    .pipe($.gulp.dest(config.dest));
});
