const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const MiniCSSExtractionPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  output: {
    filename: 'bundle.[hash].js',
    path: path.join(__dirname, '/dist'),
    clean: true
  },
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true
  },
  devtool: false,
  plugins: [
    new HtmlWebpackPlugin({
      minify: {
        collapseWhitespace: true,
        removeComments: true
      },
      template: './index.html',
      hash: true
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public', to: './public' }]
    }),
    new MiniCSSExtractionPlugin({
      filename: '[name].[hash].css'
    }),
    new BundleAnalyzerPlugin(),
    new CompressionPlugin(),
    new Dotenv()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCSSExtractionPlugin.loader, 'css-loader']
      },
      {
        test: /\.(ttf|woff|woff2|mp4)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[name]-[hash][ext]'
        }
      },
      {
        test: /\.(jpe?g|png)$/i,
        type: 'asset',
        generator: {
          filename: 'static/[name]-[hash].webp'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      '...',
      new OptimizeCSSAssetsPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ['webp', { quality: 40, resize: { width: 1200, height: 0 } }]
            ]
          }
        }
      })
    ]
  }
};
