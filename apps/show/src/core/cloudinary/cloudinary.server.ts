import { PrevousEditionCloudinaryDelegate } from "#previous-editions/cloudinary.server";
import { ReversibleUploadCloudinaryDelegate } from "@animeaux/cloudinary/server";
import { v2 as cloudinaryClient } from "cloudinary";

cloudinaryClient.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinary = {
  client: cloudinaryClient,

  previousEdition: new PrevousEditionCloudinaryDelegate(cloudinaryClient),
  reversibleUpload: new ReversibleUploadCloudinaryDelegate(cloudinaryClient),
};
