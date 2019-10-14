const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackChain = require('webpack-chain');
const config = new WebpackChain();
const isProd = process.env.NODE_ENV === 'production';
config.when(isProd,config=>{
  config.entry('index').add('./src/index.js');
}).when(!isProd,config=>{
  config.entry('index').add('@babel/polyfill').add('./src/index.js');
})

/**
 * module
 */

config
  .module
  .rule("html")
  .test(/\.(htm|html)$/i)
  .use("html")
  .loader('html-loader')
  .options({
    minimize: true
  })

config
  .module
  .rule("compile")
  .test(/\.js$/)
  .include.add(path.join(__dirname,'src')).end()
  .exclude.add(/node_modules/).end()
  .use('babel').loader("babel-loader");

config.when(isProd,config=>{
  config.module.rule("css").test(/\.(sa|sc|c)ss$/)
    .use("style").loader(MiniCssExtractPlugin.loader);
}).when(!isProd,config=>{
  config.module.rule("css").test(/\.(sa|sc|c)ss$/)
    .use("style-loader").loader("style-loader");
});

config.module.rule("css").test(/\.(sa|sc|c)ss$/)
  .use('css').loader("css-loader").end()
  .use('postcss-loader').loader('postcss-loader');

config.module
  .rule('svg')
  .test(/\.(png|jpg|gif)$/)
  .use('file-loader')
  .loader('file-loader')
  .options({})

/**
 * plugin
 */

config.plugin("clear").use(new CleanWebpackPlugin());

config.plugin("html").use(HtmlWebpackPlugin, [{
  /*
   template 参数指定入口 html 文件路径，插件会把这个文件交给 webpack 去编译，
   webpack 按照正常流程，找到 loaders 中 test 条件匹配的 loader 来编译，那么这里 html-loader 就是匹配的 loader
   html-loader 编译后产生的字符串，会由 html-webpack-plugin 储存为 html 文件到输出目录，默认文件名为 index.html
   可以通过 filename 参数指定输出的文件名
   html-webpack-plugin 也可以不指定 template 参数，它会使用默认的 html 模板。
   */
  template: "./public/index.html",
  filename:"index.html",
  /*
   因为和 webpack 4 的兼容性问题，chunksSortMode 参数需要设置为 none
   https://github.com/jantimon/html-webpack-plugin/issues/870
   */
  chunksSortMode: 'none',
  xhtml: true,
  minify: {
      collapseWhitespace: false, //删除空格，但是不会删除SCRIPT、style和textarea中的空格
      conservativeCollapse: false, //删除空格，总是保留一个空格
      removeAttributeQuotes: false, //删除引号，删除不需要引号的值
      useShortDoctype: false, //使用短的文档类型
      removeComments: true,
      collapseBooleanAttributes: true,
      removeScriptTypeAttributes: true
      // more options:
      // https://github.com/kangax/html-minifier#options-quick-reference
  }
}]);

module.exports = config.toConfig();