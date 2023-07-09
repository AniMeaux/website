import fs from "fs";
import path from "path";
import prettier from "prettier";
import util from "util";
import { colors, screens } from "../tailwind.config";

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const FOLDER_DEST = path.resolve(__dirname, "../src/generated");
const THEME_DEST = path.resolve(FOLDER_DEST, "theme.ts");

generateTheme().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function generateTheme() {
  const prettierOptions = await prettier.resolveConfig(THEME_DEST);
  const content = prettier.format(
    `export type ScreenSize = keyof typeof theme.screens;
    export const theme = ${JSON.stringify({ screens, colors })}`,
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
