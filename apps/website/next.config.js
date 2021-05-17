"use strict";

module.exports = {
  distDir: "build",
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
    autoPrerender: false,
  },
  experimental: {
    scrollRestoration: true,
  },

  webpack(config) {
    // Inline SVG.
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["@svgr/webpack"],
    });

    // Import Markdown as raw strings.
    config.module.rules.push({
      test: /\.md$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["raw-loader"],
    });

    return config;
  },
};
