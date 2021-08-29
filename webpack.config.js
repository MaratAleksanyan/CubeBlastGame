const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = function (){
	const config = {
		splitChunks: {
			chunks: "all"
		}
	}

	if(isProd){
		// Тут можно добавить минимизаторы которые переписывают базовые мини мизери webpack
		//
		// config.minimizer = [
		//	new OptimizeCssAssetWebpackPlugin()
		//	new TerserWebpackPlugin()
		// ]
	}
	return config;
}

const filename = ext => isDev ? `[name].${ext}` : `'[name].[hash].${ext}`

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: ['@babel/polyfill', './index.js'],
	output: {
		filename: filename('js'),
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		extensions: ['.js', '.json', '.png']
	},
	optimization: optimization(),
	devServer: {
		port: 4200,
		hot: isDev
	},
	devtool: isDev ? 'source-map' : false,
	plugins: [
		new HtmlWebpackPlugin({
			title: "Blast Cube Game",
			template: "./index.html",
			minify: {
				collapseWhitespace: isProd
			}
		}),
		new CleanWebpackPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/favicon.ico'),
					to: path.resolve(__dirname, 'dist')
				}
			]
		})
	],
	module: {
		rules: [
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'img',
						},
					}
				],
			},
			{
				test: /\.mp3$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'audio',
						},
					}
				],
			},
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
}
