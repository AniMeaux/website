import { Color } from "@prisma/client";
import { AlgoliaClient } from "../core/algolia";

export const COLOR_INDEX_NAME = "colors";

export const ColorIndex = AlgoliaClient.initIndex(COLOR_INDEX_NAME);

export type ColorFromAlgolia = Pick<Color, "name">;
