import { Hit, SearchResponse } from "@algolia/client-search";
import { Prisma } from "@prisma/client";
import { prisma } from "../../core/db";
import {
  FOSTER_FAMILY_INDEX_NAME,
  FosterFamilyFromAlgolia,
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
      const body = await req.json();
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
