module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    darkMode: 'class',
    extend: {
      colors: {
        primary: {
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
        },
        background: {
          100: 'rgb(var(--background-100) / <alpha-value>)',
          200: 'rgb(var(--background-200) / <alpha-value>)',
          300: 'rgb(var(--background-300) / <alpha-value>)',
          400: 'rgb(var(--background-400) / <alpha-value>)',
          500: 'rgb(var(--background-500) / <alpha-value>)',
          600: 'rgb(var(--background-600) / <alpha-value>)',
          loader: 'rgb(var(--background-loader) / <alpha-value>)',
        },
        heart: {
          100: 'rgb(var(--heart-100) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
};
