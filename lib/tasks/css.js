/*
 *  CSS
 */
const
    path = require('path'),
    rename = require('gulp-rename'),
    del = require('del'),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    sourcemaps = require('gulp-sourcemaps'),
    // autoprefixer = require('gulp-autoprefixer'),
    header = require('gulp-header');


module.exports = function(gulp, config, app) {

    const { assetsTarget } = app.PATH;
    const { banner, info } = app.banner;


    gulp.task('css:clean', (done) => {

        const cssTarget = path.join(assetsTarget, config.css.path, '/*.{css,map}');

        return del(cssTarget, done);
    });

    gulp.task('css:sass-dev', gulp.series('css:clean', () => {

        const targetPath = assetsTarget + config.css.path;
        // const autoprefixerOptions = {
        //     browsers: ['last 4 versions', '> 5%' ]
        // };

        return gulp.src(config.css.sources)
            .pipe(sassGlob())
            .pipe(sourcemaps.init())
            .pipe(sass.sync({ outputStyle: 'nested' }).on('error', sass.logError))
            // .pipe(autoprefixer(autoprefixerOptions))
            .pipe(sourcemaps.write('./'))
            .pipe(rename(function(path) {
                path.basename += '.min';
            }))
            .pipe(gulp.dest(targetPath));
    }));
    gulp.task('css:sass',
        gulp.series('css:clean', () => {

            const targetPath = assetsTarget + config.css.path;
            // const autoprefixerOptions = {
            //     browsers: ['last 4 versions', '> 5%' ]
            // };

            return gulp.src(config.css.sources)
                // .pipe(sassGlob())
                .pipe(sourcemaps.init())
                .pipe(sass.sync({ outputStyle: 'compressed' }).on('error', sass.logError))
                // .pipe(autoprefixer(autoprefixerOptions))
                .pipe(sourcemaps.write('./'))
                .pipe(header(banner, {
                    pkg: info
                }))
                .pipe(rename(function(path) {
                    path.basename += '.min';
                }))
                .pipe(gulp.dest(targetPath));
        }));

    gulp.task('css:dev', gulp.series('css:sass-dev'));
    gulp.task('css', gulp.series('css:sass'));

    app.watcher.add([config.css.watch, { cwd: './' }, gulp.series('css:dev')]);
};
