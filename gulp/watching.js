var $ = require('./common.js');
var config = require('./config.js');

var browserSync = require('browser-sync');

$.gulp.task('watching', function() {
    browserSync({
        server: {
            baseDir: config.dest,
            middleware: function(req, res, next) {
                if (config.extensionlessRoutes) {
                    if (req.url.indexOf('.') < 1) {
                        req.url += '.html';
                    }
                }

                return next();
            }
        },
        notify: false,
        open: false
    });

    $.gulp.watch(config.src + 'views/**/*.jade', ['views', browserSync.reload]);
    $.gulp.watch(config.src + 'styles/**/*.scss', ['styles']);
    $.gulp.watch(config.src + 'images/**/*.{png,jpg,jpeg,gif,svg}', ['images']);
    $.gulp.watch(config.src + 'scripts/**/*.js', ['lint-scripts']);
    $.gulp.watch(config.watchDest, function(e) {
        $.gulp.src(e.path)
            .pipe(browserSync.reload({ stream:true }));
    });

});