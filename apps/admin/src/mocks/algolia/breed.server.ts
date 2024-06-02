import { algolia } from "#core/algolia/algolia.server";
import { prisma } from "#core/prisma.server";
import type { QueryBody } from "#mocks/algolia/shared.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "#mocks/algolia/shared.server";
import type { Hit, SearchResponse } from "@algolia/client-search";
import type { Breed, SerializeObject } from "@animeaux/algolia-client";
import type { Prisma } from "@prisma/client";
import { HttpResponse } from "msw";
import { promiseHash } from "remix-utils/promise";

export const breedHandlers = [
  ...createPostHandlers<QueryBody>(
    `/1/indexes/${algolia.breed.index.indexName}/query`,
    async ({ request }) => {
      const body = await request.json();
      const query = body.query || "";
      const page = body.page ?? 0;
      const hitsPerPage = body.hitsPerPage ?? 100;

      const where: Prisma.BreedWhereInput = {};
      if (query !== "") {
        where.name = { contains: query, mode: "insensitive" };
      }

      const { totalCount, breeds } = await promiseHash({
        totalCount: prisma.breed.count({ where }),
        breeds: prisma.breed.findMany({
          where,
          orderBy: { name: "asc" },
          take: hitsPerPage,
          skip: page * hitsPerPage,
          select: { id: true, name: true, species: true },
        }),
      });

      const responseBody: SearchResponse<SerializeObject<Breed>> = {
        nbHits: totalCount,
        page,
        nbPages: Math.ceil(totalCount / hitsPerPage),
        hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: breeds.map<Hit<SerializeObject<Breed>>>((breed) => ({
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

      return HttpResponse.json(responseBody);
    },
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.breed.index.indexName}/batch`),
];
