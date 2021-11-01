const webpack = require("webpack");
const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

// plugins.push(
//   new webpack.DefinePlugin({
//     "process.type": "browser",
//     browser: "renderer",
//   })
// );

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      path: false,
      fs: false,
    },
  },
};
