import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { ColorFromAlgolia } from "~/colors/algolia.server";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";

export const colorHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.color.indexName}/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const query = body.query || "";

      const where: Prisma.ColorWhereInput = {};
      if (query !== "") {
        where.name = { contains: query, mode: "insensitive" };
      }

      const colors = await prisma.color.findMany({
        where,
        orderBy: { name: "asc" },
        select: { id: true, name: true },
        take: body.hitsPerPage,
      });

      const responseBody: SearchResponse<ColorFromAlgolia> = {
        nbHits: colors.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: body.hitsPerPage ?? colors.length,
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

  ...createBatchHandlers(`/1/indexes/${algolia.color.indexName}/batch`),
];
