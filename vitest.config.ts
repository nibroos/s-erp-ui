import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

// Test config is deliberately minimal. The repository has no suite yet; this
// exists so `bun run test` is a real command that reports honestly (zero tests
// is reported as zero tests, not as a pass) and so the first test someone
// writes has somewhere to land.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['**/*.{test,spec}.{ts,js}'],
    exclude: ['node_modules', '.nuxt', '.output', 'dist'],
    passWithNoTests: true,
    reporters: ['default', 'junit'],
    outputFile: { junit: 'reports/junit/vitest.xml' },
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      // cobertura is what the Jenkins coverage parser reads.
      reporter: ['text-summary', 'cobertura'],
      include: ['composables/**', 'stores/**', 'utils/**', 'middleware/**'],
      exclude: ['**/*.d.ts', '**/types/**'],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
