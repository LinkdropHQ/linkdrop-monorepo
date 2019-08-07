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
    port: 9003,
    host: '0.0.0.0',
    watchOptions: {
      ignored: /node_modules/
    }
  }
})
