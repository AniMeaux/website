export default createConfig();

/**
 * Returns a Prettier configuration object.
 *
 * @param {Object} [options={}] Optional configuration overrides.
 * @param {string} [options.tailwindConfig] URL or path to the Tailwind CSS
 *   configuration. `prettier-plugin-tailwindcss` plugin will only be used if
 *   `tailwindConfig` is provided.
 * @returns {import("prettier").Config} The configuration object.
 */
export function createConfig({ tailwindConfig } = {}) {
  return {
    ...(tailwindConfig != null
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
        }
      : null),
  };
}
