module.exports = {
	entry: './src/js/index.js',
	output: {
		filename: '[name].js'
	},
	module: {
		loaders: [{
			test: /\.js[x]?$/,
			exclude: /node_modules/,
			loader: 'babel-loader?presets[]=es2015&presets[]=react',
		}, {
			test: /\.css$/,
			loader: 'style-loader!css-loader'
		}]
	}
};