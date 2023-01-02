import { UploadHandler, writeAsyncIterableToWritable } from "@remix-run/node";
import { UploadApiErrorResponse, v2 as cloudinary } from "cloudinary";
import invariant from "tiny-invariant";
import { v4 as uuid } from "uuid";

invariant(
  process.env.CLOUDINARY_CLOUD_NAME != null,
  "CLOUDINARY_CLOUD_NAME must be defined"
);

invariant(
  process.env.CLOUDINARY_API_KEY != null,
  "CLOUDINARY_API_KEY must be defined"
);

invariant(
  process.env.CLOUDINARY_API_SECRET != null,
  "CLOUDINARY_API_SECRET must be defined"
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export class CloudinaryUploadApiError extends Error {
  status: number;

  constructor(cloudinaryError: UploadApiErrorResponse) {
    super(cloudinaryError.message);
    this.status = cloudinaryError.http_code;
  }
}

export function createCloudinaryUploadHandler({
  filter,
}: {
  filter: (args: { name: string }) => boolean;
}): UploadHandler {
  return async ({ name, contentType, data, filename }) => {
    if (
      !filter({ name }) ||
      contentType == null ||
      filename == null ||
      // `filename` is an empty string when the input file is empty.
      filename === ""
    ) {
      return undefined;
    }

    return new Promise<string>(async (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: uuid() },
        (error, result) => {
          if (error != null) {
            reject(new CloudinaryUploadApiError(error));
            return;
          }

          invariant(
            result != null,
            "result should exist when there are no errors."
          );

          resolve(result.public_id);
        }
      );

      await writeAsyncIterableToWritable(data, uploadStream);
    });
  };
}

export async function deleteImage(image: string) {
  try {
    await cloudinary.uploader.destroy(image);
  } catch (error) {
    console.error("Could not delete image:", error);
  }
}
