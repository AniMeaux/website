import { FacetHit, SearchForFacetValuesResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";

export const animalHandlers = [
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
