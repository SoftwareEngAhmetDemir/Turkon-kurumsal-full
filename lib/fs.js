'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const getFolders = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => fs.statSync(path.join(dir, file)).isDirectory()) : [];

const getFiles = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => fs.statSync(path.join(dir, file)).isFile()) : [];

const getConfig = (dir, def = {}) => fs.existsSync(dir + '/config.json') ? require(dir + '/config.json') : def;

const getFolderConfig = (folder, { app, config }) => {

    const { srcPath, prefix, retinaSuffix } = config.sprite;

    const src = path.resolve(app.PATH.root, srcPath, folder);
    const filename = prefix + '-' + folder;

    const options = {
        src,
        filename,
        imgPath: path.join(src, '/*.png'),
        config: Object.assign({
            padding: 3,
            imgName: filename + '.png',
            cssName: filename + '.css',
            cssOpts: {
                cssSelector: function(item) {

                    const name = `.${prefix}.${filename}-${item.name}`;

                    return name.endsWith('-hover') ? name.replace('-hover', ':hover') : name;
                    // return name;
                }
            }
        }, getConfig(src))
    };

    options.config.cssFormat = options.config.retinaSuffix ?  `css_retina` : 'css';
    options.config.retinaSrcFilter = options.config.retinaSuffix ?  `**/*${options.config.retinaSuffix}.png` : false;
    options.config.retinaImgName = options.config.retinaSuffix ?  `${filename}${options.config.retinaSuffix}.png` : false;

    return options;
};


module.exports = {
    getFolders,
    getFiles,
    getConfig,
    getFolderConfig
};
