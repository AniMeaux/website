import { v2 as cloudinary } from "cloudinary";
import invariant from "tiny-invariant";

invariant(
  process.env.CLOUDINARY_CLOUD_NAME != null,
  "CLOUDINARY_CLOUD_NAME must be defined."
);

invariant(
  process.env.CLOUDINARY_API_KEY != null,
  "CLOUDINARY_API_KEY must be defined."
);

invariant(
  process.env.CLOUDINARY_API_SECRET != null,
  "CLOUDINARY_API_SECRET must be defined."
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };
