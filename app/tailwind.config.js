/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/host/**/*.{ts,tsx}", "./src/App.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
};
