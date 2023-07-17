import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import { FosterFamilyFromAlgolia } from "~/fosterFamilies/algolia.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";

export const fosterFamilyHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.fosterFamily.indexName}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";
      const page = body.page ?? 0;

      const where: Prisma.FosterFamilyWhereInput = {};
      if (query !== "") {
        where.displayName = { contains: query, mode: "insensitive" };
      }

      const { totalCount, fosterFamilies } = await promiseHash({
        totalCount: prisma.fosterFamily.count({ where }),
        fosterFamilies: prisma.fosterFamily.findMany({
          where,
          orderBy: { displayName: "asc" },
          take: body.hitsPerPage,
          skip: page * body.hitsPerPage,
          select: { id: true, displayName: true },
        }),
      });

      const responseBody: SearchResponse<FosterFamilyFromAlgolia> = {
        nbHits: totalCount,
        page: page,
        nbPages: Math.ceil(totalCount / body.hitsPerPage),
        hitsPerPage: body.hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: fosterFamilies.map<Hit<FosterFamilyFromAlgolia>>(
          (fosterFamily) => ({
            ...fosterFamily,
            objectID: fosterFamily.id,
            _highlightResult: {
              displayName: {
                value: highlightValue(fosterFamily.displayName, {
                  search: query,
                }),
                matchLevel: "full",
                fullyHighlighted: true,
                matchedWords: [],
              },
            },
          })
        ),
      };

      return res(ctx.json(responseBody));
    }
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.fosterFamily.indexName}/batch`),
];
