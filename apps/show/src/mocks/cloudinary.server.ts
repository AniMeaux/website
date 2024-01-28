import type { CloudinaryApiResponse } from "#core/cloudinary/shared.server";
import { SearchParamsDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { rest } from "msw";
import { v4 as uuid } from "uuid";

const SearchParams = SearchParamsDelegate.create({
  maxResults: {
    key: "max_results",
    schema: zu.searchParams.number().pipe(
      zu
        .number()
        .int()
        .min(0)
        // Cloudinary default value.
        // https://cloudinary.com/documentation/admin_api#get_resources_optional_parameters
        .catch(10),
    ),
  },
  nextIndex: {
    key: "next_cursor",
    schema: zu.searchParams.number().pipe(zu.number().int().min(0).catch(0)),
  },
});

const RESOURCE_COUNT = 200;

const resolver: Parameters<typeof rest.get>[1] = async (req, res, ctx) => {
  const request = new Request(req.url, {
    method: req.method,
    headers: Array.from(req.headers.entries()),
  });

  const searchParams = SearchParams.parse(new URL(request.url).searchParams);

  const endIndex = Math.min(
    RESOURCE_COUNT,
    searchParams.nextIndex + searchParams.maxResults,
  );

  const response: CloudinaryApiResponse = {
    next_cursor: endIndex === RESOURCE_COUNT ? undefined : String(endIndex),
    resources: Array.from(
      { length: endIndex - searchParams.nextIndex },
      () => ({ public_id: uuid(), width: 8000, height: 8000 }),
    ),
  };

  return res(ctx.json(response));
};

export const cloudinaryHandlers = [
  rest.get(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/resources/image/upload",
    resolver,
  ),
];
