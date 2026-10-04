const path = require('node:path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',

  entry: './src/server.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },

  resolve: {
    extensions: ['.js'],
  },

  mode: 'production',
};
