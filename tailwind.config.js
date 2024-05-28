module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        font: {
          100: 'rgb(var(--font-100) / <alpha-value>)',
          200: 'rgb(var(--font-200) / <alpha-value>)',
          300: 'rgb(var(--font-300) / <alpha-value>)',
          400: 'rgb(var(--font-400) / <alpha-value>)',
          500: 'rgb(var(--font-500) / <alpha-value>)',
          600: 'rgb(var(--font-600) / <alpha-value>)',
          700: 'rgb(var(--font-700) / <alpha-value>)',
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
