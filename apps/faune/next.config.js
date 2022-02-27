const withPwa = require("next-pwa");

module.exports = withPwa({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    dest: "public",
  },
  distDir: "build",
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
    autoPrerender: false,
  },
  experimental: {
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

  webpack(config) {
    // Inline SVG.
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
});
