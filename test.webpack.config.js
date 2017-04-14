const glob = require('glob');
const path = require('path');

module.exports = {
  entry: glob.sync('./test/**/*.ts', { ignore: glob.sync('./test/dist/**/*.ts') }),
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'test/dist')
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        rules: [
          {
            loader: 'ts-loader'
          },
          {
            exclude: /test\/.*\.ts$/,
            enforce: 'post',
            loader: 'istanbul-instrumenter-loader',
          }
        ]
      }
    ]
  },
  // nyc/istanbul requires inline source maps in order to do line mappings.
  devtool: 'inline-source-map',
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.ts', '.js']
  },
  externals: ['ava']
};
