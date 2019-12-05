const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

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
  entry: [
    '@babel/polyfill',
    './index.js',
    'webpack/hot/dev-server'
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets/scripts')
  },
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.css', '*'],
    modules: [
      path.resolve('./'),
      path.resolve('./node_modules'),
      path.resolve('../../../node_modules')
    ],
    alias: {
      wallets: path.resolve(__dirname, '../../../configs/wallets.config'),
      config: path.resolve(__dirname, '../../../configs/app.config'),
      'config-dashboard': path.resolve(__dirname, '../../../configs/dashboard.config.json'),
      contracts: path.resolve(__dirname, '../../contracts/build'),
      variables: path.resolve(__dirname, '../linkdrop-commons/variables/index.module.scss')
    }
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      loader: 'standard-loader',
      exclude: /(node_modules|bower_components|linkdrop-ui-kit)/,
      options: {
        parser: 'babel-eslint'
      }
    }, {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.(scss|css)$/,
      exclude: /\.module\.scss$/,
      use: [
        'style-loader',
        CSSLoader,
        'sass-loader',
        postCSSLoader
      ]
    }, {
      test: /\.module\.scss$/,
      use: [
        'style-loader',
        CSSModuleLoader,
        'sass-loader',
        postCSSLoader
      ]
    }, {
      test: /\.(png|woff|woff2|eot|ttf|svg|otf|gif)$/,
      loader: 'url-loader?limit=100000'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      MASTER_COPY: JSON.stringify(process.env.MASTER_COPY),
      FACTORY: JSON.stringify(process.env.FACTORY),
      JSON_RPC_URL_XDAI: JSON.stringify(process.env.JSON_RPC_URL_XDAI),
      INFURA_PK: JSON.stringify(process.env.INFURA_PK),
      CLAIM_HOST: JSON.stringify(process.env.CLAIM_HOST),
      PORTIS_DAPP_ID: JSON.stringify(process.env.PORTIS_DAPP_ID),
      FORMATIC_API_KEY_TESTNET: JSON.stringify(process.env.FORMATIC_API_KEY_TESTNET),
      FORMATIC_API_KEY_MAINNET: JSON.stringify(process.env.FORMATIC_API_KEY_MAINNET),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    })
  ]
}
