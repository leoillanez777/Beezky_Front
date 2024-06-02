/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'body': [ 'Nunito Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui', 'Segoe UI', 
            'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 
            'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
        ]
      }
    },
  },
  plugins: [],
}