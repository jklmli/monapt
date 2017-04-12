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
        loader: 'ts-loader'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules'
    ],
    extensions: ['.ts', '.js']
  },
  externals: ['ava']
};
