module.exports = {
  plugins: [
    require('tailwind-scrollbar'),
  ],
  theme: {
    extend: {
      fontFamily: {
         base: ["Kanit", "sans-serif"],
         sans: ["Kanit", "sans-serif"],
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
};
