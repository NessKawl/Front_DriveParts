module.exports = {
  plugins: [
    require('tailwind-scrollbar'),
  ],
  theme: {
    extend: {
      fontFamily: {
         base: ["Kanit", "sans-serif"],
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
  },
};
