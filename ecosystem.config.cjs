const path = require("node:path");
const fs = require("node:fs");

module.exports = {
  apps: [
    ...getPackagesNamesInDir("./apps").map((appName) =>
      createApp({
        name: appName,
        cwd: `./apps/${appName}`,
        script: "pnpm dev",
        watch: ["./tsconfig.json", "./.env*"],
      }),
    ),

    ...getPackagesNamesInDir("./libs").map((libName) =>
      createApp({
        name: `libs/${libName}`,
        cwd: `./libs/${libName}`,
        script: "pnpm dev",
      }),
    ),
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

    ...config,

    // Allow dot files (env) to be watched.
    ignore_watch: ["node_modules/", ...(config.ignore_watch ?? [])],
  };
}

function getPackagesNamesInDir(dir) {
  return fs
    .readdirSync(path.resolve(__dirname, dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
