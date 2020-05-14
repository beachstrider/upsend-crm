process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')
const Dotenv = require('dotenv-webpack');

 

environment.plugins.append(
  'DotEnvPlugin', // arbitrary name
   new Dotenv(),
);
 


module.exports = environment.toWebpackConfig()
