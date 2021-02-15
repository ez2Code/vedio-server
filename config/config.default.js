/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    config.view = {
        mapping: {
            '.ejs': 'ejs',
        },
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1613027151858_3014';

    // add your middleware config here
    config.middleware = [];

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };
    config.sqlitePath = path.join(__dirname, '../../.video.db')

    return {
        ...config,
        ...userConfig,
    };
};
