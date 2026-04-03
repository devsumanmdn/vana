const path = require("path");
const webpack = require("webpack");
const rules = require("./webpack.rules");
const forkTsPlugins = require("./webpack.plugins");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

/**
 * @vercel/webpack-asset-relocator-loader injects:
 *   __webpack_require__.ab = __dirname + "/native_modules/"
 * Electron Forge patches this via mainTemplate (webpack 4). Webpack 5 removed mainTemplate,
 * so the patch never runs and sandboxed preload hits ReferenceError: __dirname is not defined.
 * Mirror Forge's dev replacement: use the output directory for this chunk.
 */
class ForgeAssetRelocatorAbDirnamePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      "ForgeAssetRelocatorAbDirnamePlugin",
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "ForgeAssetRelocatorAbDirnamePlugin",
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
          },
          () => {
            const marker = '__webpack_require__.ab = __dirname + "/native_modules/"';
            const outputRoot = compilation.outputOptions.path;
            if (!outputRoot) return;

            for (const { name, source, info } of compilation.getAssets()) {
              if (!name.endsWith(".js")) continue;
              const s = source.source();
              if (typeof s !== "string" || !s.includes(marker)) continue;

              const relDir = path.dirname(name);
              const chunkDir =
                relDir === "." ? outputRoot : path.join(outputRoot, relDir);
              const normalized = path
                .normalize(chunkDir)
                .split(path.sep)
                .join("/");
              const prefix = JSON.stringify(
                normalized.endsWith("/") ? normalized : `${normalized}/`
              );
              const next = s.replace(
                marker,
                `__webpack_require__.ab = ${prefix} + "native_modules/"`
              );
              compilation.updateAsset(
                name,
                new webpack.sources.RawSource(next),
                info
              );
            }
          }
        );
      }
    );
  }
}

module.exports = {
  node: {
    __dirname: true,
    __filename: true,
  },
  module: {
    rules,
  },
  plugins: [new ForgeAssetRelocatorAbDirnamePlugin(), ...forkTsPlugins],
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
    fallback: {
      path: false,
      fs: false,
    },
  },
};
