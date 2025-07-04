import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, BuildOptions } from 'vite'
import * as path from 'path'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import legacy from '@vitejs/plugin-legacy'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const inZZD = process.env.VITE_RUN_ENV === 'ZZD'
const isProd = process.env.VITE_BUILD_ENV === 'prod'
const buildConf = (): BuildOptions => {
  const conf: BuildOptions = {
    outDir: 'dist',
    sourcemap: !isProd,
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash-es'],
          elementPlus: ['element-plus']
        }
      }
    }
  }
  // conf.target = 'chrome63'
  // 兼容国产低版本浏览器，红莲花和奇安信浏览器
  conf.target = 'es2015'
  return conf

}
export default () => {
  return defineConfig({
    base: './',
    build: buildConf(),
    server: {
      port: 4050,
      host: true,
      proxy: {
        // api proxy
        '/api-server-address': {
          target: 'http://172.16.208.12:18590',
          changeOrigin: true,
          rewrite: path =>
            path.replace(
              new RegExp('^/api-server-address'),
              '/api-server-address'
            )
        }
      }
    },
    resolve: {
      alias: [
        { find: /^~/, replacement: '' },
        { find: '@', replacement: path.resolve(__dirname, 'src') }
      ]
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 使用新版 Dart Sass API
          implementation: require('sass'),
          additionalData: `@use "@/styles/element.scss" as *;
          @use "@/styles/theme.scss" as *;
          `
        }
      }
    },
    plugins: [
      vue(),
      VueSetupExtend(),
      // 代码检查插件，开发阶段可以通过点击浏览器上的DOM元素定位到源码
      codeInspectorPlugin({
        bundler: 'vite',
        editor: 'cursor'
      }),
      ElementPlus({
        useSource: true,
        format: 'esm'
      }),

      AutoImport({
        // 这里列出了你需要自动导入的模块或库
        imports: ['vue', 'vue-router'],
        // 生成类型声明文件
        dts: 'src/typings/auto-imports.d.ts'
      }),
      legacy()
      // inZZD &&
      //   legacy({
      //     targets: ['Chrome 63'],
      //     modernPolyfills: true
      //   })
    ]
  })
}
