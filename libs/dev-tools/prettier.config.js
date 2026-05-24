/** @type {import("prettier").Config} */
const config = {
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
}

export default config
