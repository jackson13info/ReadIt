module.exports = {
	entry: "./src/app.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{loader: 'jsx-loader'}
			//{ test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
		]
	}
}