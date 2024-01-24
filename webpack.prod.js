const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './public/javascripts/main.js', // Adjust the entry point based on your project
  mode: 'production',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/public/dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.min.css',
    }),
  ],
};
