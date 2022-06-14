import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import invariant from "tiny-invariant";
import { prisma } from "../../core/db";
import {
  FosterFamilyFromAlgolia,
  FOSTER_FAMILY_INDEX_NAME,
} from "../../entities/fosterFamily.entity";
import {
  createBatchHandlers,
  createPostHandlers,
  highlightValue,
} from "./shared";

export const fosterFamilyHandlers = [
  ...createPostHandlers(
    `/1/indexes/${FOSTER_FAMILY_INDEX_NAME}/query`,
    async (req, res, ctx) => {
      invariant(
        req.headers.get("content-type") === "application/x-www-form-urlencoded",
        "Content-Type must be application/x-www-form-urlencoded"
      );

      invariant(typeof req.body === "string", "Body must be a string");
      const body = JSON.parse(req.body);
      const query = body.query || "";

      const where: Prisma.FosterFamilyWhereInput = {
        displayName: query === "" ? undefined : { contains: query },
      };

      const fosterFamilies = await prisma.fosterFamily.findMany({
        where,
        orderBy: { displayName: "asc" },
        select: {
          id: true,
          displayName: true,
        },
      });

      const responseBody: SearchResponse<FosterFamilyFromAlgolia> = {
        nbHits: fosterFamilies.length,
        page: 0,
        nbPages: 1,
        hitsPerPage: fosterFamilies.length,
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
                  highlightPreTag: body.highlightPreTag,
                  highlightPostTag: body.highlightPostTag,
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

  ...createBatchHandlers(`/1/indexes/${FOSTER_FAMILY_INDEX_NAME}/batch`),
];
