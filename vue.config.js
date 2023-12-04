const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // 相对路径、CDN路径
  outputDir: 'dist',
})
