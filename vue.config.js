const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        punycode: require.resolve('punycode/')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
    optimization: {
      splitChunks: { chunks: 'all' }
    }
  }
}
