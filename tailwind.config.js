module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        brown: {
          100: 'rgb(var(--brown-100) / <alpha-value>)',
          200: 'rgb(var(--brown-200) / <alpha-value>)',
          300: 'rgb(var(--brown-300) / <alpha-value>)',
          400: 'rgb(var(--brown-400) / <alpha-value>)',
          500: 'rgb(var(--brown-500) / <alpha-value>)',
          600: 'rgb(var(--brown-600) / <alpha-value>)',
          700: 'rgb(var(--brown-700) / <alpha-value>)',
        },
        background: {
          100: 'rgb(var(--background-100) / <alpha-value>)',
          200: 'rgb(var(--background-200) / <alpha-value>)',
          300: 'rgb(var(--background-300) / <alpha-value>)',
          400: 'rgb(var(--background-400) / <alpha-value>)',
          500: 'rgb(var(--background-500) / <alpha-value>)',
          600: 'rgb(var(--background-600) / <alpha-value>)',

        },
        red: {
          100: 'rgb(var(--red-100) / <alpha-value>)'
        },
      },
    },
  },
  plugins: [],
};
