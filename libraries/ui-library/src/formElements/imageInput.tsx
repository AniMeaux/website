import {
  getImageId,
  ImageFile,
  ImageFileOrId,
} from "@animeaux/shared-entities";
import cn from "classnames";
import * as React from "react";
import { FaImages, FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";
import {
  DragAndDropContextProvider,
  useDragItem,
  useDragPreview,
  useDropContainer,
} from "../core";
import { Image } from "../dataDisplay";
import { Placeholder, Placeholders } from "../loaders";
import { showSnackbar, Snackbar } from "../popovers";

function PictureItemPreview() {
  const preview = useDragPreview<ImageFileOrId>();

  if (!preview.display) {
    return null;
  }

  return (
    <Image
      alt="Dragged image"
      image={preview.item.data}
      preset="avatar"
      style={preview.style}
      className="shadow object-cover rounded-xl"
    />
  );
}

type ImageInputProps = {
  value: ImageFileOrId[];
  onChange: React.Dispatch<React.SetStateAction<ImageFileOrId[]>>;
};

export function ImageInput({ value, onChange }: ImageInputProps) {
  return (
    <DragAndDropContextProvider
      itemType="picture"
      previewElement={PictureItemPreview}
    >
      <ImageGalleryInput
        value={value}
        onChange={onChange}
        onRemoveImage={(imageToRemove) =>
          onChange((images) =>
            images.filter((image) => image !== imageToRemove)
          )
        }
      />
    </DragAndDropContextProvider>
  );
}

// 10 MiB = 10 * 1024 * 1024 B
const IMAGE_SIZE_LIMIT = 10485760;

type ImageInputButtonProps = {
  onImportImages: React.Dispatch<ImageFile[]>;
  onImportImagesStart: React.Dispatch<number>;
  onImportImagesEnd: React.Dispatch<number>;
};

function ImageInputButton({
  onImportImagesStart,
  onImportImages,
  onImportImagesEnd,
}: ImageInputButtonProps) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files != null) {
      const imageCount = event.target.files.length;
      onImportImagesStart(imageCount);

      try {
        const allImages = await getFiles(event.target.files);
        const images = allImages.filter(
          (image) => image.file.size < IMAGE_SIZE_LIMIT
        );

        const oversizedImageCount = allImages.length - images.length;
        if (oversizedImageCount > 0) {
          const message =
            oversizedImageCount === 1
              ? "1 image trop grande"
              : `${oversizedImageCount} images trop grandes`;

          showSnackbar.error(<Snackbar type="error">{message}</Snackbar>, {
            autoClose: false,
          });
        }

        onImportImages(images);
      } catch (error) {
        showSnackbar.error(
          <Snackbar type="error">Une erreur est survenue</Snackbar>,
          { autoClose: false }
        );
      } finally {
        onImportImagesEnd(imageCount);
      }
    }
  }

  return (
    <span>
      <span className="absolute w-full h-full bg-white" />

      <label
        htmlFor="pictures"
        className="absolute top-0 left-0 rounded-xl w-full h-full bg-blue-500 bg-opacity-5 active:bg-opacity-10 flex flex-col items-center justify-center text-blue-500 font-serif font-bold"
      >
        <FaImages className="text-2xl" />
        <span>Ajouter</span>
      </label>

      <input
        id="pictures"
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="-z-1 focus:outline-none focus-visible:ring focus-visible:ring-opacity-50 focus-visible:ring-blue-500 absolute top-0 left-0 rounded-xl w-full h-full"
      />
    </span>
  );
}

type ImageItemProps = {
  index: number;
  image: ImageFileOrId;
  onRemove: () => void;
};

function ImageItem({ image, index, onRemove }: ImageItemProps) {
  const itemElement = React.useRef<HTMLLIElement>(null!);
  const { isDragging, disabled } = useDragItem({
    data: image,
    index,
    itemRef: itemElement,
  });

  return (
    <li
      ref={itemElement}
      draggable={disabled ? false : true}
      className={cn({ hidden: isDragging })}
    >
      <Image
        alt="Image tile"
        image={image}
        preset="avatar"
        className="rounded-xl object-cover"
      />

      <button
        onClick={() => onRemove()}
        className="absolute bottom-1 right-1 rounded-full w-8 h-8 bg-black bg-opacity-20 flex items-center justify-center text-white"
      >
        <FaTrash />
      </button>
    </li>
  );
}

const picturePlaceholderItem = (
  <li key="placeholder" className="rounded-xl bg-black bg-opacity-5" />
);

type ImageGalleryInputProps = {
  value: ImageFileOrId[];
  onChange: React.Dispatch<React.SetStateAction<ImageFileOrId[]>>;
  onRemoveImage: React.Dispatch<ImageFileOrId>;
};

function ImageGalleryInput({
  value,
  onChange,
  onRemoveImage,
}: ImageGalleryInputProps) {
  const [pendingImageCount, setPendingImageCount] = React.useState(0);

  const containerElement = React.useRef<HTMLUListElement>(null!);
  const { pendingDropIndex } = useDropContainer<ImageFileOrId>({
    containerRef: containerElement,
    setItems: onChange,
  });

  const imagesElement = value.map((image, index) => (
    <ImageItem
      key={getImageId(image)}
      image={image}
      index={index}
      onRemove={() => onRemoveImage(image)}
    />
  ));

  // Display a placeholder at the drop index.
  if (pendingDropIndex != null) {
    imagesElement.splice(pendingDropIndex, 0, picturePlaceholderItem);
  }

  return (
    <ul className="grid-square gap-4" ref={containerElement}>
      {imagesElement}

      {pendingImageCount > 0 && (
        <Placeholders count={pendingImageCount}>
          <li>
            <Placeholder preset="image" className="rounded-xl" />
          </li>
        </Placeholders>
      )}

      <ImageInputButton
        onImportImagesStart={(imageCount) =>
          setPendingImageCount((count) => count + imageCount)
        }
        onImportImagesEnd={(imageCount) =>
          setPendingImageCount((count) => count - imageCount)
        }
        onImportImages={(newImages) =>
          onChange((images) => images.concat(newImages))
        }
      />
    </ul>
  );
}

async function getFiles(fileList: FileList): Promise<ImageFile[]> {
  const files: Promise<ImageFile>[] = [];

  for (let index = 0; index < fileList.length; index++) {
    files.push(readFile(fileList[index]));
  }

  return await Promise.all(files);
}

async function readFile(file: File): Promise<ImageFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      return resolve({
        id: uuid(),
        file,
        dataUrl: loadEvent.target!.result as string,
      });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
