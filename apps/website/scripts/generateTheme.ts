import fs from "fs";
import path from "path";
import prettier from "prettier";
import resolveConfig from "tailwindcss/resolveConfig";
import invariant from "tiny-invariant";
import util from "util";
import tailwindConfig from "../tailwind.config";

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const FOLDER_DEST = path.resolve(__dirname, "../src/generated");
const THEME_DEST = path.resolve(FOLDER_DEST, "theme.ts");

generateTheme().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generateTheme() {
  const tailwindFullConfig = resolveConfig(tailwindConfig);
  invariant(tailwindFullConfig.theme, "fullConfig.theme should exists");

  // Add here values we need in code.
  // Only add what is actualy needed to keep a minimal size.
  const theme = {
    screens: tailwindFullConfig.theme.screens,
    colors: tailwindFullConfig.theme.colors,
  };

  const prettierOptions = await prettier.resolveConfig(THEME_DEST);
  const content = prettier.format(
    `export type ScreenSize = keyof typeof theme.screens;
    export const theme = ${JSON.stringify(theme)}`,
    {
      ...prettierOptions,
      parser: "typescript",
    }
  );

  await mkdir(FOLDER_DEST, { recursive: true });
  await writeFile(THEME_DEST, content);
  console.info(`🎉 Theme file wrote: ${relativeToCwd(THEME_DEST)}`);
}

function relativeToCwd(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}
