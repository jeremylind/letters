const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
	  new ExtractTextPlugin({filename:'app.css'}),
	  new webpack.NamedModulesPlugin(),
	  new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
  	rules: [
  	{
  	    test:/\.(s*)css$/, 
  	    use: ExtractTextPlugin.extract({ 
  	            fallback:'style-loader',
  	            use:['css-loader','sass-loader'],
  	        })
  	}
  	    ]
  },
};