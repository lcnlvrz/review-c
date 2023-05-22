const base = require('configs/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...base,
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      colors: {
        ...base.theme.extend.colors,
        primary: '#0f172a',
      },
    },
  },
}
