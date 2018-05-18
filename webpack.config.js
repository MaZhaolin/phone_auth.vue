const path = require('path');
// const argv = require('yargs').argv;
// console.log(argv);

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  // ...
  
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, '../phone_auth/static/js_dev'),
    filename: 'app.js'
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      'vue': 'vue/dist/vue.common.js' // 'vue/dist/vue.common.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      }
    ]
  },
  devServer: {
    inline: false
  }
}