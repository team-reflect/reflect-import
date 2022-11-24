// @ts-check
/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
      convertors: '/src/convertors',
      helpers: '/src/helpers',
      testing: '/src/testing',
    },
  },
})
