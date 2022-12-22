import { algolia } from "#/core/algolia/algolia.server";
import { prisma } from "#/core/db.server";
import { isDefined } from "#/core/isDefined";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "#/mocks/algolia/shared.server";
import { SearchableResourceFromAlgolia } from "#/searchableResources/algolia.server";
import { SearchableResourceType } from "#/searchableResources/type";
import { Hit, SearchResponse } from "@algolia/client-search";
import zip from "lodash.zip";
import invariant from "tiny-invariant";

export const searchableResourcesHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.searchableResource.indexName}/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const query = body.query || "";

      const [animals, events, fosterFamilies, users] = await Promise.all([
        (async () => {
          const animals = await prisma.animal.findMany({
            where: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { alias: { contains: query, mode: "insensitive" } },
              ],
            },
            orderBy: { name: "asc" },
            select: { alias: true, id: true, name: true, pickUpDate: true },
            take: body.hitsPerPage,
          });

          return animals.map<Hit<SearchableResourceFromAlgolia>>((animal) => ({
            objectID: animal.id,
            type: SearchableResourceType.ANIMAL,
            data: {
              ...animal,
              pickUpDate: animal.pickUpDate.getTime(),
            },
            _highlightResult: {
              data: {
                alias:
                  animal.alias == null
                    ? undefined
                    : {
                        value: highlightValue(animal.alias, { search: query }),
                        matchLevel: "full",
                        fullyHighlighted: true,
                        matchedWords: [],
                      },
                name: {
                  value: highlightValue(animal.name, { search: query }),
                  matchLevel: "full",
                  fullyHighlighted: true,
                  matchedWords: [],
                },
              },
            },
          }));
        })(),

        (async () => {
          const events = await prisma.event.findMany({
            where: { title: { contains: query, mode: "insensitive" } },
            orderBy: { endDate: "desc" },
            select: { endDate: true, id: true, title: true },
            take: body.hitsPerPage,
          });

          return events.map<Hit<SearchableResourceFromAlgolia>>((event) => ({
            objectID: event.id,
            type: SearchableResourceType.EVENT,
            data: {
              ...event,
              endDate: event.endDate.getTime(),
            },
            _highlightResult: {
              data: {
                title: {
                  value: highlightValue(event.title, { search: query }),
                  matchLevel: "full",
                  fullyHighlighted: true,
                  matchedWords: [],
                },
              },
            },
          }));
        })(),

        (async () => {
          const fosterFamilies = await prisma.fosterFamily.findMany({
            where: { displayName: { contains: query, mode: "insensitive" } },
            orderBy: { displayName: "asc" },
            select: { displayName: true, id: true },
            take: body.hitsPerPage,
          });

          return fosterFamilies.map<Hit<SearchableResourceFromAlgolia>>(
            (fosterFamily) => ({
              objectID: fosterFamily.id,
              type: SearchableResourceType.FOSTER_FAMILY,
              data: fosterFamily,
              _highlightResult: {
                data: {
                  displayName: {
                    value: highlightValue(fosterFamily.displayName, {
                      search: query,
                    }),
                    matchLevel: "full",
                    fullyHighlighted: true,
                    matchedWords: [],
                  },
                },
              },
            })
          );
        })(),

        (async () => {
          const users = await prisma.user.findMany({
            where: { displayName: { contains: query, mode: "insensitive" } },
            orderBy: { displayName: "asc" },
            select: { displayName: true, id: true },
            take: body.hitsPerPage,
          });

          return users.map<Hit<SearchableResourceFromAlgolia>>((user) => ({
            objectID: user.id,
            type: SearchableResourceType.USER,
            data: user,
            _highlightResult: {
              data: {
                displayName: {
                  value: highlightValue(user.displayName, { search: query }),
                  matchLevel: "full",
                  fullyHighlighted: true,
                  matchedWords: [],
                },
              },
            },
          }));
        })(),
      ]);

      const hits = zip(animals, events, fosterFamilies, users)
        .flat()
        .filter(isDefined);

      const responseBody: SearchResponse<SearchableResourceFromAlgolia> = {
        nbHits: hits.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: body.hitsPerPage ?? hits.length,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: hits.slice(0, body.hitsPerPage),
      };

      return res(ctx.json(responseBody));
    }
  ),

  ...createBatchHandlers(
    `/1/indexes/${algolia.searchableResource.indexName}/batch`
  ),
];
