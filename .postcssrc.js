// postcss.config.js
module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue ({ file }) {
            return file.indexOf('vant') !== -1 ? 37.5 : 75 
        },
        propList: ['*'],

        // 配置不用转换的样式资源
        exclude: 'github-markdown'
      },
    },
  };