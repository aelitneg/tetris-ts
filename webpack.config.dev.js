const path = require("path"); // eslint-disable-line @typescript-eslint/no-var-requires

module.exports = {
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: "./dist",
        compress: true,
        port: 9000,
    },
    entry: "./src/index.ts",
    output: {
        library: "Tetris",
        libraryTarget: "umd",
        filename: "tetris-ts.js",
        path: path.resolve(__dirname, "dist"),
    },
    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"],
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
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
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
