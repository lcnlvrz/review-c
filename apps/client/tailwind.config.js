const { fontFamily } = require('tailwindcss/defaultTheme')

const base = require('configs/tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      fontFamily: {
        sans: ['var(--dm-font)', ...fontFamily.sans],
      },
      colors: {
        ...base.theme.extend.colors,
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
      },
    },
  },
}
