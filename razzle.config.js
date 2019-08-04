const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  modify: (baseConfig, { target, dev }, webpack) => {
    const appConfig = Object.assign({}, baseConfig)

    if (target !== 'web') {
      // On the server, we can just simply use css-loader to
      // deal with scss imports
      appConfig.module.rules.push({
        test: /.scss$/,
        use: [{
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'sass-loader', // compiles Sass to CSS
          options: {
            includePaths: [__dirname + '/src/assets/css']
          }
        }]
      })
      return appConfig
    }

    // Setup SCSS

    appConfig.module.rules.push(
      dev
        ? {
          test: /.scss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: false,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9' // React doesn't support IE8 anyway
                    ]
                  })
                ]
              }
            },
            'fast-sass-loader'
          ]
        }
        : {
          test: /.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                  plugins: () => [
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9' // React doesn't support IE8 anyway
                      ]
                    })
                  ]
                }
              },
              'fast-sass-loader'
            ]
          })
        }
    )

    if (!dev) {
      appConfig.plugins.push(
        new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
      )
    }

    return appConfig
  }
}
