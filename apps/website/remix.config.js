/**
 * @type {import('@remix-run/dev').AppConfig}
 */
export default {
  appDirectory: "./src",
  watchPaths: ["./tailwind.config.ts", "../../libs/"],
  cacheDirectory: "./node_modules/.cache/remix",

  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
  },

  // Required by MSW.
  browserNodeBuiltinsPolyfill: {
    modules: {
      events: true,
      util: true,
    },
  },

  // See https://remix.run/docs/en/v1/api/conventions#serverdependenciestobundle
  serverDependenciesToBundle: [/^@animeaux\//],
};
