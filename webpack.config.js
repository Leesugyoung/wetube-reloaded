const path = require("path");

module.exports = {
    mode: "development",
    entry:"./src/client/js/main.js",
    // 변경하고자 하는 file의 경로
    output: {
        filename:"main.js",
        // 저장될 이름
        path: path.resolve(__dirname, "assets", "js"),
        // 저장될 경로(절대경로)
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: "babel-loader",
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }],
                ]
              }
            }
          }
        ]
      }
};