import { CloudinaryApiSignature, ImageFile } from "@animeaux/shared-entities";
import { Cloudinary as CloudinaryCore } from "cloudinary-core";
import { fetchGraphQL } from "core/request";
import { Sentry } from "core/sentry";
import { gql } from "graphql-request";

class Cloudinary extends CloudinaryCore {
  apiKey: string;
  uploadUrl: string;
  deleteUrl: string;

  constructor() {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    super({ cloud_name: cloudName, secure: true });
    this.apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    this.uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    this.deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
  }
}

export const cloudinaryInstance = new Cloudinary();

const GetCloudinaryApiSignature = gql`
  query GetCloudinaryApiSignature($parametersToSign: JSONObject!) {
    apiSignature: getCloudinaryApiSignature(
      parametersToSign: $parametersToSign
    ) {
      timestamp
      signature
    }
  }
`;

async function getApiSignature(parametersToSign: object) {
  const { apiSignature } = await fetchGraphQL<
    { apiSignature: CloudinaryApiSignature },
    { parametersToSign: object }
  >(GetCloudinaryApiSignature, { variables: { parametersToSign } });

  return apiSignature;
}

export async function uploadImageFile(
  imageFile: ImageFile,
  { tags = [] }: { tags?: string[] } = {}
) {
  const tagsParam = tags.join(",");
  const { signature, timestamp } = await getApiSignature({
    public_id: imageFile.id,
    tags: tagsParam,
  });

  const formData = new FormData();
  formData.append("file", imageFile.file);
  formData.append("public_id", imageFile.id);
  formData.append("tags", tagsParam);
  formData.append("api_key", cloudinaryInstance.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await fetch(cloudinaryInstance.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // See https://cloudinary.com/documentation/upload_images#error_handling
      const message = (await response.json())?.error?.message;
      throw new Error(message);
    }
  } catch (error) {
    Sentry.captureException(error, {
      extra: { operation: "Could not upload image" },
    });

    console.error("Could not upload image", error);
    throw new Error("L'image n'a pas pu être envoyé");
  }
}

export async function deleteImage(imageId: string) {
  const { signature, timestamp } = await getApiSignature({
    public_id: imageId,
  });

  try {
    const response = await fetch(cloudinaryInstance.deleteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id: imageId,
        api_key: cloudinaryInstance.apiKey,
        timestamp,
        signature,
      }),
    });

    const message = await response.json();

    // The API can return a 200 with a "not found" message.
    // This is not documented.
    if (message?.result === "not found" || !response.ok) {
      throw new Error(JSON.stringify(message));
    }
  } catch (error) {
    Sentry.captureException(error, {
      extra: { operation: "Could not delete image" },
    });

    console.error("Could not delete image", error);
    throw new Error("L'image n'a pas pu être supprimée");
  }
}
