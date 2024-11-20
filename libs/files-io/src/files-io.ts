import invariant from "tiny-invariant";

export type DataUrlFile = {
  file: File;
  dataUrl: string;
};

export async function readFiles(fileList: FileList) {
  const files: Promise<DataUrlFile>[] = [];
  for (const file of fileList) {
    files.push(readFile(file));
  }

  return await Promise.all(files);
}

export async function readFile(file: File) {
  return new Promise<DataUrlFile>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      invariant(
        typeof reader.result === "string",
        "The read data should be a string",
      );

      resolve({ dataUrl: reader.result, file });
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
