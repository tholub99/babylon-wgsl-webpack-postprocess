import path, { resolve as _resolve } from "path";
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import webpack from 'webpack';

// App directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.esm.json',
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'esbuild-loader',
                options: {
                    target: 'ES2022',
                },
            },
            {
                test: /\.(gif|svg|jpe?g|png|eot|woff|woff2|ttf)$/,
                type: 'asset/inline',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: 'shaders/wgsl/*.fx',
                    to: path.resolve(__dirname, 'dist'),
                },
            ],
        }),
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
    ],
    performance: {
        maxEntrypointSize: 2000000,
        maxAssetSize: 2000000,
    },
    output: {
        path: path.resolve(__dirname, 'dist/lib/esm/js'),
        library: {
            type: 'module',
        },
        module: true,
        clean: true,
    },
    experiments: {
        outputModule: true,
    },
}
