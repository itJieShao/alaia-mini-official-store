const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      // new BundleAnalyzerPlugin(),
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
