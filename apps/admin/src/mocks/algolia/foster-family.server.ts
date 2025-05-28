import { algolia } from "#core/algolia/algolia.server";
import { prisma } from "#core/prisma.server";
import type { QueryBody } from "#mocks/algolia/shared.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "#mocks/algolia/shared.server";
import type { Hit, SearchResponse } from "@algolia/client-search";
import type { FosterFamily, SerializeObject } from "@animeaux/algolia-client";
import type { Prisma } from "@prisma/client";
import { HttpResponse } from "msw";
import { promiseHash } from "remix-utils/promise";

export const fosterFamilyHandlers = [
  ...createPostHandlers<QueryBody>(
    `/1/indexes/${algolia.fosterFamily.index.indexName}/query`,
    async ({ request }) => {
      const body = await request.json();
      const query = body.query || "";
      const page = body.page ?? 0;
      const hitsPerPage = body.hitsPerPage ?? 10;

      const where: Prisma.FosterFamilyWhereInput = {};
      if (query !== "") {
        where.displayName = { contains: query, mode: "insensitive" };
      }

      where.isBanned = false;

      const { totalCount, fosterFamilies } = await promiseHash({
        totalCount: prisma.fosterFamily.count({ where }),
        fosterFamilies: prisma.fosterFamily.findMany({
          where,
          orderBy: { displayName: "asc" },
          take: hitsPerPage,
          skip: page * hitsPerPage,
          select: { id: true, isBanned: true, displayName: true },
        }),
      });

      const responseBody: SearchResponse<SerializeObject<FosterFamily>> = {
        nbHits: totalCount,
        page: page,
        nbPages: Math.ceil(totalCount / hitsPerPage),
        hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: fosterFamilies.map<Hit<SerializeObject<FosterFamily>>>(
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
          }),
        ),
      };

      return HttpResponse.json(responseBody);
    },
  ),

  ...createBatchHandlers(
    `/1/indexes/${algolia.fosterFamily.index.indexName}/batch`,
  ),
];
