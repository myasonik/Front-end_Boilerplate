var $ = require('./common.js');
var config = require('./config.js');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var styleguide = require('sc5-styleguide');

$.gulp.task('generate-styleguide', function() {
    return $.gulp.src(config.src + 'styles/**/*.scss')
        .pipe(styleguide.generate({
            title: 'Styleguide',
            server: true,
            port: 3002,
            rootPath: config.dest + '/styleguide/',
            overviewPath: 'README.md'
        }))
        .pipe($.gulp.dest(config.dest + '/styleguide/'));
});

$.gulp.task('create-styleguide', function() {
    var postpros = [ require('autoprefixer-core')({'browsers': '> 0%'}) ];
    
    if (config.prod) {
        postpros.push(
            require('css-mqpacker'),
            require('postcss-zindex'),
            require('csswring')({ preserveHacks: true, removeAllComments: true })
        );
    }

    return $.gulp.src(config.src + 'styles/*.scss')
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

$.gulp.task('styleguide', ['generate-styleguide', 'create-styleguide']);

$.gulp.task('styles', function() {
    var postpros = [ require('autoprefixer-core')({'browsers': '> 0%'}) ];
    
    if (config.prod) {
        postpros.push(
            require('css-mqpacker'),
            require('postcss-zindex'),
            require('csswring')({ preserveHacks: true, removeAllComments: true })
        );
    }

    $.gulp.src([config.src + 'styles/main.scss'])
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