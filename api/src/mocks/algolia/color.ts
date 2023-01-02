import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import { prisma } from "../../core/db";
import {
  ColorFromAlgolia,
  COLOR_INDEX_NAME,
} from "../../entities/animalColor.entity";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "./shared";

export const colorHandlers = [
  ...createPostHandlers(
    `/1/indexes/${COLOR_INDEX_NAME}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";

      const where: Prisma.ColorWhereInput = {
        name: query === "" ? undefined : { contains: query },
      };

      const colors = await prisma.color.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
        },
      });

      const responseBody: SearchResponse<ColorFromAlgolia> = {
        nbHits: colors.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: colors.length,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: colors.map<Hit<ColorFromAlgolia>>((color) => ({
          ...color,
          objectID: color.id,
          _highlightResult: {
            name: {
              value: highlightValue(color.name, { search: query }),
              matchLevel: "full",
              fullyHighlighted: true,
              matchedWords: [],
            },
          },
        })),
      };

      return res(ctx.json(responseBody));
    }
  ),

  ...createBatchHandlers(`/1/indexes/${COLOR_INDEX_NAME}/batch`),
];
