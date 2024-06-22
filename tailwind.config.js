const colors = require('tailwindcss/colors')

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
    container: {
      center: true,
      screens: {
        sm: '100%',
        md: '100%',
        lg: '960px',
        xl: '960px',
        '2xl': '960px',
        '3xl': '960px',
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
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}

export default config
