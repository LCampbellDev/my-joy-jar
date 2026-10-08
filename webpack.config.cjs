/* global process */
const path = require('node:path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',

  entry: './src/server.js',

  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: 'server.cjs',
    clean: true,
  },

  resolve: {
    extensions: ['.js'],
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },

  externals: [nodeExternals()],

  mode: 'production',
};
