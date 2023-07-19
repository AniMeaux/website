import { Animal } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents, useFormAction } from "@remix-run/react";
import { useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { getAllAnimalPictures } from "~/animals/pictures/allPictures";
import {
  DragAndDropContextProvider,
  PictureItemPreview,
  useDragItem,
  useDropContainer,
} from "~/animals/pictures/dragAndDrop";
import { createActionData } from "~/core/actionData";
import { Action } from "~/core/actions";
import { InlineHelper } from "~/core/dataDisplay/helper";
import {
  IMAGE_SIZE_LIMIT_MB,
  ImageFile,
  ImageFileOrId,
  getImageId,
  isImageFile,
  isImageOverSize,
  readFiles,
} from "~/core/dataDisplay/image";
import { Form } from "~/core/formElements/form";
import { ImageInput } from "~/core/formElements/imageInput";
import { Icon } from "~/generated/icon";

export const ActionFormData = createActionData(
  z.object({
    pictures: zfd.repeatable(
      z.array(z.string()).min(1, "Veuillez ajouter au moins une photo")
    ),
  })
);

export function AnimalPicturesForm({
  defaultAnimal,
  fetcher,
}: {
  defaultAnimal?: null | SerializeFrom<Pick<Animal, "avatar" | "pictures">>;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultAnimal == null;
  const action = useFormAction();

  const [pictures, setPictures] = useState<ImageFileOrId[]>(
    defaultAnimal == null ? [] : getAllAnimalPictures(defaultAnimal)
  );
  const [pendingPictureCount, setPendingPictureCount] = useState(0);
  const [hasImageImportError, setHasImageImportError] = useState(false);

  let formErrors = fetcher.data?.errors?.formErrors ?? [];

  // Errors on the `pictures` field are displayed as form errors.
  if (fetcher.data?.errors?.fieldErrors.pictures != null) {
    formErrors = formErrors.concat(fetcher.data.errors.fieldErrors.pictures);
  }

  if (hasImageImportError) {
    formErrors = formErrors.concat([
      "Une erreur est survenue lors de l’import d’image.",
    ]);
  }

  const overSizedPictureCount = pictures.filter(isImageOverSize).length;
  if (overSizedPictureCount > 0) {
    formErrors = formErrors.concat([
      `${
        overSizedPictureCount === 1
          ? "1 image est trop grande."
          : `${overSizedPictureCount} images sont trop grandes.`
      } La taille maximum est de ${IMAGE_SIZE_LIMIT_MB} MiB.`,
    ]);
  }

  return (
    <Form
      hasHeader
      noValidate
      onSubmit={(event) => {
        // Because we manually create the FormData to send, we need to manually
        // submit the form.
        event.preventDefault();

        if (overSizedPictureCount > 0) {
          return;
        }

        const formData = new FormData();

        pictures.forEach((picture) => {
          if (!isImageOverSize(picture)) {
            const value = isImageFile(picture) ? picture.file : picture;
            formData.append(ActionFormData.keys.pictures, value);
          }
        });

        if (pictures.length === 0) {
          // Because there may be no image, the FormData might be empty.
          // For some reason, submitting an empty FormData crash with a
          // "Failed to fetch" error.
          formData.set("useless", "");
        }

        fetcher.submit(formData, {
          method: "POST",
          encType: "multipart/form-data",
          action,
        });
      }}
    >
      <Form.Fields>
        <InlineHelper variant="info">
          La première photo sera utilisée comme avatar.
        </InlineHelper>

        <Form.Errors errors={formErrors} />

        <DragAndDropContextProvider previewElement={PictureItemPreview}>
          <ImagesInput
            images={pictures}
            setImages={setPictures}
            pendingImageCount={pendingPictureCount}
            setPendingImageCount={setPendingPictureCount}
            onImportImagesFailed={() => setHasImageImportError(true)}
            hasError={fetcher.data?.errors?.fieldErrors.pictures != null}
          />
        </DragAndDropContextProvider>
      </Form.Fields>

      <Form.Action asChild>
        <Action>
          {isCreate ? "Créer" : "Enregistrer"}
          <Action.Loader isLoading={fetcher.state !== "idle"} />
        </Action>
      </Form.Action>
    </Form>
  );
}

function ImagesInput({
  images,
  setImages,
  pendingImageCount,
  setPendingImageCount,
  onImportImagesFailed,
  hasError,
}: {
  images: ImageFileOrId[];
  setImages: React.Dispatch<React.SetStateAction<ImageFileOrId[]>>;
  pendingImageCount: number;
  setPendingImageCount: React.Dispatch<React.SetStateAction<number>>;
  onImportImagesFailed: React.Dispatch<void>;
  hasError: boolean;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const { pendingDropIndex } = useDropContainer({
    containerRef: listRef,
    setItems: setImages,
  });

  const imagesElement = images.map((image, index) => (
    <ImageItem
      key={getImageId(image)}
      image={image}
      index={index}
      onRemove={() =>
        setImages((images) =>
          images.filter((imageToRemove) => imageToRemove !== image)
        )
      }
    />
  ));

  // Display a placeholder at the drop index.
  if (pendingDropIndex != null) {
    imagesElement.splice(
      pendingDropIndex,
      0,
      <ImageItemPlaceholder key="placeholder" />
    );
  }

  return (
    <ul
      ref={listRef}
      className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1 md:gap-2"
    >
      {imagesElement}

      {pendingImageCount > 0
        ? new Array(pendingImageCount)
            .fill(null)
            .map((_, index) => (
              <ImageItemPlaceholder key={`placeholder-${index}`} />
            ))
        : null}

      <ImageItemInput
        onImportImagesStart={(imageCount) =>
          setPendingImageCount((count) => count + imageCount)
        }
        onImportImagesEnd={(imageCount) =>
          setPendingImageCount((count) => count - imageCount)
        }
        onImportImages={(newImages) =>
          setImages((images) => images.concat(newImages))
        }
        onImportImagesFailed={onImportImagesFailed}
        hasError={hasError}
      />
    </ul>
  );
}

function ImageItem({
  image,
  index,
  onRemove,
}: {
  image: ImageFileOrId;
  index: number;
  onRemove: () => void;
}) {
  const itemRef = useRef<HTMLLIElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const { isDragging, isDisabled } = useDragItem({
    data: image,
    index,
    itemRef,
    handleRef,
  });

  return (
    <ImageInput.Preview asChild>
      <li ref={itemRef} className={isDragging ? "hidden" : undefined}>
        <ImageInput.PreviewImage
          alt={`Photo ${index + 1}`}
          image={image}
          sizes={{ default: "300px" }}
          fallbackSize="512"
        />

        <ImageInput.PreviewOverSizeHelper>
          Image trop grande
        </ImageInput.PreviewOverSizeHelper>

        {!isDisabled ? (
          <div
            ref={handleRef}
            draggable
            className="absolute top-1/2 -translate-y-1/2 left-0 h-4 w-4 flex items-center justify-center opacity-75 cursor-move"
          >
            <Icon
              id="gripDotsVertical"
              className="text-[20px] text-white stroke-black"
            />
          </div>
        ) : null}

        <ImageInput.PreviewAction isIconOnly onClick={() => onRemove()}>
          <Icon id="trash" />
        </ImageInput.PreviewAction>
      </li>
    </ImageInput.Preview>
  );
}

function ImageItemPlaceholder() {
  return <li className="rounded-1 bg-gray-100 aspect-4/3" />;
}

function ImageItemInput({
  onImportImages,
  onImportImagesEnd,
  onImportImagesFailed,
  onImportImagesStart,
  hasError,
}: {
  onImportImages: React.Dispatch<ImageFile[]>;
  onImportImagesEnd: React.Dispatch<number>;
  onImportImagesFailed: React.Dispatch<void>;
  onImportImagesStart: React.Dispatch<number>;
  hasError: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange() {
    invariant(inputRef.current != null, "inputRef should be defined");

    if (inputRef.current.files != null) {
      const imageCount = inputRef.current.files.length;
      onImportImagesStart(imageCount);

      try {
        const images = await readFiles(inputRef.current.files);
        onImportImages(images);
      } catch (error) {
        console.error("Could not import images:", error);
        onImportImagesFailed();
      } finally {
        onImportImagesEnd(imageCount);

        // Clear native input value to make sure the user can select multiple
        // times the same file.
        // https://stackoverflow.com/a/9617756
        inputRef.current.value = "";
      }
    }
  }

  return (
    <li className="aspect-4/3 flex">
      <ImageInput.Native ref={inputRef} multiple onChange={handleChange} />

      <ImageInput.Trigger
        icon="plus"
        label="Ajouter"
        onClick={() => inputRef.current?.click()}
        hasError={hasError}
        className="w-full"
      />
    </li>
  );
}
