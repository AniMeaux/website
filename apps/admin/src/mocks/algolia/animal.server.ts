import { algolia } from "#core/algolia/algolia.server";
import { prisma } from "#core/prisma.server";
import type { FacetBody, QueryBody } from "#mocks/algolia/shared.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "#mocks/algolia/shared.server";
import type {
  FacetHit,
  Hit,
  SearchForFacetValuesResponse,
  SearchResponse,
} from "@algolia/client-search";
import type { Animal, SerializeObject } from "@animeaux/algolia-client";
import type { Prisma } from "@prisma/client";
import { HttpResponse } from "msw";
import { promiseHash } from "remix-utils/promise";
import invariant from "tiny-invariant";

export const animalHandlers = [
  ...createPostHandlers<QueryBody>(
    `/1/indexes/${algolia.animal.index.indexName}/query`,
    async ({ request }) => {
      const body = await request.json();
      const query = body.query || "";
      const page = body.page ?? 0;
      const hitsPerPage = body.hitsPerPage ?? 100;

      const where: Prisma.AnimalWhereInput = {};
      if (query !== "") {
        where.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { alias: { contains: query, mode: "insensitive" } },
        ];
      }

      const { totalCount, animals } = await promiseHash({
        totalCount: prisma.animal.count({ where }),
        animals: prisma.animal.findMany({
          where,
          orderBy: { name: "asc" },
          take: hitsPerPage,
          skip: page * hitsPerPage,
          select: {
            alias: true,
            id: true,
            name: true,
            pickUpDate: true,
            pickUpLocation: true,
            species: true,
            status: true,
          },
        }),
      });

      const responseBody: SearchResponse<SerializeObject<Animal>> = {
        nbHits: totalCount,
        page,
        nbPages: Math.ceil(totalCount / hitsPerPage),
        hitsPerPage,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: animals.map<Hit<SerializeObject<Animal>>>((animal) => ({
          ...animal,
          pickUpDate: animal.pickUpDate.getTime(),
          objectID: animal.id,
          _highlightResult: {
            name: {
              value: highlightValue(animal.name, { search: query }),
              matchLevel: "full",
              fullyHighlighted: true,
              matchedWords: [],
            },
            alias:
              animal.alias == null
                ? null
                : {
                    value: highlightValue(animal.alias, { search: query }),
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

  ...createPostHandlers<FacetBody>(
    `/1/indexes/${algolia.animal.index.indexName}/facets/pickUpLocation/query`,
    async ({ request }) => {
      const body = await request.json();
      const facetQuery = body.facetQuery || "";

      const where: Prisma.AnimalWhereInput = {};
      if (facetQuery === "") {
        where.pickUpLocation = { not: null };
      } else {
        where.pickUpLocation = { contains: facetQuery, mode: "insensitive" };
      }

      const locations = await prisma.animal.groupBy({
        by: ["pickUpLocation"],
        _count: { pickUpLocation: true },
        where,
        orderBy: {
          _count: { pickUpLocation: "desc" },
        },
        take: body.maxFacetHits,
      });

      const response: SearchForFacetValuesResponse = {
        exhaustiveFacetsCount: true,
        processingTimeMS: 1,
        facetHits: locations.map<FacetHit>((location) => {
          invariant(
            location.pickUpLocation != null,
            "pickUpLocation must be defined",
          );

          return {
            value: location.pickUpLocation,
            highlighted: highlightValue(location.pickUpLocation, {
              search: facetQuery,
            }),
            count: location._count.pickUpLocation,
          };
        }),
      };

      return HttpResponse.json(response);
    },
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.animal.index.indexName}/batch`),
];
