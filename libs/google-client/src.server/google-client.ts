import { catchError } from "@animeaux/core";
import { safeParse, zu } from "@animeaux/zod-utils";
import type { FileUpload } from "@mjackson/form-data-parser";
import { LazyFile } from "@mjackson/lazy-file";
import { captureException } from "@sentry/remix";
import type { drive_v3 } from "googleapis";
import { google } from "googleapis";
import { Readable } from "node:stream";
import type { ReadableStream } from "node:stream/web";

/**
 * @see https://developers.google.com/drive/api
 */
export class GoogleClient {
  private readonly drive: null | drive_v3.Drive;

  constructor(credentials?: { clientEmail: string; privateKey: string }) {
    if (credentials == null) {
      this.drive = null;
    } else {
      const auth = new google.auth.GoogleAuth({
        scopes: ["https://www.googleapis.com/auth/drive"],
        credentials: {
          client_email: credentials.clientEmail,
          private_key: credentials.privateKey,
        },
      });

      this.drive = google.drive({ version: "v3", auth });
    }
  }

  createReversibleUpload() {
    const uploadedFileIds: string[] = [];

    const upload = async (
      fileUpload: FileUpload,
      params: { parentFolderId: string },
    ) => {
      const file = await this.createFile(fileUpload, params);

      uploadedFileIds.push(file.id);

      return new LazyFile(
        {
          byteLength: file.size,
          stream: () => {
            throw new Error("Not supported");
          },
        },
        file.id,
        { type: fileUpload.type },
      );
    };

    const revert = async () => {
      await Promise.allSettled(
        uploadedFileIds.map((fileId) => this.deleteFile(fileId)),
      );
    };

    return { upload, revert };
  }

  async getFile(fileId: string) {
    const drive = this.#getDrive();

    const [error, response] = await catchError(() =>
      drive.files.get({
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
    const drive = this.#getDrive();

    const [error, response] = await catchError(() =>
      drive.files.list({
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
    const drive = this.#getDrive();

    const [error, response] = await catchError(() =>
      drive.files.create({
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
    const drive = this.#getDrive();

    const [error, response] = await catchError(() =>
      drive.files.create({
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
    const drive = this.#getDrive();

    const [error, response] = await catchError(() =>
      drive.files.delete({ fileId }),
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

  #getDrive() {
    if (this.drive != null) {
      return this.drive;
    }

    throw new Error(
      "Create instance with credentials before using GoogleClient",
    );
  }
}

export namespace GoogleClient {
  export type File = Awaited<ReturnType<GoogleClient["getFile"]>>;
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
