var webpack = require('webpack');
var jsFilePrefix = "./tiles/featured-items-with-images/public/javascripts";

module.exports = {
  entry: {
    "app": jsFilePrefix + "/jsx/app.js",
    "appView": jsFilePrefix + "/jsx/appView.js"
  },
  output:{
    path: jsFilePrefix,
    filename: '[name].js'
  },
  resolve:{
    extension: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:{
          presets:['react']
        }
      }
    ]
  }
};
