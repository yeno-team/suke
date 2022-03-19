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

            webpackConfig.externals = {
              'aws-sdk': 'aws-sdk', 
              'mock-aws-s3': 'mock-aws-s3', 
              'nock': 'nock', 
              'npm': 'npm', 
              'react-native-sqlite-storage': 'react-native-sqlite-storage'
            };

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