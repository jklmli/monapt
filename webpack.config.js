const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    library: 'Monapt',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist')
  }
};
