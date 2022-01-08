module.exports = {
  apps: [
    createApp({
      name: "shared",
      cwd: "shared",
      script: "yarn build",
      watch: ["src", "babel.config.js", "tsconfig.json"],
    }),

    createApp({
      name: "build-api",
      cwd: "api",
      script: "yarn build",
      watch: ["src", "babel.config.js", "tsconfig.json", "globals.d.ts"],
    }),

    createApp({
      name: "api",
      cwd: "api",
      script: "node .",
      watch: ["build", ".env*"],
      env: { NODE_ENV: "development" },
    }),

    createApp({
      name: "faune",
      cwd: "apps/faune",
      script: "node node_modules/.bin/next dev -p 3001",
      watch: ["next.config.js", "tsconfig.json", ".env*", "next-env.d.ts"],
      env: { BUILD_ID: "dev" },
    }),

    createApp({
      name: "website",
      cwd: "apps/website",
      script: "node node_modules/.bin/next dev -p 3000",
      watch: ["next.config.js", "tsconfig.json", ".env*", "next-env.d.ts"],
      env: { BUILD_ID: "dev" },
    }),
  ],
};

function createApp(config) {
  const logFile = `${__dirname}/logs/${config.name}.log`;

  return {
    instances: 1,
    autorestart: false,
    log_date_format: "HH:mm:ss",
    vizion: false,
    error_file: logFile,
    out_file: logFile,

    // Allow dot files (env) to be watched.
    ignore_watch: ["node_modules"],

    ...config,
  };
}
