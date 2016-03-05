var $ = require('./common.js');
var config = require('./config.js');
var eslintOptions = require('../.eslintrc.js');

var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin');

$.gulp.task('lint-scripts', function() {
  return $.gulp.src(config.src + 'scripts/**/*.js')
    .pipe(eslint(eslintOptions))
    .pipe(eslint.format())
    .pipe($.should(config.prod, eslint.failOnError()))
});

$.gulp.task('scripts', ['lint-scripts'], function() {
  function doBrowserify(b) {
    b.bundle()
      .on('error', $.notify.onError('<%= error.message %>'))
      .pipe(source('main.js'))
      .pipe($.should(config.prod, streamify(uglify())))
      .pipe($.should(config.prod, $.rename({suffix: '.min'})))
      .pipe($.gulp.dest(config.dest));
  }

  var b = browserify({
    plugin: [collapse],
    debug: !config.prod
  }).transform('babelify', {presets: ['es2015']});

  if (config.watch) {
    b = watchify(b);
    b.on('update', function() {
      doBrowserify(b);
    });
  }

  b.add('./' + config.src + '/scripts/main.js')
  doBrowserify(b);
});
