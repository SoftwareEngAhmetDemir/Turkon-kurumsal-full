/*
 *  Sprites
 */
const
    path = require('path'),
    del = require('del')
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css');


module.exports = function(gulp, config, app) {

    const { root, buildDir } = app.PATH;

    const { fontIcon: { srcPath, fontName, targetPath, templatePath, iconClass, watch } } = config;

    gulp.task('fonticon', (done) => {

        return gulp.src([srcPath], {base: './src/' })
            .pipe(iconfontCss({
                fontName: fontName,
                path: templatePath,
                targetPath: targetPath.css,
                fontPath: '../' + targetPath.font.replace('./src/', ''),
                cssClass: iconClass
            }))    
            .pipe(iconfont({
                fontName: fontName,
                normalize: true,
                fontHeight: 1000
            }))
            .pipe(gulp.dest(targetPath.font));
    });

    gulp.task('icon', gulp.series('fonticon'));

    app.watcher.add([config.fontIcon.watch, { cwd: './' }, gulp.series('icon')]);
};
