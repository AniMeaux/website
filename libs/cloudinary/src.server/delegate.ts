import type { v2 as cloudinaryClient } from "cloudinary";

export type CloudinaryClient = typeof cloudinaryClient;

export abstract class CloudinaryDelegate {
  // It's not useless because it automatically initialize the instance
  // attribute `client`.
  // eslint-disable-next-line no-useless-constructor
  constructor(protected readonly client: CloudinaryClient) {}
}
