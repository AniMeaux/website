import fs from "fs";
import path from "path";
import util from "util";

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const PICTOGRAM_SRC = path.resolve(__dirname, "../pictograms");
const PICTOGRAM_DEST = path.resolve(__dirname, "../src/generated");
const PICTOGRAM_SPRITE_DEST = path.join(PICTOGRAM_DEST, "pictogramSprite.svg");
const PICTOGRAM_COMPONENT_DEST = path.join(PICTOGRAM_DEST, "pictogram.tsx");

generatePictogramSprite().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generatePictogramSprite() {
  const shouldMinify = process.argv.some((arg) => arg === "--minify");

  const svgFilenames = await readdir(PICTOGRAM_SRC);

  const contents = await Promise.all(
    svgFilenames.map(async (filename) => {
      const svg = await readFile(path.join(PICTOGRAM_SRC, filename), "utf-8");

      const symbol = svg
        // Replace svg by symbol.
        .replace("<svg", `<symbol id="${path.basename(filename, ".svg")}"`)
        .replace("</svg>", "</symbol>")
        // Remove attributes.
        .replace(/\s*(width|height|xmlns(:xlink)?)="[^"]+"/g, "");

      return symbol;
    })
  );

  let sprite = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
${contents.map((symbol) => `    ${symbol}`).join("\n")}
  </defs>
</svg>`;

  if (shouldMinify) {
    sprite = sprite.replace(/\n\s*/g, "");
  }

  await mkdir(PICTOGRAM_DEST, { recursive: true });

  await writeFile(PICTOGRAM_SPRITE_DEST, sprite);
  console.info(`🎉 Sprite file wrote: ${relativeToCwd(PICTOGRAM_SPRITE_DEST)}`);

  const component = `import sprite from "~/${path.relative(
    path.resolve(__dirname, "../src"),
    PICTOGRAM_SPRITE_DEST
  )}";

export const pictogramsIds = [
${svgFilenames
  .map((filename) => `  "${path.basename(filename, ".svg")}",`)
  .join("\n")}
] as const;

type PictogramId = typeof pictogramsIds[number];

export type PictogramProps = React.SVGAttributes<SVGElement> & {
  id: PictogramId;
};
  
export function Pictogram({
  id,
  width = "1em",
  height = "1em",
  stroke = "none",
  ...rest
}: PictogramProps) {
  return (
    <svg
      {...rest}
      width={width}
      height={height}
      stroke={stroke}
    >
      <use href={\`\${sprite}#\${id}\`} />
    </svg>
  );
}
`;

  await writeFile(PICTOGRAM_COMPONENT_DEST, component);
  console.info(
    `🎉 Component file wrote: ${relativeToCwd(PICTOGRAM_COMPONENT_DEST)}`
  );
}

function relativeToCwd(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}
