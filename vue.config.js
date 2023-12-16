const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './', // 相对路径、CDN路径
  outputDir: 'dist',
  devServer: {
    client: {
      overlay: false
    },
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
