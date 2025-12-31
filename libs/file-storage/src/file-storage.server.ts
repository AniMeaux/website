import type { FileUpload } from "@mjackson/form-data-parser";
import { LazyFile } from "@mjackson/lazy-file";

export abstract class FileStorage {
  abstract getFile(fileId: string): Promise<FileStorage.File>;

  abstract getFiles(folderId: string): Promise<FileStorage.File[]>;

  abstract createFolder(
    folderName: string,
    params: { parentFolderId: string },
  ): Promise<FileStorage.Folder>;

  abstract createFile(
    fileUpload: FileUpload,
    params: { parentFolderId: string },
  ): Promise<FileStorage.File>;

  abstract deleteFile(fileId: string): Promise<boolean>;

  createReversibleUpload() {
    const uploadedFileIds: string[] = [];

    const upload: FileStorage.Uploader = async (fileUpload, params) => {
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

    const revert: FileStorage.Reverter = async () => {
      await Promise.allSettled(
        uploadedFileIds.map((fileId) => this.deleteFile(fileId)),
      );
    };

    return { upload, revert };
  }
}

export namespace FileStorage {
  export type File = {
    id: string;
    name: string;
    mimeType: string;
    originalFilename: string;
    size: number;
    webViewLink: string;
    thumbnailLink?: string | undefined;
  };

  export type Folder = {
    id: string;
  };

  export type Uploader = (
    fileUpload: FileUpload,
    params: { parentFolderId: string },
  ) => Promise<LazyFile>;

  export type Reverter = () => Promise<void>;
}
