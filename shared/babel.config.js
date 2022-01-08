module.exports = {
  presets: [
    [
      // Latest stable ECMAScript features
      "@babel/preset-env",
      {
        // Allow importing core-js in entrypoint and use browserlist to select polyfills
        useBuiltIns: "entry",
        // Set the corejs version we are using to avoid warnings in console
        corejs: 3,
        // TODO: Do not transform modules to CJS once NextJS support
        // node_module transpilation
        // https://github.com/vercel/next.js/issues/706
        modules: "commonjs",
        // Exclude transforms that make all code slower
        exclude: ["transform-typeof-symbol"],
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    // Adds Numeric Separators
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator",
  ],
};
