const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractSass = new ExtractTextPlugin('static/app.css');
const path = require('path');

module.exports = {
	entry: ['./build/scss/main.scss'],
	output: {
		filename: 'app.js'
	},
	module: {
		rules: [{
			test: /\.scss$/,
			use: ExtractSass.extract({
				use: [{
					loader: "css-loader", options: {
						sourceMap: true
					}
				}, {
					loader: "sass-loader", options: {
						sourceMap: true
					}
				}],
			})
		}]
	},
	plugins: [
		ExtractSass
	]
}