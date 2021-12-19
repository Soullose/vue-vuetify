const path = require('path');
const mockerApi = require('mocker-api');
const requireContext = require('require-context');

module.exports = {
    productionSourceMap: false,
    // productionSourceMap: process.env.NODE_ENV === 'dev' ? true : false, // 发布时不包含调试信息
    transpileDependencies: ['vuetify'],
    devServer: {
        before(app) {
            // 开启或关闭 MOCK
            // var files = requireContext(path.resolve('./mock'), true, /.*\.mock.js$/);
            // var mockFiles = files.keys().map((key) => {
            //     return path.resolve('./mock/' + key);
            // });
            // if (mockFiles.length > 0) mockerApi(app, mockFiles);
        },
        // application port
        port: 9999,
        proxy: {
            '/api/workflow': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true
            }
            // '/api': {
            //     target: 'http://192.168.111.134:8080',
            //     changeOrigin: true
            // }
        }
    }
};
