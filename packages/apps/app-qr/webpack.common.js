const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let config = {}
try {
  config = require('../../../configs/app.config.json')
} catch (err) {
  console.log(err)
}


const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    sourceMap: true,
    importLoaders: 1,
    camelCase: true,
    localIdentName: '[local]__[hash:base64:5]',
    minimize: true
  }
}

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: false,
    sourceMap: true,
    minimize: true
  }
}

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: true,
    plugins: () => [
      autoprefixer()
    ]
  }
}

module.exports = {
  entry: {
    vendor: ['webpack/hot/dev-server', '@babel/polyfill', 'react', 'react-dom', 'redux'],
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*'],
    modules: [
      path.resolve('./'),
      path.resolve('./src'),
      path.resolve('./node_modules'),
      path.resolve('../../../node_modules')
    ],
    alias: {
      wallets: path.resolve(__dirname, '../../../configs/wallets.config'),
      dapps: path.resolve(__dirname, '../../../configs/dapps.config'),
      config: path.resolve(__dirname, '../../../configs/app.config'),
      'config-claim': path.resolve(__dirname, '../../../configs/claim.config'),
      variables: path.resolve(__dirname, '../linkdrop-commons/variables/index.module.scss')
    }
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.(scss|css)$/,
      exclude: /\.module\.scss$/,
      use: [
        process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        CSSLoader,
        'sass-loader',
        postCSSLoader
      ]
    }, {
      test: /\.module\.scss$/,
      use: [
        process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
        CSSModuleLoader,
        'sass-loader',
        postCSSLoader
      ]
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg|otf|gif)$/,
      loader: 'url-loader?limit=100000'
    }]
  },
  node: {
    fs: 'empty'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'style.[hash].css'
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
      terminalProjectId: process.env.TERMINAL_PROJECT_ID || config.terminalProjectId,
      terminalApiKey: process.env.TERMINAL_API_KEY || config.terminalApiKey
    }),
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify(process.env.API_HOST),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ]
}
