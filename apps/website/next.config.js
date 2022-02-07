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
