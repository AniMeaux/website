import fs from "fs";
import path from "path";
import util from "util";

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const ICON_SRC = path.resolve(__dirname, "../icons");
const ICON_DEST = path.resolve(__dirname, "../src/generated");
const ICON_SPRITE_DEST = path.join(ICON_DEST, "sprite.svg");
const ICON_COMPONENT_DEST = path.join(ICON_DEST, "icon.tsx");

generateIconSprite().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generateIconSprite() {
  const shouldMinify = process.argv.some((arg) => arg === "--minify");

  const iconFilenames = await readdir(ICON_SRC);

  const contents = await Promise.all(
    iconFilenames.map(async (filename) => {
      const svg = await readFile(path.join(ICON_SRC, filename), "utf-8");

      const symbol = svg
        // Replace svg by symbol.
        .replace("<svg", `<symbol id="${path.basename(filename, ".svg")}"`)
        .replace("</svg>", "</symbol>")
        // Remove attributes.
        .replace(/\s*(width|height|fill|xmlns(:xlink)?)="[^"]+"/g, "");

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

  await mkdir(ICON_DEST, { recursive: true });

  await writeFile(ICON_SPRITE_DEST, sprite);
  console.info(`🎉 Sprite file wrote: ${relativeToCwd(ICON_SPRITE_DEST)}`);

  const component = `import sprite from "#/${path.relative(
    path.resolve(__dirname, "../src"),
    ICON_SPRITE_DEST
  )}";

export const iconsIds = [
${iconFilenames
  .map((filename) => `  "${path.basename(filename, ".svg")}",`)
  .join("\n")}
] as const;

type IconId = typeof iconsIds[number];

export type IconProps = React.SVGAttributes<SVGElement> & {
  id: IconId;
};
  
export function Icon({
  id,
  width = "1em",
  height = "1em",
  stroke = "none",
  fill = "currentColor",
  ...rest
}: IconProps) {
  return (
    <svg
      {...rest}
      width={width}
      height={height}
      stroke={stroke}
      fill={fill}
    >
      <use href={\`\${sprite}#\${id}\`} />
    </svg>
  );
}
`;

  await writeFile(ICON_COMPONENT_DEST, component);
  console.info(
    `🎉 Icon component file wrote: ${relativeToCwd(ICON_COMPONENT_DEST)}`
  );
}

function relativeToCwd(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}
