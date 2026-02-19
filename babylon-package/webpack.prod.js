import TerserPlugin from 'terser-webpack-plugin';
import { merge } from 'webpack-merge';

import common from './webpack.common.js';

export default merge(common, {
    mode: 'production',
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        pure_funcs: ['console.assert', 'console.debug', 'console.error', 'console.warn'],
                    },
                },
            }),
        ],
    },
});