export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // ✅ Disable this rule because React 17+ no longer requires import
      'react/react-in-jsx-scope': 'off',
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
