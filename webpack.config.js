const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
	  new webpack.ProvidePlugin({ 'window.decomp': 'poly-decomp' }),
	  new ExtractTextPlugin({filename:'app.bundle.css', allChunks: true}),
  ],
  module: {
  	rules:[
  	        {
                test:/\.(s*)css$/, 
                use: ExtractTextPlugin.extract({ 
                        fallback:'style-loader',
                        use:['css-loader','sass-loader'],
                    })
            }
  	 ]
  }
};