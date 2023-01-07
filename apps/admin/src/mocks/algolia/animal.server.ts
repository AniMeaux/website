import {
  FacetHit,
  Hit,
  SearchForFacetValuesResponse,
  SearchResponse,
} from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { AnimalFromAlgolia } from "~/animals/algolia.server";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";

export const animalHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.animal.indexName}/query`,
    async (req, res, ctx) => {
      const body = await req.json();
      const query = body.query || "";

      const where: Prisma.AnimalWhereInput = {};
      if (query !== "") {
        where.OR = [
          { name: { contains: query, mode: "insensitive" } },
          { alias: { contains: query, mode: "insensitive" } },
        ];
      }

      const animals = await prisma.animal.findMany({
        where,
        orderBy: { name: "asc" },
        select: {
          alias: true,
          id: true,
          name: true,
          pickUpDate: true,
          pickUpLocation: true,
          species: true,
          status: true,
        },
        take: body.hitsPerPage,
      });

      const responseBody: SearchResponse<AnimalFromAlgolia> = {
        nbHits: animals.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: body.hitsPerPage ?? animals.length,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: animals.map<Hit<AnimalFromAlgolia>>((animal) => ({
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

      return res(ctx.json(responseBody));
    }
  ),

  ...createPostHandlers(
    `/1/indexes/${algolia.animal.indexName}/facets/pickUpLocation/query`,
    async (req, res, ctx) => {
      const body = await req.json();
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
            "pickUpLocation must be defined"
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

      return res(ctx.json(response));
    }
  ),

  ...createBatchHandlers(`/1/indexes/${algolia.animal.indexName}/batch`),
];
