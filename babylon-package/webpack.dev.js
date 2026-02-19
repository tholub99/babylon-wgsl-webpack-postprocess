import { merge } from 'webpack-merge';

import common from './webpack.common.js';

export default merge(common, {
    mode: 'development',
    devServer: {
        static: {
            directory: './samples',
        },
        devMiddleware: {
            publicPath: '/dist/',
        },
        open: true,
    },
});