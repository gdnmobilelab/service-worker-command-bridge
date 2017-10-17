const Copy = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: {
        client: path.join(__dirname, "client.js"),
        worker: path.join(__dirname, "worker.js")
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new Copy([
            {
                from: path.join(__dirname, "index.html"),
                to: ""
            }
        ])
    ]
};
