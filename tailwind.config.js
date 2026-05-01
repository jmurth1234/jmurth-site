import colors from 'tailwindcss/colors'
import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '800px',
          },
        },
      },
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
      serif: ['Roboto Slab', 'serif'],
      mono: ['Roboto Mono', 'monospace'],
    },
    colors: {
      ...colors,
      'nav-header': '#1a237e',
      'nav-bar': '#32408f',
    },
  },
  plugins: [
    typography,
    forms({
      strategy: 'class',
    }),
  ],
}

export default config
