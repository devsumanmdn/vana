module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
  },
  // music-metadata is ESM + conditional exports; webpack 5 resolves it to a missing stub.
  // Load it from node_modules at runtime (Electron main has Node require).
  externals: {
    "music-metadata": "commonjs2 music-metadata",
  },
};