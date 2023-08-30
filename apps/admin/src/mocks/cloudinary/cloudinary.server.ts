import { createFormData } from "@animeaux/form-data";
import { faker } from "@faker-js/faker";
import type { UploadHandler } from "@remix-run/node";
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { rest } from "msw";
import { z } from "zod";

const ActionFormData = createFormData(
  z.object({
    folder: z.string().optional(),
    public_id: z.string(),
  }),
);

const resolver: Parameters<typeof rest.post>[1] = async (req, res, ctx) => {
  const request = new Request(req.url, {
    method: req.method,
    headers: Array.from(req.headers.entries()),
    body: await req.arrayBuffer(),
  });

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

    return res(ctx.status(400), ctx.json(response));
  }

  let publicId = formData.data.public_id;
  if (formData.data.folder != null) {
    publicId = `${formData.data.folder}/${publicId}`;
  }

  const response: Partial<UploadApiResponse> = {
    // We only use `public_id` from the response.
    public_id: publicId,
  };

  return res(ctx.json(response));
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
  rest.post(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/image/upload",
    resolver,
  ),
  rest.post(
    "https://api.cloudinary.com/v1_1/mock-cloud-name/image/destroy",
    (_req, res, ctx) => res(ctx.json({ result: "ok" })),
  ),
];
