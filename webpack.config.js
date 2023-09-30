const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.bundle.js',
        clean: true
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html" },
                { from: "src/main.css" },
                { from: "src/assets", to: "assets" },
            ],
        }),
    ],
};
