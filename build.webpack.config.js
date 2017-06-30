const path = require('path');

module.exports = {
  entry: './src/monapt.ts',
  output: {
    filename: 'monapt.js',
    library: 'Monapt',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
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
};
