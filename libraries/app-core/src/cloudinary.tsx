import { CloudinaryApiSignature, ImageFile } from "@animeaux/shared-entities";
import {
  ChildrenProp,
  ImagePreset,
  ImageProviderContextProvider,
  useImageProvider,
} from "@animeaux/ui-library";
import { Cloudinary as CloudinaryCore, Transformation } from "cloudinary-core";
import { gql } from "graphql-request";
import * as React from "react";
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

const ImagePresetTransformOptions: {
  [key in ImagePreset]: Transformation.Options;
} = {
  avatar: {
    crop: "fill",
    width: 100,
    height: 100,
  },
  none: {
    crop: "fit",
    // Larger than any small screen.
    width: 600,
  },
};

type CloudinaryContextProviderProps = ChildrenProp &
  CloudinaryConstructorParams;

export function CloudinaryContextProvider({
  apiKey,
  cloudName,
  children,
}: CloudinaryContextProviderProps) {
  return (
    <ImageProviderContextProvider
      createImageProvider={() => new Cloudinary({ apiKey, cloudName })}
      getImageUrl={(instance, imageId, preset) =>
        instance.url(imageId, ImagePresetTransformOptions[preset])
      }
    >
      {children}
    </ImageProviderContextProvider>
  );
}

export function useCloudinary() {
  return useImageProvider<Cloudinary>();
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
  cloudinary: Cloudinary,
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
  formData.append("api_key", cloudinary.apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);

  try {
    const response = await fetch(cloudinary.uploadUrl, {
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

export async function deleteImage(cloudinary: Cloudinary, imageId: string) {
  const { signature, timestamp } = await getApiSignature({
    public_id: imageId,
  });

  try {
    const response = await fetch(cloudinary.deleteUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        public_id: imageId,
        api_key: cloudinary.apiKey,
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
