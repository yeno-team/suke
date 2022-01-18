const CracoLessPlugin = require("craco-less")
const path = require('path');
const webpack = require('webpack');

module.exports = {
    webpack: {
      plugins: {
        add: [
          new webpack.ProvidePlugin({
            process: 'process/browser',
          })
        ]
      }
    },
    plugins: [
      {
        plugin: {
          overrideWebpackConfig: ({ webpackConfig }) => {
            const oneOfRule = webpackConfig.module.rules.find(
              (rule) => rule.oneOf,
            );
            if (oneOfRule) {
              const tsxRule = oneOfRule.oneOf.find(
                (rule) => rule.test && rule.test.toString().includes('tsx'),
              );

              const newIncludePaths = [
                // relative path to my yarn workspace library  
                path.resolve(__dirname, '../suke-core'),
                path.resolve(__dirname , "../suke-util")
              ];
              
              if (tsxRule) {
                if (Array.isArray(tsxRule.include)) {
                  tsxRule.include = [...tsxRule.include, ...newIncludePaths];
                } else {
                  tsxRule.include = [tsxRule.include, ...newIncludePaths];
                }
              }
            }
          return webpackConfig;
        },
      },
    },
  ],
    style: {
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
        ],
      },
    },
  }