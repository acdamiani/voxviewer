const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      keyframes: {
        scale: {
          '0%, 100%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1)', opacity: '1' },
        },
        spurt: {
          '0%, 100%': { transform: 'scaleY(0.15)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },

      animation: {
        scale: 'scale 2s cubic-bezier(0.87, 0, 0.13, 1) infinite forwards',
        spurt: 'spurt 2s cubic-bezier(0.25, 1, 0.5, 1) infinite forwards',
      },

      boxShadow: {
        highlight:
          '0 3px 9px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.01),inset 0 1px 0 rgba(255,255,255,.02)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value,
            };
          },
        },
        {
          values: theme('transitionDelay'),
        },
      );
    }),
  ],
};
