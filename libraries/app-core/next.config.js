"use strict";

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

  webpack(config) {
    // Inline SVG.
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["@svgr/webpack"],
    });

    return config;
  },
});
