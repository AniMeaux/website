import { algolia } from "#core/algolia/algolia.server";
import { prisma } from "#core/prisma.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "#mocks/algolia/shared.server";
import type { Hit, SearchResponse } from "@algolia/client-search";
import type { Color, SerializeObject } from "@animeaux/algolia-client";
import type { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils/promise";

export const colorHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.color.index.indexName}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";
      const page = body.page ?? 0;

      const where: Prisma.ColorWhereInput = {};
      if (query !== "") {
        where.name = { contains: query, mode: "insensitive" };
      }

      const { totalCount, colors } = await promiseHash({
        totalCount: prisma.color.count({ where }),
        colors: prisma.color.findMany({
          where,
          orderBy: { name: "asc" },
          take: body.hitsPerPage,
          skip: page * body.hitsPerPage,
          select: { id: true, name: true },
        }),
      });

      const responseBody: SearchResponse<SerializeObject<Color>> = {
        nbHits: totalCount,
        page,
        nbPages: Math.ceil(totalCount / body.hitsPerPage),
        hitsPerPage: body.hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: colors.map<Hit<SerializeObject<Color>>>((color) => ({
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
    },
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.color.index.indexName}/batch`),
];
