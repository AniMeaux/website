const withPwa = require("next-pwa")({
  disable: process.env.NODE_ENV === "development",
  dest: "./public",
});

module.exports = withPwa({
  distDir: "./build",
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },

  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
    firebasePublicApiKey: process.env.FIREBASE_PUBLIC_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    sentryDsn: process.env.SENTRY_DSN,
  },

  rewrites: () => [{ source: "/healthcheck", destination: "/api/healthcheck" }],

  webpack(config) {
    // Inline SVG.
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
});
