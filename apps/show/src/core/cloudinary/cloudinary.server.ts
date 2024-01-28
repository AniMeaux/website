import { PrevousEditionCloudinaryDelegate } from "#previousEditions/cloudinary.server";
import { v2 as cloudinaryClient } from "cloudinary";
import invariant from "tiny-invariant";

invariant(
  process.env.CLOUDINARY_CLOUD_NAME != null,
  "CLOUDINARY_CLOUD_NAME must be defined",
);

invariant(
  process.env.CLOUDINARY_API_KEY != null,
  "CLOUDINARY_API_KEY must be defined",
);

invariant(
  process.env.CLOUDINARY_API_SECRET != null,
  "CLOUDINARY_API_SECRET must be defined",
);

cloudinaryClient.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinaryClient };

export const cloudinary = {
  previousEdition: new PrevousEditionCloudinaryDelegate(cloudinaryClient),
};
