import type { FileUpload } from "@mjackson/form-data-parser";
import { LazyFile } from "@mjackson/lazy-file";
import { writeReadableStreamToWritable } from "@remix-run/node";
import { CloudinaryDelegate } from "./delegate";

export class ReversibleUploadCloudinaryDelegate extends CloudinaryDelegate {
  create() {
    const uploadedPublicIds: string[] = [];

    const upload = async (
      fileUpload: FileUpload,
      params: { imageId: string },
    ) => {
      return await new Promise<File>((resolve, reject) => {
        const uploadStream = this.client.uploader.upload_stream(
          { public_id: params.imageId },
          (error, result) => {
            if (error != null || result == null) {
              reject(error ?? new Error("No result nor errors"));

              return;
            }

            uploadedPublicIds.push(result.public_id);

            resolve(
              new LazyFile(
                {
                  byteLength: result.bytes,
                  stream: () => {
                    throw new Error("Not supported");
                  },
                },
                result.public_id,
                { type: fileUpload.type },
              ),
            );
          },
        );

        writeReadableStreamToWritable(fileUpload.stream(), uploadStream);
      });
    };

    const revert = async () => {
      const results = await Promise.all(
        uploadedPublicIds.map((imageId) => this.safeDeleteImage(imageId)),
      );

      const errors = results.filter(Boolean);

      return errors.length > 0 ? errors : undefined;
    };

    return { upload, revert };
  }

  private async safeDeleteImage(imageId: string) {
    try {
      await this.client.uploader.destroy(imageId);

      return undefined;
    } catch (error) {
      return { imageId, error };
    }
  }
}
