/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  appDirectory: "./src",
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [
    // These are dependencies of react-markdown.
    // See https://remix.run/docs/en/v1/api/conventions#serverdependenciestobundle
    /^(comma|space)-separated-tokens/,
    /^bail$/,
    /^ccount$/,
    /^character-entities$/,
    /^decode-named-character-reference$/,
    /^escape-string-regexp$/,
    /^hast-util-whitespace$/,
    /^is-plain-obj$/,
    /^markdown-table$/,
    /^mdast-*/,
    /^micromark*/,
    /^property-information$/,
    /^react-markdown$/,
    /^remark-*/,
    /^trough$/,
    /^unified$/,
    /^unist-*/,
    /^vfile*/,
  ],
  future: {
    v2_errorBoundary: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
