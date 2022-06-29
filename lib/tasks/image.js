/*
 *  Images
 */
const
    path = require('path'),
    imagemin = require('gulp-imagemin');


module.exports = function(gulp, config, app) {

    const { buildDir } = app.PATH;


    gulp.task('img:minify', gulp.series('copy:cp', () => {

        // const source = path.join(assetsTarget, './img');
        const source = path.join(buildDir, './');


    	return gulp.src([source + '/**/*.*'])
            .pipe(imagemin([
            	imagemin.gifsicle({ interlaced: true }),
            	// imagemin.jpegtran({ progressive: true }),
            	imagemin.optipng({ optimizationLevel: 5 }),
            	imagemin.svgo({ plugins: [{ removeViewBox: true }] })
            ]))
    		.pipe(gulp.dest(source));
    }));
};
