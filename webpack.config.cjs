/**
 * Bundles the backend for execution in Node.js.
 * Builds src/server.js into dist/server.cjs using CommonJS output.
 * Keeps node_modules dependencies external, so they must remain installed.
 * Allows source imports to omit the .js extension.
 *
 * @file
 */
const path = require("node:path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",

  entry: "./src/server.js",

  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "server.cjs",
    clean: true,
  },

  resolve: {
    extensions: [".js"],
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

  mode: "production",
};
