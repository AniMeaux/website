module.exports = {
  apps: [
    createApp({
      name: "prisma",
      cwd: "./libs/prisma",
      script: "pnpm generate",
      watch: ["./schema.prisma"],
    }),

    createApp({
      name: "admin",
      cwd: "./apps/admin",
      script: "pnpm dev",
      watch: ["./tsconfig.json", "./.env*"],
    }),

    createApp({
      name: "website",
      cwd: "./apps/website",
      script: "pnpm dev",
      watch: ["./tsconfig.json", "./.env*"],
    }),

    createApp({
      name: "show",
      cwd: "./apps/show",
      script: "pnpm dev",
      watch: ["./tsconfig.json", "./.env*"],
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

    ...config,

    // Allow dot files (env) to be watched.
    ignore_watch: ["node_modules/", ...(config.ignore_watch ?? [])],
  };
}
