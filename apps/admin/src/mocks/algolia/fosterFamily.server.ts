import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
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
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const query = body.query || "";

      const where: Prisma.FosterFamilyWhereInput = {};
      if (query !== "") {
        where.displayName = { contains: query, mode: "insensitive" };
      }

      const fosterFamilies = await prisma.fosterFamily.findMany({
        where,
        orderBy: { displayName: "asc" },
        select: { id: true, displayName: true },
        take: body.hitsPerPage,
      });

      const responseBody: SearchResponse<FosterFamilyFromAlgolia> = {
        nbHits: fosterFamilies.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: body.hitsPerPage ?? fosterFamilies.length,
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
