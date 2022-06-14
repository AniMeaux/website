import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
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
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
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
              value: highlightValue(color.name, {
                search: query,
                highlightPreTag: body.highlightPreTag,
                highlightPostTag: body.highlightPostTag,
              }),
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
