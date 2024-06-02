import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import { faker } from "@faker-js/faker";
import type { UploadHandler } from "@remix-run/node";
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import type { HttpResponseResolver } from "msw";
import { HttpResponse, http } from "msw";

const ActionFormData = FormDataDelegate.create(
  zu.object({
    folder: zu.string().optional(),
    public_id: zu.string(),
  }),
);

const resolver: HttpResponseResolver = async ({ request }) => {
  const rawFormData = await unstable_parseMultipartFormData(
    request,
    unstable_composeUploadHandlers(
      createFileMockUploadHandler(),
      unstable_createMemoryUploadHandler({
        filter: ({ contentType }) => contentType == null,
      }),
    ),
  );

  const formData = ActionFormData.safeParse(rawFormData);
  if (!formData.success) {
    const response: UploadApiErrorResponse = {
      http_code: 400,
      message: "Bad request",
      name: "name",
    };

    return HttpResponse.json(response, { status: 400 });
  }

  let publicId = formData.data.public_id;
  if (formData.data.folder != null) {
    publicId = `${formData.data.folder}/${publicId}`;
  }

  const response: Partial<UploadApiResponse> = {
    // We only use `public_id` from the response.
    public_id: publicId,
  };

  return HttpResponse.json(response);
};

function createFileMockUploadHandler(): UploadHandler {
  return async ({ contentType, filename }) => {
    if (
      contentType == null ||
      filename == null ||
      // `filename` is an empty string when the input file is empty.
      filename === ""
    ) {
      return undefined;
    }

    // Uploading a file is not instantaneous.
    await new Promise((resolve) => {
      setTimeout(resolve, faker.number.int({ min: 2000, max: 5000 }));
    });

    return filename;
  };
}

export const cloudinaryHandlers = [
  http.post(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/image/upload",
    resolver,
  ),
  http.post(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/image/destroy",
    () => HttpResponse.json({ result: "ok" }),
  ),
];
