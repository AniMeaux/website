import type { FileUpload } from "@mjackson/form-data-parser";
import { v4 as uuid } from "uuid";
import { FileStorage } from "./file-storage.server.js";

export class FileStorageMock extends FileStorage {
  #files = new Map<string, FileStorage.File>();
  #folders = new Map<string, FileStorage.File[]>();

  async getFile(fileId: string) {
    let file = this.#files.get(fileId);

    if (file != null) {
      return file;
    }

    file = this.#createMockFile({ id: fileId });

    this.#files.set(fileId, file);

    return file;
  }

  async getFiles(folderId: string) {
    let files = this.#folders.get(folderId);

    if (files != null) {
      return files;
    }

    files = Array.from({ length: 3 }).map(() => this.#createMockFile());

    this.#folders.set(folderId, files);

    return files;
  }

  async createFolder() {
    const id = `mock-folder-${uuid()}`;

    this.#folders.set(
      id,
      Array.from({ length: 3 }).map(() => this.#createMockFile()),
    );

    return { id };
  }

  async createFile(fileUpload: FileUpload) {
    const file = this.#createMockFile({
      mimeType: fileUpload.type,
      name: fileUpload.name,
    });

    this.#files.set(file.id, file);

    return file;
  }

  async deleteFile(fileId: string) {
    return this.#files.delete(fileId);
  }

  #createMockFile(payload?: Partial<FileStorage.File>): FileStorage.File {
    const id = payload?.id ?? `mock-file-${uuid()}`;
    const name = payload?.name ?? "Mock file.pdf";

    return {
      id,
      mimeType: payload?.mimeType ?? "application/pdf",
      name,
      originalFilename: payload?.originalFilename ?? name,
      size: payload?.size ?? 1024,
      thumbnailLink:
        payload?.thumbnailLink ??
        `https://res.cloudinary.com/mock-cloud-name/image/upload/w_auto/${id}`,
      webViewLink: payload?.webViewLink ?? `#${id}`,
    };
  }
}
