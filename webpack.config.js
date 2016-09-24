var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
// var CleanWebpackPlugin = require('clean-webpack-plugin');
var rimraf = require('rimraf')

require('./config/environment')

var root  = __dirname

var processDotEnvPlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV':  JSON.stringify(process.env.NODE_ENV),
  'process.env.PORT':      JSON.stringify(process.env.PORT),
  'process.env.APP_ROOT':  JSON.stringify(process.env.APP_ROOT),
  'process.env.DIST_PATH': JSON.stringify(process.env.DIST_PATH),
})

// this lists all node_modules as external so they dont
// get packaged and the requires stay as is.
// http://jlongster.com/Backend-Apps-with-Webpack--Part-I
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


var sourceMapSupperBannerPlugin = new webpack.BannerPlugin(
  'require("source-map-support").install();',
  { raw: true, entryOnly: false }
)

var babelConfig = {
  babelrc: false,
  cacheDirectory: root+'/tmp/cache',
  presets: [
    require.resolve('babel-preset-latest'),
    require.resolve('babel-preset-react')
  ],
  plugins: [
    // class { handleClick = () => { } }
    require.resolve('babel-plugin-transform-class-properties'),
    // { ...todo, completed: true }
    require.resolve('babel-plugin-transform-object-rest-spread'),
    // function* () { yield 42; yield 43; }
    [require.resolve('babel-plugin-transform-regenerator'), {
      // Async functions are converted to generators by babel-preset-latest
      async: false
    }],
    // Polyfills the runtime needed for async/await and generators
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config.
      // You can safely remove this after ejecting:
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }]
  ]
}

var serverJs = {
  context: root+'/server',
  entry: root+'/server/index.js',
  output: {
    path: root+'/build',
    pathinfo: false,
    filename: 'server.js',
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: [
          root+'/server',
          root+'/lib'
        ]
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: [
          root+'/server',
          root+'/lib'
        ],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: babelConfig
      }
    ]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
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
  // resolveLoader: {
  //   modulesDirectories: [
  //     '/users/path/a/node_modules'
  //   ]
  // },
  externals: nodeModules, // dont bundle any node_modules
  target: 'node',
  bail: true,

  // we dont need a sourcemap for the server
  // devtool: 'eval',
  // devtool: 'sourcemap',

  node: {
    __filename: false,
    __dirname: false,
    process: false,
    Buffer: false,
  },
  console: true,

  plugins:  [
    sourceMapSupperBannerPlugin,
    new webpack.IgnorePlugin(/\.(css|less)$/)
  ],

}

var browserJs = {
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

module.exports = [serverJs, browserJs]
