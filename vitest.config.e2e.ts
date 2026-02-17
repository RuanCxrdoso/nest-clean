import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    name: 'e2e',
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
})
