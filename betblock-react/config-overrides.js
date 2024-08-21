const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve.fallback = {
        url: require.resolve('url'),
        fs: false,
        path: false,
        os: false,
        assert: require.resolve('assert'),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve('stream-browserify')
    };
    config.resolve.alias = {
        stream: 'stream-browserify',
    }

    return config;
}