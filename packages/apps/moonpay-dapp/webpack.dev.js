const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    compress: true,
    hot: true,
    port: 9005,
    host: '0.0.0.0',
    watchOptions: {
      ignored: /node_modules/
    }
  }
})
