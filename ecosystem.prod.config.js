const API_PORT = "4000";
const WEBSITE_PORT = "3000";
const FAUNE_PORT = "3001";

module.exports = {
  apps: [
    createApp({
      name: "api",
      cwd: "api",
      script: "yarn start",
      env: { NODE_ENV: "production", PORT: API_PORT },
    }),

    createApp({
      name: "website",
      cwd: "apps/website",
      script: `yarn start -p ${WEBSITE_PORT}`,
    }),

    createApp({
      name: "faune",
      cwd: "apps/faune",
      script: `yarn start -p ${FAUNE_PORT}`,
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
