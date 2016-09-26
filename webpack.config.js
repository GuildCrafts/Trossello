var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

require('./config/environment')

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
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
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
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/[name].[ext]'
        }
      },
      {
        test: /\.sass$/,
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
