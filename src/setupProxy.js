const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/notice', { 
       target: 'https://teste.csc108.com' ,
       secure: false,
       changeOrigin: true,
       pathRewrite: {
        "^/notice": "/"
       }
    }));
  app.use(createProxyMiddleware('/api', { 
       target: 'https://zs-test.csc108.com/rest' ,
       secure: false,
       changeOrigin: true,
       pathRewrite: {
        "^/api": "/"
       }
    }));
};