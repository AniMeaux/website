import { useRef, useState } from "react";
import { FaImages, FaTrash } from "react-icons/fa";
import styled from "styled-components";
import {
  getFiles,
  getImageId,
  Image,
  ImageFile,
  ImageFileOrId,
  IMAGE_SIZE_LIMIT,
} from "~/core/dataDisplay/image";
import {
  DragAndDropContextProvider,
  useDragItem,
  useDragPreview,
  useDropContainer,
} from "~/core/dragAndDrop";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { showSnackbar, Snackbar } from "~/core/popovers/snackbar";
import { SetStateAction } from "~/core/types";
import { theme } from "~/styles/theme";

function PictureItemPreview() {
  const preview = useDragPreview<ImageFileOrId>();

  if (!preview.display) {
    return null;
  }

  return (
    <PictureItemPreviewElement
      alt="Dragged image"
      image={preview.item.data}
      style={preview.style}
    />
  );
}

const PictureItemPreviewElement = styled(Image)`
  border-radius: ${theme.borderRadius.m};
  box-shadow: ${theme.shadow.m};
  object-fit: cover;
  overflow: hidden;
`;

type ImageInputProps = {
  value: ImageFileOrId[];
  onChange: React.Dispatch<SetStateAction<ImageFileOrId[]>>;
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
      <ImageInputButtonNativeInput
        ref={inputFile}
        id="pictures"
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
      />

      <ImageInputButtonBackground />

      <ImageInputButtonLabel htmlFor="pictures">
        <ImageInputButtonIcon />
        <span>Ajouter</span>
      </ImageInputButtonLabel>
    </li>
  );
}

const ImageInputButtonNativeInput = styled.input`
  border-radius: ${theme.borderRadius.m};
`;

const ImageInputButtonBackground = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${theme.colors.background.primary};
`;

const ImageInputButtonLabel = styled.label`
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.m};
  background: ${theme.colors.dark[30]};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary[500]};
  font-family: ${theme.typography.fontFamily.title};
  font-weight: 700;

  @media (hover: hover) {
    &:hover {
      background: ${theme.colors.dark[50]};
    }
  }

  &:active {
    background: ${theme.colors.dark[100]};
  }
`;

const ImageInputButtonIcon = styled(FaImages)`
  font-size: 24px;
`;

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
    <ImageItemElement
      ref={itemElement}
      draggable={disabled ? false : true}
      $isDragging={isDragging}
    >
      <ImageItemImage alt="Image tile" image={image} />

      <ImageItemButton onClick={() => onRemove()}>
        <FaTrash />
      </ImageItemButton>
    </ImageItemElement>
  );
}

const ImageItemElement = styled.li<{ $isDragging: boolean }>`
  overflow: hidden;
  border-radius: ${theme.borderRadius.m};
  display: ${(props) => (props.$isDragging ? "none" : "initial")};

  @media (hover: hover) {
    &:hover {
      cursor: move;
    }
  }
`;

const ImageItemImage = styled(Image)`
  object-fit: cover;
`;

const ImageItemButton = styled.button`
  position: absolute;
  bottom: ${theme.spacing.x1};
  right: ${theme.spacing.x1};
  border-radius: ${theme.borderRadius.full};
  width: 32px;
  height: 32px;
  background: ${theme.colors.dark[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.text.contrast};

  @media (hover: hover) {
    &:hover {
      background: ${theme.colors.dark[300]};
    }
  }

  &:active {
    background: ${theme.colors.dark[400]};
  }
`;

const PicturePlaceholderItem = styled.li`
  border-radius: ${theme.borderRadius.m};
  background: ${theme.colors.dark[50]};
`;

type ImageGalleryInputProps = {
  value: ImageFileOrId[];
  onChange: React.Dispatch<SetStateAction<ImageFileOrId[]>>;
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
    imagesElement.splice(
      pendingDropIndex,
      0,
      <PicturePlaceholderItem key="placeholder" />
    );
  }

  return (
    <ImageGalleryInputList ref={containerElement}>
      {imagesElement}

      {pendingImageCount > 0 && (
        <Placeholders count={pendingImageCount}>
          <li>
            <ImagePlaceholder $preset="image" />
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
    </ImageGalleryInputList>
  );
}

const ImageGalleryInputList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-auto-rows: 1fr;
  gap: ${theme.spacing.x4};

  & > * {
    position: relative;
  }

  /* Square grid "trick" with \`padding-top: 100%\`. */
  & > *::before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  /*
   * Make sure grid item's child is absolute to avoid changing the item size.
   * We only apply this to the first child to allow multiple children.
   */
  & > * > *:first-child {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ImagePlaceholder = styled(Placeholder)`
  border-radius: ${theme.borderRadius.m};
`;
