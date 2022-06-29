/*
 *  Serve
 */
//
const
    path = require('path'),
    connect = require('gulp-connect');


module.exports = function(gulp, config, app) {

    const { packageJson: { description }, PATH: { buildDir } }  = app;
    const { serve } = config;

    gulp.task('serve:reload', function() {

        return gulp.src(buildDir + '/**/*')
            .pipe(connect.reload());
    });

    gulp.task('serve', function(done) {

        connect.server(Object.assign({
            name: description,
            root: [ buildDir ],
            port: 8080,
            // https: false,
            livereload: true,
            debug: false
        }, serve));

        done();
    });


    app.watcher.add([buildDir + '**/*', { cwd:'./' }, gulp.series('serve:reload')]);
};
