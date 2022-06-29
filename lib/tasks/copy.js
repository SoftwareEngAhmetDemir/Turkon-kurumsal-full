/*
 *  Copy
 */
const
    path = require('path'),
    del = require('del'),
    imagemin = require('gulp-imagemin');


module.exports = function(gulp, config, app) {

    const { buildDir, assetsTarget } = app.PATH;

    const { srcPath } = config.sprite;


    gulp.task('copy:clear', (done) => {

        const files = config.copy;
        const copyPaths = Object.keys(files).map((x) => path.join(buildDir, files[x]));

        return del(copyPaths, done);
    });

    gulp.task('copy:cp', gulp.series('copy:clear', (done) => {

        const files = config.copy,
            cb = function() {
                if ( --i < 1 ) {
                    done();
                }
            };

        let i = Object.keys(files).length;

        return Object.keys(files).map(function(source) {

            const sources = [
                source,
                '!' + path.join(srcPath, '/**/*.json'),
                '!' + path.join(srcPath, '/**/*.png')
            ];

            return gulp.src(sources)
                    .pipe(gulp.dest(assetsTarget + files[source]))
                    .on('end', cb);
        });
    }));


    app.watcher.add([Object.keys(config.copy), { cwd:'./' }, gulp.series('copy:cp')]);
};
