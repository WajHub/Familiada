/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/host/**/*.{ts,tsx}",
    "./src/App.tsx",
    "./src/pages/BoardPanelPage.tsx",
    "./src/components/BoardPanelPage/**/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
