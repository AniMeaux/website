import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import { promiseHash } from "remix-utils";
import { BreedFromAlgolia } from "~/breeds/algolia.server";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";

export const breedHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.breed.indexName}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";
      const page = body.page ?? 0;

      const where: Prisma.BreedWhereInput = {};
      if (query !== "") {
        where.name = { contains: query, mode: "insensitive" };
      }

      const { totalCount, breeds } = await promiseHash({
        totalCount: prisma.breed.count({ where }),
        breeds: prisma.breed.findMany({
          where,
          orderBy: { name: "asc" },
          take: body.hitsPerPage,
          skip: page * body.hitsPerPage,
          select: { id: true, name: true, species: true },
        }),
      });

      const responseBody: SearchResponse<BreedFromAlgolia> = {
        nbHits: totalCount,
        page,
        nbPages: Math.ceil(totalCount / body.hitsPerPage),
        hitsPerPage: body.hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: breeds.map<Hit<BreedFromAlgolia>>((breed) => ({
          ...breed,
          objectID: breed.id,
          _highlightResult: {
            name: {
              value: highlightValue(breed.name, { search: query }),
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

  ...createBatchHandlers(`/1/indexes/${algolia.breed.indexName}/batch`),
];
