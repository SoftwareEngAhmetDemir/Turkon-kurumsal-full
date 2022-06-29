'use strict';

const
    gulp = require('gulp'),
    path = require('path'),
    del  = require('del'),
    runSequence = require('gulp4-run-sequence');

const APP = require('./lib');

const { packageJson, config, PATH: { lib: libPath, buildDir, task: taskPath } } = APP;

APP.banner = require(libPath + '/banner.js')(packageJson, config, APP);

const { getFiles } = require(libPath + '/fs');
const tasks = getFiles(taskPath).map(p => path.parse(p).base);

tasks.forEach(task => require(taskPath + '/' + task)(gulp, config, APP));


/*
 *  Cleaning
 */
gulp.task('clean', (cb) => del([buildDir], cb));


/*
 *  Tasks
 */
// gulp.task('dev', ['sprite:dev', 'css:dev', 'js:dev', 'html:fileinclude', 'copy:cp', 'serve']);
gulp.task('dev', (done) => runSequence('sprite:dev', 'fonticon', ['css:dev', 'js:dev', 'html:fileinclude', 'copy:cp'], 'serve', done));

gulp.task('build', gulp.series('sprite', 'fonticon', 'css', 'js:build', 'html:fileinclude', 'img:minify', 'copy:cp'));
gulp.task('default', gulp.series('build'));

gulp.task('watch', gulp.series('dev', () => APP.watcher.run(gulp)));
