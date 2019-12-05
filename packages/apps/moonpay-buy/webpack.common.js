const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    plugins: () => [autoprefixer()]
  }
}

module.exports = {
  entry: ['webpack/hot/dev-server', '@babel/polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
      path.resolve('../../../node_modules')
    ],
    alias: {
      wallets: path.resolve(__dirname, '../../../configs/wallets.config'),
      config: path.resolve(__dirname, 'app.config'),
      contracts: path.resolve(__dirname, '../../contracts/build'),
      variables: '@linkdrop/commons/variables/index.module.scss'
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        loader: 'standard-loader',
        exclude: /(node_modules|bower_components|linkdrop-ui-kit)/,
        options: {
          parser: 'babel-eslint'
        }
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(scss|css)$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', CSSLoader, 'sass-loader', postCSSLoader]
      },
      {
        test: /\.module\.scss$/,
        use: ['style-loader', CSSModuleLoader, 'sass-loader', postCSSLoader]
      },
      {
        test: /\.(png|gif)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader?name=./fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
      environment: process.env.NODE_ENV
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEFAULT_CHAIN_ID: JSON.stringify(process.env.DEFAULT_CHAIN_ID),
      JSON_RPC_URL_XDAI: JSON.stringify(process.env.JSON_RPC_URL_XDAI),
      INFURA_PK: JSON.stringify(process.env.INFURA_PK),
      FACTORY: JSON.stringify(process.env.FACTORY),
      MASTER_COPY: JSON.stringify(process.env.MASTER_COPY),
      MOONPAY_API_KEY: JSON.stringify(process.env.MOONPAY_API_KEY),
      CLAIM_HOST: JSON.stringify(process.env.CLAIM_HOST),
      PORTIS_DAPP_ID: JSON.stringify(process.env.PORTIS_DAPP_ID),
      FORTMATIC_API_KEY_TESTNET: JSON.stringify(process.env.FORTMATIC_API_KEY_TESTNET),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ]
}
