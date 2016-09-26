const path = require('path')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.APP_ROOT = path.resolve(__dirname,'..')
process.env.BUILD_PATH = path.resolve(__dirname, '../build')

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').load();
}
