/*
 *  HTML
 */
const
    path = require('path'),
    del = require('del')
    fileinclude = require('gulp-file-include');


module.exports = function(gulp, config, app) {

    const { buildDir } = app.PATH;
    const { banner, info } = app.banner;


    gulp.task('html:clear', (done) => {

        const htmlFiles = path.join(buildDir, config.html.path, '/*.html');

        return del(htmlFiles, done);
    });

    gulp.task('html:fileinclude', () => {

        const targetPath = path.join(buildDir, './');


        return gulp.src(config.html.sources)

            .pipe(fileinclude({
                prefix: '@@',
                suffix: '',
                // basepath: '@file',
                basepath: config.html.basePath, // @root, @file, your-basepath
                context: {
                    company: info.company
                },
                indent: true
            }))
            .pipe(gulp.dest(targetPath));
    });


    app.watcher.add([config.html.watch, { cwd:'./' }, gulp.series('html:clear', 'html:fileinclude')]);
};
