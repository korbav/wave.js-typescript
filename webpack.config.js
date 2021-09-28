const path = require("path"); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /.*(node_modules|\.test(\.d)?\.ts).*/,
      },
    ],

  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: 'WaveJS',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  optimization: {
    minimize: true
  },
};
