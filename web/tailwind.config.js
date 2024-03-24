const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'back-100': '#080524',
        'back-200': '#040216',
        'back-300': '#1E2043',
        'border-form': '#2C2C5A',
        'border-main': '#212139',
        'secondary-text': '#9393A9',
        'golden-100': '#936100',
        'golden-200': '#F3BC51',
      }
    },
  },
  plugins: [require('daisyui')],
};
