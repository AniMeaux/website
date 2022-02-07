module.exports = {
  apps: [
    createApp({
      name: "api",
      cwd: "apps/api",
      script: "node .",
      env: { NODE_ENV: "production" },
    }),

    createApp({
      name: "faune",
      cwd: "apps/faune",
      script: "node node_modules/.bin/next start -p 3001",
    }),

    createApp({
      name: "website",
      cwd: "apps/website",
      script: "node node_modules/.bin/next start -p 3000",
    }),
  ],
};

function createApp(config) {
  const logFile = `${__dirname}/logs/${config.name}.log`;

  return {
    instances: 1,
    autorestart: true,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    vizion: false,
    error_file: logFile,
    out_file: logFile,
    ...config,
  };
}
