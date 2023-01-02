import { Animal } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Form, useFormAction, useSubmit } from "@remix-run/react";
import { useRef, useState } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { getAllAnimalPictures } from "~/animals/pictures/allPictures";
import {
  DragAndDropContextProvider,
  PictureItemPreview,
  useDragItem,
  useDropContainer,
} from "~/animals/pictures/dragAndDrop";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Helper } from "~/core/dataDisplay/helper";
import {
  DataUrlOrDynamicImage,
  getFiles,
  getImageId,
  ImageFile,
  ImageFileOrId,
  isImageFile,
} from "~/core/dataDisplay/image";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { createActionData } from "~/core/schemas";
import { Icon } from "~/generated/icon";

export const ActionFormData = createActionData(
  z.object({
    id: z.string().uuid(),
    pictures: zfd.repeatable(
      z.array(z.string()).min(1, "Veuillez ajouter au moins une photo")
    ),
  })
);

export function AnimalPicturesForm({
  animal,
  errors = { formErrors: [], fieldErrors: {} },
}: {
  animal: SerializeFrom<Pick<Animal, "avatar" | "id" | "pictures">>;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
}) {
  const submit = useSubmit();
  const action = useFormAction();

  const [pictures, setPictures] = useState<ImageFileOrId[]>(
    getAllAnimalPictures(animal)
  );
  const [pendingPictureCount, setPendingPictureCount] = useState(0);
  const [hasImageImportError, setHasImageImportError] = useState(false);

  let formErrors = errors.formErrors;
  if (errors.fieldErrors.pictures != null) {
    formErrors = formErrors.concat(errors.fieldErrors.pictures);
  }
  if (hasImageImportError) {
    formErrors = formErrors.concat([
      "Une erreur est survenue lors de l’import d’image.",
    ]);
  }

  const overSizedPictureCount = pictures.filter(isImageOverSize).length;

  return (
    <Form
      noValidate
      className={formClassNames.root({ hasHeader: true })}
      onSubmit={(event) => {
        // Because we manually create the FormData to send, we need to manually
        // submit the form.
        event.preventDefault();

        const formData = new FormData();
        formData.set(ActionFormData.keys.id, animal.id);
        pictures.forEach((picture) => {
          if (!isImageOverSize(picture)) {
            const value = isImageFile(picture) ? picture.file : picture;
            formData.append(ActionFormData.keys.pictures, value);
          }
        });

        submit(formData, {
          method: "post",
          encType: "multipart/form-data",
          action,
        });
      }}
    >
      <div className={formClassNames.fields.root()}>
        {overSizedPictureCount > 0 ? (
          <Helper variant="warning">
            {overSizedPictureCount === 1
              ? "1 image est trop grande et sera ignorée."
              : `${overSizedPictureCount} images sont trop grandes et seront ignorées.`}{" "}
            La taille maximum est de {IMAGE_SIZE_LIMIT_MB} MiB.
          </Helper>
        ) : null}

        <FormErrors errors={formErrors} />

        <DragAndDropContextProvider previewElement={PictureItemPreview}>
          <ImagesInput
            images={pictures}
            setImages={setPictures}
            pendingImageCount={pendingPictureCount}
            setPendingImageCount={setPendingPictureCount}
            onImportImagesFailed={() => setHasImageImportError(true)}
          />
        </DragAndDropContextProvider>
      </div>

      <button
        type="submit"
        className={cn(actionClassName.standalone(), "w-full md:w-auto")}
      >
        Enregistrer
      </button>
    </Form>
  );
}

// Cloudinary default image size (20 MiB).
const IMAGE_SIZE_LIMIT_MB = 20;

const IMAGE_SIZE_LIMIT_B =
  IMAGE_SIZE_LIMIT_MB *
  // 1024 * 1024 B
  1048576;

function isImageOverSize(image: ImageFileOrId) {
  return isImageFile(image) && image.file.size > IMAGE_SIZE_LIMIT_B;
}

function ImagesInput({
  images,
  setImages,
  pendingImageCount,
  setPendingImageCount,
  onImportImagesFailed,
}: {
  images: ImageFileOrId[];
  setImages: React.Dispatch<React.SetStateAction<ImageFileOrId[]>>;
  pendingImageCount: number;
  setPendingImageCount: React.Dispatch<React.SetStateAction<number>>;
  onImportImagesFailed: React.Dispatch<void>;
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
  const { isDragging, isDisabled } = useDragItem({
    data: image,
    index,
    itemRef,
  });
  const isOverSize = isImageOverSize(image);

  return (
    <li
      ref={itemRef}
      draggable={!isDisabled}
      className={cn(
        "relative overflow-hidden rounded-1 aspect-4/3 cursor-move",
        { hidden: isDragging }
      )}
    >
      <DataUrlOrDynamicImage
        alt={`Photo ${index + 1}`}
        image={image}
        sizes={{ default: "300px" }}
        fallbackSize="512"
        loading="eager"
        className={cn("w-full", { "opacity-50": isOverSize })}
      />

      {isOverSize ? (
        <p className="absolute top-0 left-0 w-full px-1 py-0.5 bg-amber-50 flex items-center gap-0.5 text-amber-600">
          <Icon id="triangleExclamation" className="text-[14px]" />
          <span className="flex-1 text-caption-emphasis">
            Image trop grande
          </span>
        </p>
      ) : null}

      <button
        onClick={() => onRemove()}
        className={cn(
          actionClassName.standalone({ variant: "translucid", color: "black" }),
          "absolute bottom-0.5 right-0.5"
        )}
      >
        <Icon id="trash" />
      </button>
    </li>
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
}: {
  onImportImages: React.Dispatch<ImageFile[]>;
  onImportImagesEnd: React.Dispatch<number>;
  onImportImagesFailed: React.Dispatch<void>;
  onImportImagesStart: React.Dispatch<number>;
}) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    // The event object might not exist anymore after importing all images.
    const input = event.target;

    if (input.files != null) {
      const imageCount = input.files.length;
      onImportImagesStart(imageCount);

      try {
        const images = await getFiles(input.files);
        onImportImages(images);
      } catch (error) {
        console.error("Could not import images:", error);
        onImportImagesFailed();
      } finally {
        onImportImagesEnd(imageCount);

        // Clear native input value to make sure the user can select multiple
        // times the same file.
        // https://stackoverflow.com/a/9617756
        input.value = "";
      }
    }
  }

  return (
    <li className="aspect-4/3 flex">
      <label className="w-full group relative z-0 rounded-1 flex flex-col items-center justify-center gap-0.5 text-blue-500 cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="peer appearance-none absolute -z-10 top-0 left-0 w-full h-full rounded-1 cursor-pointer focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring focus-visible:ring-blue-400"
        />

        {/* Hide the native input that always show a button and the file name, even with appearance-none. */}
        <span className="absolute -z-10 top-0 left-0 w-full h-full rounded-1 border border-gray-300 border-dashed bg-white transition-colors duration-100 ease-in-out group-hover:border-gray-500" />

        <Icon id="plus" className="text-[30px]" />
        <span className="text-body-emphasis">Ajouter</span>
      </label>
    </li>
  );
}
