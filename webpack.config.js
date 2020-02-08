const path = require("path");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.ts",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
            },
        ],
    },
};
