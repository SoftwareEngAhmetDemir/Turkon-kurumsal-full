const path = require('path');

const PATH_ROOT = path.resolve(__dirname, '../');
const PATH_LIB = path.join(PATH_ROOT, './lib/');

const packageJson = require('../package.json');
const config = require(PATH_LIB + '/config/gulp.config.json');

const APP = {
    packageJson,
    config
};

const buildDir = APP.config.path || './dist';


APP.PATH = {
    root: PATH_ROOT,
    lib: PATH_LIB,
    buildDir,
    task: path.join(PATH_LIB, './tasks/'),
    assetsTarget: path.join(buildDir, APP.config.assetsPath)
};

APP.watcher = {
    _watchs: [],
    add: function(watch) {

        this._watchs.push(watch);

        return this;
    },
    run: function(gulp) {

        this._watchs.forEach((w) => {
            gulp.watch.apply(gulp, w);
        });

        return this;
    }
};


module.exports = APP;
