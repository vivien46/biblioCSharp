import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.tsx',
    
  ],
  theme: {
    extend: {
      screens: {
        'xs': '275px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
    },
  },
},
  plugins: [],
} satisfies Config