import {
  getImageId,
  ImageFile,
  ImageFileOrId,
} from "@animeaux/shared-entities";
import cn from "classnames";
import { Image } from "core/dataDisplay/image";
import {
  DragAndDropContextProvider,
  useDragItem,
  useDragPreview,
  useDropContainer,
} from "core/dragAndDrop";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { showSnackbar, Snackbar } from "core/popovers/snackbar";
import { useRef, useState } from "react";
import { FaImages, FaTrash } from "react-icons/fa";
import { v4 as uuid } from "uuid";

function PictureItemPreview() {
  const preview = useDragPreview<ImageFileOrId>();

  if (!preview.display) {
    return null;
  }

  return (
    <Image
      alt="Dragged image"
      image={preview.item.data}
      style={preview.style}
      className="PictureItemPreview"
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
  const inputFile = useRef<HTMLInputElement>(null!);

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

          showSnackbar.error(<Snackbar>{message}</Snackbar>);
        }

        onImportImages(images);
      } catch (error) {
        showSnackbar.error(<Snackbar>Une erreur est survenue</Snackbar>);
      } finally {
        onImportImagesEnd(imageCount);

        // Clear native input value to make sure the user can select multiple
        // times the same file.
        // https://stackoverflow.com/a/9617756
        inputFile.current.value = "";
      }
    }
  }

  return (
    <li>
      <input
        ref={inputFile}
        id="pictures"
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="ImageInputButton__input"
      />

      <span className="ImageInputButton__background" />

      <label htmlFor="pictures" className="ImageInputButton__label">
        <FaImages className="ImageInputButton__icon" />
        <span>Ajouter</span>
      </label>
    </li>
  );
}

type ImageItemProps = {
  index: number;
  image: ImageFileOrId;
  onRemove: () => void;
};

function ImageItem({ image, index, onRemove }: ImageItemProps) {
  const itemElement = useRef<HTMLLIElement>(null!);
  const { isDragging, disabled } = useDragItem({
    data: image,
    index,
    itemRef: itemElement,
  });

  return (
    <li
      ref={itemElement}
      draggable={disabled ? false : true}
      className={cn("ImageItem ImageItem--movable", {
        "ImageItem--hidden": isDragging,
      })}
    >
      <Image alt="Image tile" image={image} className="ImageItem__image" />

      <button onClick={() => onRemove()} className="ImageItem__button">
        <FaTrash />
      </button>
    </li>
  );
}

const picturePlaceholderItem = (
  <li key="placeholder" className="PicturePlaceholderItem ImagePlaceholder" />
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
  const [pendingImageCount, setPendingImageCount] = useState(0);

  const containerElement = useRef<HTMLUListElement>(null!);
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
    <ul className="ImageGalleryInput" ref={containerElement}>
      {imagesElement}

      {pendingImageCount > 0 && (
        <Placeholders count={pendingImageCount}>
          <li>
            <Placeholder preset="image" className="ImagePlaceholder" />
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
