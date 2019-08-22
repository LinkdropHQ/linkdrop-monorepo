const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')

const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const WorkboxPlugin = require('workbox-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

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
  entry: ['webpack/hot/dev-server', '@babel/polyfill', './index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './assets/scripts')
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
      dapps: path.resolve(__dirname, '../../../configs/dapps.config'),
      config: path.resolve(__dirname, '../../../configs/app.config'),
      'config-claim': path.resolve(__dirname, '../../../configs/claim.config'),
      contracts: path.resolve(__dirname, '../../contracts/build'),
      variables: path.resolve(
        __dirname,
        '../linkdrop-commons/variables/index.module.scss'
      )
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
        test: /\.(png|woff|woff2|eot|ttf|svg|otf|gif)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      JSON_RPC_URL: JSON.stringify(process.env.JSON_RPC_URL),
      MASTER_COPY: JSON.stringify(process.env.MASTER_COPY),
      FACTORY: JSON.stringify(process.env.FACTORY),
      API_HOST_RINKEBY: JSON.stringify(process.env.API_HOST_RINKEBY),
      API_HOST_MAINNET: JSON.stringify(process.env.API_HOST_MAINNET),
      CLAIM_HOST: JSON.stringify(process.env.CLAIM_HOST),
      INITIAL_BLOCK_RINKEBY: JSON.stringify(process.env.INITIAL_BLOCK_RINKEBY),
      INITIAL_BLOCK_MAINNET: JSON.stringify(process.env.INITIAL_BLOCK_MAINNET),
      AUTH_CLIENT_ID: JSON.stringify(process.env.AUTH_CLIENT_ID),
      AUTH_API_KEY: JSON.stringify(process.env.AUTH_API_KEY),
      AUTH_DISCOVERY_DOCS: JSON.stringify(process.env.AUTH_DISCOVERY_DOCS),
      AUTH_SCOPE: JSON.stringify(process.env.AUTH_SCOPE),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new HtmlWebpackPlugin({
      favicon: 'assets/images/favicon.png',
      template: path.join(__dirname, 'index.html')
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
    new CopyWebpackPlugin([{ from: 'assets/images', to: 'images' }]),
    new WebpackPwaManifest({
      name: 'Linkdrop Wallet',
      short_name: 'Wallet',
      start_url: '/',
      orientation: 'portrait',
      display: 'standalone',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      fingerprints: false,
      ios: {
        'apple-mobile-web-app-title': 'Wallet',
        'apple-mobile-web-app-status-bar-style': 'transparent'
      },
      icons: [
        {
          src: path.resolve('assets/icons/linkdrop.png'),
          sizes: [120, 152, 167, 180, 1024],
          destination: path.join('icons', 'ios'),
          ios: true
        },
        {
          src: path.resolve('assets/icons/linkdrop.png'),
          sizes: [36, 48, 72, 96, 144, 192, 512],
          destination: path.join('icons', 'android')
        }
      ]
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      include: [/\.html$/, /\.js$/, /\.css$/, /\.jpg$/, /\.png$/, /\.ico$/],
      clientsClaim: true,
      skipWaiting: true
    })
  ]
}
