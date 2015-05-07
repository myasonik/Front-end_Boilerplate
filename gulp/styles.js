var $ = require('./common.js');
var config = require('./config.js');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var styleguide = require('sc5-styleguide');

var source = config.src + 'styles/*.scss';

$.gulp.task('generate-styleguide', function() {
    return $.gulp.src(source)
        .pipe(styleguide.generate({
            title: 'Boilerplate Styleguide',
            server: true,
            port: 3002,
            rootPath: config.dest + '/styleguide/',
            overviewPath: 'README.md'
        }))
        .pipe($.gulp.dest(config.dest));
});

$.gulp.task('create-styleguide', ['generate-styleguide'], function() {
    var postpros = [ require('autoprefixer-core')({'browsers': '> 0%'}) ];
    
    if (config.prod) {
        postpros.push(
            require('css-mqpacker'),
            require('postcss-zindex'),
            require('csswring')({ preserveHacks: true, removeAllComments: true })
        );
    }

    return $.gulp.src(source)
        .pipe($.should(!config.prod, sourcemaps.init()))
        .pipe(sass({
            percision: 4,
            includePaths: ['./node_modules', './git_submodules']
        }).on('error', $.notify.onError('<%= error.message %>')))
        .pipe(postcss(postpros))
        .pipe(styleguide.applyStyles())
        .pipe($.should(config.prod, $.rename({ suffix: '.min' })))
        .pipe($.should(!config.prod, sourcemaps.write()))
        .pipe($.gulp.dest(config.dest + '/styleguide/'));
});

$.gulp.task('styles', function() {
    if (config.watch) gulp.start('create-styleguide');

    var postpros = [ require('autoprefixer-core')({'browsers': '> 0%'}) ];
    
    if (config.prod) {
        postpros.push(
            require('css-mqpacker'),
            require('postcss-zindex'),
            require('csswring')({ preserveHacks: true, removeAllComments: true })
        );
    }

    $.gulp.src(source)
        .pipe($.should(!config.prod, sourcemaps.init()))
        .pipe(sass({
            percision: 4,
            includePaths: ['./node_modules', './git_submodules']
        }).on('error', $.notify.onError('<%= error.message %>')))
        .pipe(postcss(postpros))
        .pipe($.should(config.prod, $.rename({ suffix: '.min' })))
        .pipe($.should(!config.prod, sourcemaps.write()))
        .pipe($.gulp.dest(config.dest));
});