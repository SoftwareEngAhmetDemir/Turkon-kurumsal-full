/*
 *  JavaScript
 */
const
    path = require('path'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    uglify = require('gulp-uglify');


module.exports = function(gulp, config, app) {

    const { assetsTarget } = app.PATH;
    const { banner, info } = app.banner;

    gulp.task('js:lint', (done) => {

        return gulp.src(config.js.test)
            .pipe(eslint({
                useEslintrc: true,
                configFile: '.eslintrc'
            }))
            .pipe(eslint.format())
            .pipe(eslint.failOnError());
    });

    gulp.task('js:dev', gulp.series('js:lint', (done) => {

        const bundles = config.js.bundles,
            targetPath = assetsTarget + config.js.path,
            cb = function() {
                if ( --i < 1 ) {
                    done();
                }
            };
        let i = Object.keys(bundles).length;

        return Object.keys(bundles).map(function(bundleName) {

            const bundle = bundles[bundleName],
                destination = bundle.destination || bundleName + '.js',
                filepath = targetPath + destination,
                ext = path.extname(destination),
                destName = config.addVersion ? path.basename(destination, ext) + appVersion + ext : destination;

            const exclude = bundle.exclude.map(x => '!' + x);
            const sources = [...bundle.files, ...bundle.paths, ...exclude];

            return gulp.src(sources)
                .pipe(concat(destName))
                .pipe(gulp.dest(targetPath))
                .pipe(rename(function(path) {
                    path.basename += '.min';
                }))
                .pipe(gulp.dest(targetPath))
                .on('end', cb);
        });
    }));

    gulp.task('js:build', gulp.series('js:lint', (done) => {

        const bundles = config.js.bundles,
            targetPath = assetsTarget + config.js.path,
            cb = function() {
                if ( --i < 1 ) {
                    done();
                }
            };

        let i = Object.keys(bundles).length;

        return Object.keys(bundles).map(function(bundleName) {

            const bundle = bundles[bundleName],
                destination = bundle.destination || bundleName + '.js',
                filepath = targetPath + destination,
                ext = path.extname(destination),
                destName = config.addVersion ? path.basename(destination, ext) + appVersion + ext : destination;

            const exclude = bundle.exclude.map(x => '!' + x);
            const sources = [...bundle.files, ...bundle.paths, ...exclude];

            return gulp.src(sources)
                .pipe(concat(destName))
                .pipe(header(banner, {
                    pkg: info
                }))
                // .pipe(gulp.dest(targetPath))
                .pipe(uglify())
                .pipe(rename(function(path) {
                    path.basename += '.min';
                }))
                .pipe(header(banner, {
                    pkg: info
                }))
                .pipe(gulp.dest(targetPath))
                .on('end', cb);
        });
    }));

    gulp.task('js', gulp.series('js:build'));


    app.watcher.add([config.js.watch, { cwd:'./' }, gulp.series('js:dev')]);
};
