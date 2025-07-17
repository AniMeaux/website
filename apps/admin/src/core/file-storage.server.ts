import type { FileStorage } from "@animeaux/file-storage/server";
import {
  FileStorageGoogleDrive,
  FileStorageMock,
} from "@animeaux/file-storage/server";

export const fileStorage: FileStorage =
  process.env.GOOGLE_API_CLIENT_EMAIL != null &&
  process.env.GOOGLE_API_PRIVATE_KEY != null
    ? new FileStorageGoogleDrive({
        clientEmail: process.env.GOOGLE_API_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_API_PRIVATE_KEY,
      })
    : new FileStorageMock();
