const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    entry:"./src/client/js/main.js",
    // 변경하고자 하는 file의 경로
    watch: true,
    plugins: [new MiniCssExtractPlugin({
      filename:"css/styles.css",
    })],
    output: { 
        filename:"js/main.js",
        // 저장될 이름
        path: path.resolve(__dirname, "assets"), 
        // 저장될 경로(절대경로)
        clean: true,
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [['@babel/preset-env', { targets:"defaults" }]],
              },
            },
          },
          {
            test: /\.scss$/,
            use: [ MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            // webpack 은 오른쪽에서 왼쪽으로(역순)으로 읽기때문에 역순으로 작성
          },
        ]
      }
};