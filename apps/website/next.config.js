module.exports = {
  distDir: "build",
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
    autoPrerender: false,
  },
  experimental: {
    styledComponents: true,
    scrollRestoration: true,
  },

  publicRuntimeConfig: {
    apiUrl: process.env.API_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    sentryDsn: process.env.SENTRY_DSN,
  },

  webpack(config) {
    // Inline SVG.
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Import Markdown as raw strings.
    config.module.rules.push({
      test: /\.md$/,
      use: ["raw-loader"],
    });

    return config;
  },
};
