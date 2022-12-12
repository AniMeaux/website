import {
  FacetHit,
  Hit,
  SearchForFacetValuesResponse,
  SearchResponse,
} from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "../../core/db";
import {
  AnimalFromAlgolia,
  ANIMAL_INDEX_NAME,
} from "../../entities/animal.entity";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "./shared";

const DEFAULT_PAGE_SIZE = 20;

export const animalHandlers = [
  ...createPostHandlers(
    `/1/indexes/${ANIMAL_INDEX_NAME}/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const page = body.page || 0;
      const query = body.query || "";
      const pageSize = body.hitsPerPage ?? DEFAULT_PAGE_SIZE;

      const where: Prisma.AnimalWhereInput = {
        name: query === "" ? undefined : { contains: query },
      };

      const [count, animals] = await Promise.all([
        prisma.animal.count({ where }),
        prisma.animal.findMany({
          where,
          skip: page * pageSize,
          take: pageSize,
          orderBy: [
            { name: "asc" },
            // In case of identical name, sort by id to make sure pagination is
            // stable.
            { id: "asc" },
          ],
          select: {
            id: true,
            name: true,
            alias: true,
            status: true,
            species: true,
            pickUpLocation: true,
          },
        }),
      ]);

      const responseBody: SearchResponse<AnimalFromAlgolia> = {
        nbHits: count,
        page,
        nbPages: Math.ceil(count / pageSize),
        hitsPerPage: pageSize,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: animals.map<Hit<AnimalFromAlgolia>>((animal) => ({
          ...animal,
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
                ? undefined
                : {
                    value: animal.alias,
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
    `/1/indexes/${ANIMAL_INDEX_NAME}/facets/pickUpLocation/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const facetQuery = body.facetQuery || "";

      const locations = await prisma.animal.groupBy({
        by: ["pickUpLocation"],
        _count: {
          pickUpLocation: true,
        },
        where: {
          pickUpLocation:
            facetQuery === "" ? { not: null } : { contains: facetQuery },
        },
        orderBy: {
          _count: {
            pickUpLocation: "desc",
          },
        },
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

  ...createBatchHandlers(`/1/indexes/${ANIMAL_INDEX_NAME}/batch`),
];
