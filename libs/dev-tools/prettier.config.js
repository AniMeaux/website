export default createConfig()

/**
 * Returns a Prettier configuration object.
 *
 * @param {Object} [options={}] Optional configuration overrides.
 * @param {string} [options.tailwindConfig] URL or path to the Tailwind CSS
 *   configuration. `prettier-plugin-tailwindcss` plugin will only be used if
 *   `tailwindConfig` or `tailwindStylesheet` is provided.
 * @param {string} [options.tailwindStylesheet] URL or path to the Tailwind CSS
 *   stylesheet. `prettier-plugin-tailwindcss` plugin will only be used if
 *   `tailwindConfig` or `tailwindStylesheet` is provided.
 * @returns {import("prettier").Config} The configuration object.
 */
export function createConfig({ tailwindConfig, tailwindStylesheet } = {}) {
  return {
    // We prefer automatic text wrapping in markdown because:
    //
    // - It eliminates the need to babysit linebreaks.
    // - It improves source readability.
    // - It follows markdown specs, which our tools also adhere to.
    //
    // https://prettier.io/docs/options#prose-wrap
    proseWrap: "always",

    // We prefer omitting semicolons because:
    //
    // - It makes refactoring easier by avoiding semicolons babysitting.
    // - ESLint's `no-unexpected-multiline` rule prevents issues with confusing
    //   line chaining.
    // - Our build tools automatically inserts semicolons for us.
    //
    // https://prettier.io/docs/options#semicolons
    // https://github.com/epicweb-dev/config/blob/main/docs/decisions/007-no-semi.md
    semi: false,

    // We prefer double quotes for strings because:
    //
    // - They're the standard in most programming languages.
    // - Single quotes are more commonly used in written text.
    //
    // https://prettier.io/docs/en/options#quotes
    singleQuote: false,

    ...(tailwindConfig != null || tailwindStylesheet != null
      ? {
          plugins: [
            // Sort Tailwind classes.
            //
            // /!\ Must come last.
            //
            // https://github.com/tailwindlabs/prettier-plugin-tailwindcss
            // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/tree/main#compatibility-with-other-prettier-plugins
            "prettier-plugin-tailwindcss",
          ],

          // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/tree/main#options
          tailwindFunctions: ["cn"],

          // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/tree/main#specifying-your-tailwind-javascript-config-path-tailwind-css-v3
          tailwindConfig,

          // https://github.com/tailwindlabs/prettier-plugin-tailwindcss/tree/main#specifying-your-tailwind-stylesheet-path-tailwind-css-v4
          tailwindStylesheet,
        }
      : null),
  }
}
