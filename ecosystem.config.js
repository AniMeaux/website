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
      script: "yarn dev",
      watch: ["build", ".env*"],
    }),

    createApp({
      name: "prisma",
      cwd: "api",
      script: "yarn dev:prisma",
      watch: ["prisma/schema.prisma"],
    }),

    createApp({
      name: "website",
      cwd: "apps/website",
      script: "yarn dev",
      watch: ["next.config.js", "tsconfig.json", ".env*"],
    }),

    createApp({
      name: "website-remix",
      cwd: "apps/website-remix",
      script: "yarn dev",
      watch: ["./remix.config.js", "tsconfig.json", "./.env*"],
    }),

    createApp({
      name: "website-remix-css",
      cwd: "apps/website-remix",
      script: "yarn build:css",
      watch: ["./tailwind.config.js", "./styles", "./src"],
      ignore_watch: ["generated"],
    }),

    createApp({
      name: "website-remix-icons",
      cwd: "apps/website-remix",
      script: "yarn build:icons",
      watch: ["./icons"],
    }),

    createApp({
      name: "faune",
      cwd: "apps/faune",
      script: "yarn dev",
      watch: ["next.config.js", "tsconfig.json", ".env*"],
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
    ignore_watch: ["node_modules", ...(config.ignore_watch ?? [])],
  };
}
