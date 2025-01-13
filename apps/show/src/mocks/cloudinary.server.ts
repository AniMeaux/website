import type { CloudinaryResourcesApiResponse } from "#core/cloudinary/shared.server";
import { SearchParamsReader } from "@animeaux/search-params-io";
import { zu } from "@animeaux/zod-utils";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import type { HttpResponseResolver } from "msw";
import { HttpResponse, http } from "msw";
import { v4 as uuid } from "uuid";

export const cloudinaryHandlers = [
  http.get(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/resources/image/upload",
    getResourcesImageUpload,
  ),

  http.post(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/image/destroy",
    () => HttpResponse.json({ result: "ok" }),
  ),

  http.post(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/image/upload",
    postImageUpload,
  ),
];

async function getResourcesImageUpload({
  request,
}: Parameters<HttpResponseResolver>[0]): Promise<
  Awaited<ReturnType<HttpResponseResolver>>
> {
  const searchParams = GetResourcesImageUploadSearchParams.parse(
    new URL(request.url).searchParams,
  );

  const endIndex = Math.min(
    RESOURCE_COUNT,
    searchParams.nextIndex + searchParams.maxResults,
  );

  const response: CloudinaryResourcesApiResponse = {
    next_cursor: endIndex === RESOURCE_COUNT ? undefined : String(endIndex),
    resources: Array.from(
      { length: endIndex - searchParams.nextIndex },
      () => ({ public_id: uuid(), width: 8000, height: 8000, bytes: 1024 }),
    ),
  };

  return HttpResponse.json(response);
}

const RESOURCE_COUNT = 200;

const GetResourcesImageUploadSearchParams = SearchParamsReader.create({
  keys: { maxResults: "max_results", nextIndex: "next_cursor" },

  parseFunction: ({ keys, getValue }) => {
    return ResourcesImageUploadSearchParamsSchema.parse({
      maxResults: getValue(keys.maxResults),
      nextIndex: getValue(keys.nextIndex),
    });
  },
});

const ResourcesImageUploadSearchParamsSchema = zu.object({
  maxResults: zu.searchParams.number().pipe(
    zu
      .number()
      .int()
      .min(0)
      // Cloudinary default value.
      // https://cloudinary.com/documentation/admin_api#get_resources_optional_parameters
      .catch(10),
  ),

  nextIndex: zu.searchParams.number().pipe(zu.number().int().min(0).catch(0)),
});

async function postImageUpload({
  request,
}: Parameters<HttpResponseResolver>[0]): Promise<
  Awaited<ReturnType<HttpResponseResolver>>
> {
  const formData = await parseFormData(request);

  const submission = parseWithZod(formData, {
    schema: PostImageUploadActionSchema,
  });

  if (submission.status !== "success") {
    const response: UploadApiErrorResponse = {
      http_code: 400,
      message: "Bad request",
      name: "name",
    };

    return HttpResponse.json(response, { status: 400 });
  }

  let publicId = submission.value.public_id;
  if (submission.value.folder != null) {
    publicId = `${submission.value.folder}/${publicId}`;
  }

  // Only add used properties to avoid having to maintain the entire API.
  const response: Partial<UploadApiResponse> = {
    public_id: publicId,
    bytes: submission.value.file.size,
  };

  return HttpResponse.json(response);
}

const PostImageUploadActionSchema = zu.object({
  file: zu.instanceof(File),
  folder: zu.string().optional(),
  public_id: zu.string(),
});
