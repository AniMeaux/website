import { watch } from "chokidar";
import { parse } from "node-html-parser";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { oneAtTheTime, relativeToCwd, safelyReadFile } from "./shared";

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = dirname(FILENAME);
const SCRIPT_NAME = relativeToCwd(FILENAME);
const SRC_DIRECTORY = resolve(DIRNAME, "../src");
const ICON_SRC_DIRECTORY = resolve(DIRNAME, "../icons");
const DEST_DIRECTORY = resolve(DIRNAME, "../src/generated");
const SPRITE_DEST_FILE = join(DEST_DIRECTORY, "sprite.svg");
const COMPONENT_DEST_FILE = join(DEST_DIRECTORY, "icon.tsx");

const ARGS = {
  shouldMinify: process.argv.some((arg) => arg === "--minify"),
  shouldWatch: process.argv.some((arg) => arg === "--watch"),
};

// Ensure the destination directory exists.
await mkdir(DEST_DIRECTORY, { recursive: true });

try {
  await buildIcons();
} catch (error) {
  if (!ARGS.shouldWatch) {
    throw error;
  }

  console.error(error);
}

if (ARGS.shouldWatch) {
  // In watch mode we don't want to have parallel builds.
  const safelyBuildIcons = oneAtTheTime(async () => {
    try {
      await buildIcons();
    } catch (error) {
      console.error(error);
    }
  });

  const watcher = watch([ICON_SRC_DIRECTORY], {
    // We already built once.
    ignoreInitial: true,

    // To avoid building to fast.
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100,
    },
  })
    .on("error", console.error)
    .on("all", safelyBuildIcons);

  process.once("SIGINT", async () => {
    try {
      await watcher.close();
    } catch (error) {
      console.error("Could not stop watcher:", error);
    }

    process.exit(0);
  });

  console.log("Watching for changes. Press Ctrl-C to stop.");
}

async function buildIcons() {
  console.log("Building...");

  const icons = await getAllIcons();

  await Promise.all([
    generateIconComponentFile(icons),
    generateSpriteFile(icons),
  ]);
}

type IconDescriptor = {
  /**
   * Absolute pathname of the SVG file.
   */
  pathname: string;

  /**
   * Unique identifier of an icon.
   */
  iconName: string;
};

/**
 * Get all SVG icons from the _icons/_ folder.
 *
 * @returns Icon descriptors.
 */
async function getAllIcons() {
  const filenames = await readdir(ICON_SRC_DIRECTORY);

  // Sort alphabetically to ease search in generated files.
  filenames.sort();

  return filenames.map<IconDescriptor>((filename) => ({
    iconName: basename(filename, ".svg"),
    pathname: join(ICON_SRC_DIRECTORY, filename),
  }));
}

/**
 * Generates the `Icon` component file.
 * The `IconName` type contains all possible names.
 *
 * @param icons All icon descriptors.
 */
async function generateIconComponentFile(icons: IconDescriptor[]) {
  const component = `// This file is generated by ${SCRIPT_NAME}
import sprite from "#${relative(SRC_DIRECTORY, SPRITE_DEST_FILE)}";
import { forwardRef } from "react";

export const Icon = forwardRef<
  React.ComponentRef<"svg">,
  Omit<React.ComponentPropsWithoutRef<"svg">, "id"> & {
    id: IconName;
  }
>(function Icon({ id, ...props }, ref) {
  return (
    <svg
      width="1em"
      height="1em"
      stroke="none"
      fill="currentColor"
      {...props}
      ref={ref}
    >
      <use href={\`\${sprite}#\${id}\`} />
    </svg>
  );
});

export type IconProps = React.ComponentPropsWithoutRef<typeof Icon>;

export type IconName = 
${icons.map((icon) => `  | "${icon.iconName}"`).join("\n")};
`;

  const currentComponent = await safelyReadFile(COMPONENT_DEST_FILE);
  if (currentComponent === component) {
    console.info(
      `Icon component didn't change (${relativeToCwd(COMPONENT_DEST_FILE)})`,
    );

    // The icon component will not change so we don't re-generate it to avoid
    // triggering a re-build of remix.
    return;
  }

  await writeFile(COMPONENT_DEST_FILE, component);
  console.info(`Built icon component (${relativeToCwd(COMPONENT_DEST_FILE)})`);
}

/**
 * Generates the SVG sprite file.
 *
 * @param icons All icon descriptors.
 */
async function generateSpriteFile(icons: IconDescriptor[]) {
  const contents = await Promise.all(icons.map(generateSymbolForIcon));

  let sprite = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    ARGS.shouldMinify
      ? undefined
      : `<!-- This file is generated by ${SCRIPT_NAME} -->`,
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">',
    // Don't wrap `symbol` elements in a `defs` as browser handle them
    // differently.
    // https://stackoverflow.com/a/74173265
    contents.map((content) => `  ${content}`).join("\n"),
    "</svg>",
  ]
    .filter(Boolean)
    .join("\n");

  if (ARGS.shouldMinify) {
    sprite = sprite.replace(/\n\s*/g, "");
  }

  const currentSprite = await safelyReadFile(SPRITE_DEST_FILE);
  if (currentSprite === sprite) {
    console.info(
      `SVG sprite didn't change (${relativeToCwd(SPRITE_DEST_FILE)})`,
    );

    // The SVG sprite will not change so we don't re-generate it to avoid
    // triggering a re-build of remix.
    return;
  }

  await writeFile(SPRITE_DEST_FILE, sprite);
  console.info(`Built SVG sprite (${relativeToCwd(SPRITE_DEST_FILE)})`);
}

async function generateSymbolForIcon(icon: IconDescriptor) {
  const root = parse(await readFile(icon.pathname, "utf-8"));

  const svg = root.querySelector("svg");
  if (svg == null) {
    throw new Error(`No SVG element found in ${icon.pathname}.`);
  }

  // Make it a valid SVG symbol.
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol
  svg.tagName = "symbol";
  svg.setAttribute("id", icon.iconName);
  svg.removeAttribute("xmlns");
  svg.removeAttribute("xmlns:xlink");
  return svg.toString();
}
