module.exports = {
  apps: [
    createApp({
      name: "shared",
      cwd: "./shared",
      script: "yarn build",
      watch: ["./src", "./babel.config.js", "./tsconfig.json"],
    }),

    createApp({
      name: "build-api",
      cwd: "./api",
      script: "yarn build",
      watch: [
        "./src",
        "./babel.config.js",
        "./tsconfig.json",
        "./globals.d.ts",
      ],
    }),

    createApp({
      name: "api",
      cwd: "./api",
      script: "yarn dev",
      watch: ["./build", "./.env*"],
    }),

    createApp({
      name: "prisma",
      cwd: "./api",
      script: "yarn dev:prisma",
      watch: ["./prisma/schema.prisma"],
    }),

    createApp({
      name: "admin",
      cwd: "./apps/admin",
      script: "yarn dev",
      watch: ["./remix.config.js", "./tsconfig.json", "./.env*"],
    }),

    createApp({
      name: "admin-icons",
      cwd: "./apps/admin",
      script: "yarn build:icons",
      watch: ["./icons", "./scripts/generateIconSprite.ts"],
    }),

    createApp({
      name: "admin-theme",
      cwd: "./apps/admin",
      script: "yarn build:theme",
      watch: ["./tailwind.config.js", "./scripts/generateTheme.ts"],
    }),

    createApp({
      name: "website",
      cwd: "./apps/website",
      script: "yarn dev",
      watch: ["./remix.config.js", "./tsconfig.json", "./.env*"],
    }),

    createApp({
      name: "website-icons",
      cwd: "./apps/website",
      script: "yarn build:icons",
      watch: ["./icons", "./scripts/generateIconSprite.ts"],
    }),

    createApp({
      name: "website-theme",
      cwd: "./apps/website",
      script: "yarn build:theme",
      watch: ["./tailwind.config.js", "./scripts/generateTheme.ts"],
    }),

    createApp({
      name: "show",
      cwd: "./apps/show",
      script: "yarn dev",
      watch: ["./remix.config.js", "tsconfig.json", "./.env*"],
    }),

    createApp({
      name: "show-icons",
      cwd: "./apps/show",
      script: "yarn build:icons",
      watch: ["./icons", "./scripts/generateIconSprite.ts"],
    }),

    createApp({
      name: "show-image-shapes",
      cwd: "./apps/show",
      script: "yarn build:image-shapes",
      watch: ["./imageShapes", "./scripts/generateImageShapeSprite.ts"],
    }),

    createApp({
      name: "show-pictograms",
      cwd: "./apps/show",
      script: "yarn build:pictograms",
      watch: ["./pictograms", "./scripts/generatePictogramSprite.ts"],
    }),

    createApp({
      name: "show-theme",
      cwd: "./apps/show",
      script: "yarn build:theme",
      watch: ["./tailwind.config.js", "./scripts/generateTheme.ts"],
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
