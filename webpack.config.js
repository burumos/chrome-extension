const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const outputPath = path.resolve(__dirname, 'public');

module.exports = {
  entry: {
    'nicovideo': './javascript/nicovideo.js',
    'pixiv': './javascript/pixiv.js',
    'popup': './javascript/popup.js',
    'background': './javascript/background.js',
    'bar': './javascript/bar.js',
  },
  output: {
    path: outputPath,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      inject: 'body',
      chunks: ['popup'],
      template: './html/popup.html',
      filename: './popup.html',
    }),
    new HtmlWebPackPlugin({
      inject: 'body',
      chunks: ['bar'],
      template: './html/bar.html',
      filename: './bar.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './image/*',
          to: outputPath,
        },
        {
          from: './manifest.json',
          to: outputPath,
        }
      ],
    }),
  ],
  "resolve" : {
    "alias": {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
    },
  },
  // Devtool: 'inline-source-map',
}
