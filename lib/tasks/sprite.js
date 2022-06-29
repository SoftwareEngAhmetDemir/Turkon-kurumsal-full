/*
 *  Sprites
 */
const
    path = require('path'),
    del = require('del')
    concat = require('gulp-concat'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    cleanCSS = require('gulp-clean-css'),
    gulpif = require('gulp-if');


module.exports = function(gulp, config, app) {

    const { root, buildDir } = app.PATH;

    const { sprite: { srcPath, targetPath, prefix } } = config;


    const { getFolders, getFolderConfig } = require(root + '/lib/fs.js');

    const sprite = function(dev = true, done) {

        const folders = getFolders(srcPath);
        if ( !folders || !folders.length ) {
            return done();
        }

        const streams = folders.reduce((merged, folder, index) => {

            const folderConfig = getFolderConfig(folder, { app, config });

            const spriteData = gulp.src(folderConfig.imgPath).pipe(spritesmith(folderConfig.config));

            const imgStream = spriteData.img
                .pipe(buffer())
                .pipe(gulpif(!dev, imagemin()))
                .pipe(gulp.dest(targetPath.img));

            const cssStream = spriteData.css
                .pipe(gulpif(!dev, cleanCSS({ advanced: true })))
                // .pipe(concat('ui-icons-' + folder + '.css'))
                // .pipe(gulp.dest(targetPath.css))
                ;

            merged.img.add(imgStream);
            merged.css.add(cssStream);

            return merged;
        }, {
            img: merge(),
            css: merge()
        });

        streams.css.pipe(concat('ui-icons.css'))
                   .pipe(gulp.dest(targetPath.css));

        return merge(streams.img, streams.css);
    };


    gulp.task('sprite:clean', (done) => {

        return del(targetPath + '/**/*', done);
    });

    gulp.task('sprite:dev', gulp.series('sprite:clean', (done) => {

        return sprite(true, done);
    }));

    gulp.task('sprite', gulp.series('sprite:clean', (done) => {

        return sprite(false, done);
    }));


    app.watcher.add([srcPath + '/**/*.png', { cwd:'./' }, gulp.series('sprite:dev')]);
};
