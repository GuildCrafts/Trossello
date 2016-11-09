require('./config/environment')

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var webpackErrorNotificationPlugin = process.env.NODE_ENV === 'development' ?
  new (require('webpack-error-notification'))() :
  new webpack.DefinePlugin({})
;

var root  = __dirname


var processDotEnvPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.PORT':     JSON.stringify(process.env.PORT),
})

var babelConfig = {
  babelrc: true,
  cacheDirectory: root+'/tmp/cache',
  presets: [
    'react'
  ]
}

module.exports = {
  context: root+'/browser',
  entry: [
    root+'/browser/polyfills.js',
    root+'/browser/index.js'
  ],
  output: {
    path: root+'/build/public',
    pathinfo: true,
    filename: "browser.js",
    publicPath: '/'
  },
  resolve: {
    alias: {
      lib: root+'/lib',
      react: path.dirname(require.resolve('react')),
    },
    root: [
      root+'/server',
      root+'/lib'
    ]
  },
  devtool: 'sourcemap',
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        include: [
          root+'/browser',
          root+'/lib'
        ],
        loader: 'babel',
        query: babelConfig
      },
      {
        test: /\.css$/,
        loader: 'style!css!postcss'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|otf|webp)(\?.*)?$/,
        exclude: /\/favicon.ico$/,
        loader: 'file',
        query: {
          name: 'assets/[name].[ext]'
        }
      },
      // A special case for favicon.ico to place it into build root directory.
      {
        test: /\/favicon.ico$/,
        include: [root+'/browser'],
        loader: 'file',
        query: {
          name: 'favicon.ico?'
        }
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file',
        query: {
          name: 'assets/[name].[ext]'
        }
      },
      {
        test: /\.(sass|scss)$/,
        loader: ExtractTextPlugin.extract("style", "css!sass?sourceMap")
      },
      {
        test: /\.html$/,
        loader: 'html',
        query: {
          attrs: ['link:href'],
        }
      }
    ]
  },
  plugins: [
    webpackErrorNotificationPlugin,
    new HtmlWebpackPlugin({
      inject: true,
      template: root+'/browser/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    processDotEnvPlugin,
    // This helps ensure the builds are consistent if source hasn't changed:
    new webpack.optimize.OccurrenceOrderPlugin(),
    // Try to dedupe duplicated modules, if any:
    new webpack.optimize.DedupePlugin(),
    // // Minify the code.
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     screw_ie8: true, // React doesn't support IE8
    //     warnings: false
    //   },
    //   mangle: {
    //     screw_ie8: true
    //   },
    //   output: {
    //     comments: false,
    //     screw_ie8: true
    //   }
    // }),
    new ExtractTextPlugin('browser.css')
  ]
};
