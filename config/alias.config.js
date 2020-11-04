const path = require('path');

module.exports = {
     // 文件路径别名
     '@public': path.resolve(__dirname, '../public'),
     '@css': path.resolve(__dirname, '../src/css'),
     '@assets': path.resolve(__dirname, '../src/assets'),
     '@utils': path.resolve(__dirname, '../src/utils'),
     '@view': path.resolve(__dirname, '../src/view'),
     '@components': path.resolve(__dirname, '../src/components'),
     '@services': path.resolve(__dirname, '../src/services'),
     '@router': path.resolve(__dirname, '../src/router'),
}