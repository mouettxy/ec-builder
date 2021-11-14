import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue(),
    Pages(),
    AutoImport({
      imports: ['vue', 'vue-router', '@vueuse/core'],
      dts: true,
    }),
    Components({
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
        (name: string) => {
          if (name.match(/^N[A-Z]/)) {
            return { importName: name, path: 'naive-ui' }
          }
        },
      ],
      dts: true,
    }),
    Icons({
      autoInstall: true,
    }),
    WindiCSS(),
    PkgConfig(),
    OptimizationPersist(),
  ],

  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core'],
  },
})
