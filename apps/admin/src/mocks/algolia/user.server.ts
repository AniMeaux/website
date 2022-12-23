import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { algolia } from "~/core/algolia/algolia.server";
import { prisma } from "~/core/db.server";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "~/mocks/algolia/shared.server";
import { UserFromAlgolia } from "~/users/algolia.server";

export const userHandlers = [
  ...createPostHandlers(
    `/1/indexes/${algolia.user.indexName}/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const query = body.query || "";

      const where: Prisma.UserWhereInput = {};
      if (query !== "") {
        where.OR = [
          { displayName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ];
      }

      const breeds = await prisma.user.findMany({
        where,
        orderBy: { displayName: "asc" },
        select: {
          displayName: true,
          email: true,
          groups: true,
          id: true,
          isDisabled: true,
        },
        take: body.hitsPerPage,
      });

      const responseBody: SearchResponse<UserFromAlgolia> = {
        nbHits: breeds.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: body.hitsPerPage ?? breeds.length,
        exhaustiveNbHits: true,
        query,
        params: "",
        renderingContent: {},
        processingTimeMS: 1,
        hits: breeds.map<Hit<UserFromAlgolia>>((user) => ({
          ...user,
          objectID: user.id,
          _highlightResult: {
            displayName: {
              value: highlightValue(user.displayName, { search: query }),
              matchLevel: "full",
              fullyHighlighted: true,
              matchedWords: [],
            },
            email: {
              value: highlightValue(user.email, { search: query }),
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

  ...createBatchHandlers(`/1/indexes/${algolia.user.indexName}/batch`),
];
