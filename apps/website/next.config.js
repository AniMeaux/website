"use strict";

module.exports = {
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
};
