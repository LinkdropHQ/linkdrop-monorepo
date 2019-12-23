const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, './'),
    publicPath: '/assets/scripts/',
    compress: true,
    hot: true,
    port: 9002,
    host: '0.0.0.0',
    watchOptions: {
      ignored: /node_modules/
    },
    proxy: {
      '/api/v1/linkdrops/**': {
        target: 'http://localhost:5000',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
