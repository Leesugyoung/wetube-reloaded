const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const BASE_JS = "./src/client/js/";

module.exports = {
    entry: {
      main: BASE_JS + "main.js",
      videoPlayer: BASE_JS + "videoPlayer.js",
      recorder: BASE_JS + "recorder.js",
      commentSection: BASE_JS + "commentSection.js",
    },
    // 변경하고자 하는 file의 경로
    plugins: [new MiniCssExtractPlugin({
      filename:"css/styles.css",
    })],
    output: { 
        filename:"js/[name].js",
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