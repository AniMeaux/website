import { CloudinaryApiSignature, ImageFile } from "@animeaux/shared-entities";
import { Cloudinary as CloudinaryCore } from "cloudinary-core";
import { gql } from "graphql-request";
import invariant from "invariant";
import { fetchGraphQL } from "./request";

type CloudinaryConstructorParams = {
  cloudName: string;
  apiKey: string;
};

class Cloudinary extends CloudinaryCore {
  apiKey: string;
  uploadUrl: string;
  deleteUrl: string;
  tagsUrl: string;

  constructor({ cloudName, apiKey }: CloudinaryConstructorParams) {
    super({ cloud_name: cloudName, secure: true });
    this.apiKey = apiKey;
    this.uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    this.deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    this.tagsUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/tags`;
  }
}

let cloudinary: Cloudinary | null = null;

export function initializeCloudinary(params: CloudinaryConstructorParams) {
  if (cloudinary == null) {
    cloudinary = new Cloudinary(params);
  }
}

function getInstance() {
  invariant(
    cloudinary != null,
    "initializeCloudinary must be called before calling any related functions."
  );

  return cloudinary;
}

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

  const instance = getInstance();

  const formData = new FormData();
  formData.append("file", imageFile.file);
  formData.append("public_id", imageFile.id);
  formData.append("tags", tagsParam);
  formData.append("api_key", instance.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await fetch(instance.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // See https://cloudinary.com/documentation/upload_images#error_handling
      const message = (await response.json())?.error?.message;
      console.error("Could not upload image:", message);
      throw new Error("L'image n'a pas pu être envoyé");
    }
  } catch (error) {
    throw new Error("L'image n'a pas pu être envoyé");
  }
}

export async function deleteImage(imageId: string) {
  const { signature, timestamp } = await getApiSignature({
    public_id: imageId,
  });

  const instance = getInstance();

  try {
    const response = await fetch(instance.deleteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id: imageId,
        api_key: instance.apiKey,
        timestamp,
        signature,
      }),
    });

    const message = await response.json();

    // The API can return a 200 with a "not found" message.
    // This is not documented.
    if (message?.result === "not found" || !response.ok) {
      console.error("Could not upload image:", JSON.stringify(message));
      throw new Error("L'image n'a pas pu être supprimée");
    }
  } catch (error) {
    throw new Error("L'image n'a pas pu être supprimée");
  }
}

export function computeAvatarUrl(publicId: string) {
  return getInstance().url(publicId, {
    crop: "fill",
    width: 100,
    height: 100,
  });
}

export function computePictureUrl(publicId: string) {
  return getInstance().url(publicId, {
    crop: "fit",
    // Larger than any small screen.
    width: 600,
  });
}
