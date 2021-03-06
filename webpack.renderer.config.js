const rules = require('./webpack.rules');

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
  },
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader'
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    use: [
      {
        loader: 'file-loader'
      }
    ]
  }
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules
  },
  devServer: {
    contentBase: './src/'
  }
  // externals: [
  //   {
  //     electron: "require('electron')",
  //     child_process: "require('child_process')",
  //     fs: "require('fs')",
  //     path: "require('path')"
  //   }
  // ]
};
