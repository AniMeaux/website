import fs from "fs";
import path from "path";
import util from "util";

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const SRC = path.resolve(__dirname, "../imageShapes");
const DEST = path.resolve(__dirname, "../src/generated");
const SPRITE_DEST = path.join(DEST, "imageShapesSprite.svg");
const TYPES_DEST = path.join(DEST, "imageShapeId.ts");

generateImageShapesSprite().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generateImageShapesSprite() {
  const shouldMinify = process.argv.some((arg) => arg === "--minify");

  const filenames = await readdir(SRC);

  const contents = await Promise.all(
    filenames.map(async (filename) => {
      const svg = await readFile(path.join(SRC, filename), "utf-8");

      const symbol = svg
        // Replace svg by symbol.
        .replace("<svg", "<symbol")
        .replace("</svg>", "</symbol>")
        .replace("<path", `<path id="${path.basename(filename, ".svg")}"`)
        // Remove attributes.
        .replace(/\s*(width|height|fill|xmlns(:xlink)?|viewBox)="[^"]+"/g, "");

      return symbol;
    }),
  );

  let sprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
${contents.map((symbol) => `    ${symbol}`).join("\n")}
  </defs>
</svg>`;

  if (shouldMinify) {
    sprite = sprite.replace(/\n\s*/g, "");
  }

  await mkdir(DEST, { recursive: true });

  await writeFile(SPRITE_DEST, sprite);
  console.info(`🎉 Sprite file wrote: ${relativeToCwd(SPRITE_DEST)}`);

  const component = `export const imageShapesIds = [
${filenames
  .map((filename) => `  "${path.basename(filename, ".svg")}",`)
  .join("\n")}
] as const;

export type ImageShapeId = typeof imageShapesIds[number];
`;

  await writeFile(TYPES_DEST, component);
  console.info(`🎉 Image shapes IDs file wrote: ${relativeToCwd(TYPES_DEST)}`);
}

function relativeToCwd(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}
