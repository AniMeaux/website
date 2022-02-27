import { OperationParams } from "@animeaux/shared";
import { getConfig } from "core/config";
import { ImageFile } from "core/dataDisplay/image";
import { runOperation } from "core/operations";
import { Sentry } from "core/sentry";

const CLOUD_NAME = getConfig().cloudinaryCloudName;
const API_KEY = getConfig().cloudinaryApiKey;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const DELETE_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;

async function getApiSignature(
  parametersToSign: OperationParams<"getCloudinaryApiSignature">["parametersToSign"]
) {
  const response = await runOperation<"getCloudinaryApiSignature">({
    name: "getCloudinaryApiSignature",
    params: { parametersToSign },
  });

  if (response.state === "error") {
    throw new Error(`Could not get api signature ${response.status}`);
  }

  return response.result;
}

export async function uploadImageFile(
  imageFile: ImageFile,
  { tags = [] }: { tags?: string[] } = {}
) {
  const tagsParam = tags.join(",");
  const { signature, timestamp } = await getApiSignature({
    id: imageFile.id,
    tags: tagsParam,
  });

  const formData = new FormData();
  formData.append("file", imageFile.file);
  formData.append("public_id", imageFile.id);
  formData.append("tags", tagsParam);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // See https://cloudinary.com/documentation/upload_images#error_handling
      const message = (await response.json())?.error?.message;
      throw new Error(message);
    }
  } catch (error) {
    console.error("Could not upload image", error);
    throw error;
  }
}

export async function deleteImage(imageId: string) {
  const { signature, timestamp } = await getApiSignature({ id: imageId });

  try {
    const response = await fetch(DELETE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id: imageId,
        api_key: API_KEY,
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
