const HtmlWebPackPlugin = require("html-webpack-plugin");
// We tell Webpack what HTML file in our source code to start with via the entry attribute,
// then WebPack modifies it as needed (including adding a proper module loader) so that our app can be launched
// after Webpack has transformed it.

module.exports = {
  entry: "./src/code/main.tsx",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { test: /\.html$/, use: { loader: "html-loader" } },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
    }),
  ],
  performance: { hints: false },
  // by default, Webpack will produce a warning or error, depending on various factors,
  // if the final bundle is over 250Kb. Setting performance : { hints : false } disables this behavior.
  watch: true, // Webpack will watch our source files and automatically rebuild the client if any files change.
  devtool: "source-map", // ensures that a source map is created for the final bundle, allowing some debugging
};

