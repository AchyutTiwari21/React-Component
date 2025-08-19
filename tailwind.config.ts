import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // storybook
    './.storybook/**/*.{ts,tsx}',
    './src/**/*.stories.@(ts|tsx)'
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1.25s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
} satisfies Config
