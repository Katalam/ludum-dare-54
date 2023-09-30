const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    devtool: 'inline-source-map',
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
    devServer: {
        static: './dist',
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
