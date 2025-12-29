import { catchError } from "@animeaux/core";
import { safeParse, zu } from "@animeaux/zod-utils";
import type { FileUpload } from "@mjackson/form-data-parser";
import { captureException } from "@sentry/remix";
import type { drive_v3 } from "googleapis";
import { google } from "googleapis";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";
import { FileStorage } from "./file-storage.js";

/**
 * @see https://developers.google.com/drive/api
 */
export class FileStorageGoogleDrive extends FileStorage {
  readonly #drive: drive_v3.Drive;

  constructor(credentials: { clientEmail: string; privateKey: string }) {
    super();

    const auth = new google.auth.GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/drive"],
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey
          // Prevent node crypto error:
          // Error: error:1E08010C:DECODER routines::unsupported
          // See https://stackoverflow.com/questions/74131595/error-error1e08010cdecoder-routinesunsupported-with-google-auth-library
          .replace(/\\n/g, "\n"),
      },
    });

    this.#drive = google.drive({ version: "v3", auth });
  }

  async getFile(fileId: string) {
    const [error, response] = await catchError(() =>
      this.#drive.files.get({
        fileId,
        fields: Object.values(fileSchema.keyof().enum).join(","),
      }),
    );

    if (error != null) {
      captureException(error, { extra: { fileId } });
      throw error;
    }

    return safeParse(
      fileSchema,
      response.data,
      "Could not parse Google Drive file",
    );
  }

  async getFiles(folderId: string) {
    const [error, response] = await catchError(() =>
      this.#drive.files.list({
        q: `'${folderId}' in parents`,
        fields: `files(${Object.values(fileSchema.keyof().enum).join(",")})`,
        orderBy: "name_natural",
      }),
    );

    if (error != null) {
      captureException(error, { extra: { folderId } });
      throw error;
    }

    return safeParse(
      zu.array(fileSchema),
      response.data.files,
      "Could not parse Google Drive files",
    );
  }

  async createFolder(folderName: string, params: { parentFolderId: string }) {
    const [error, response] = await catchError(() =>
      this.#drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
          parents: [params.parentFolderId],
        },
        fields: createFileOrFolderSchema.keyof().enum.id,
      }),
    );

    if (error != null) {
      captureException(error, {
        extra: { folderName, parentFolderId: params.parentFolderId },
      });

      throw error;
    }

    return safeParse(
      createFileOrFolderSchema,
      response.data,
      "Could not parse Google Drive created folder",
    );
  }

  async createFile(fileUpload: FileUpload, params: { parentFolderId: string }) {
    const [error, response] = await catchError(() =>
      this.#drive.files.create({
        requestBody: {
          name: fileUpload.name,
          parents: [params.parentFolderId],
        },
        media: {
          mimeType: fileUpload.type,
          body: Readable.fromWeb(
            // Cast to Node's version of `ReadableStream` because the native one
            // is missing the properties: `values`, `[Symbol.asyncIterator]`.
            fileUpload.stream() as ReadableStream<any>,
          ),
        },
        fields: createFileOrFolderSchema.keyof().enum.id,
      }),
    );

    if (error != null) {
      captureException(error, {
        extra: { parentFolderId: params.parentFolderId },
      });

      throw error;
    }

    const file = safeParse(
      createFileOrFolderSchema,
      response.data,
      "Could not parse Google Drive created file",
    );

    return await this.getFile(file.id);
  }

  async deleteFile(fileId: string) {
    const [error, response] = await catchError(() =>
      this.#drive.files.delete({ fileId }),
    );

    if (error != null) {
      captureException(error, { extra: { fileId } });

      return false;
    }

    if (response.status !== 204) {
      captureException(new Error("Could not delete file"), {
        extra: {
          fileId,
          status: response.status,
          statusText: response.statusText,
        },
      });

      return false;
    }

    return true;
  }
}

const createFileOrFolderSchema = zu.object({
  id: zu.string(),
});

const fileSchema = zu.object({
  id: zu.string(),
  mimeType: zu.string(),
  name: zu.string(),
  originalFilename: zu.string(),
  size: zu.coerce.number(),
  // Not sure how long it takes for Google Drive to create it.
  thumbnailLink: zu.string().optional(),
  webViewLink: zu.string(),
});
