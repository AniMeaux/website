import { Event } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents, useFormAction } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Action } from "~/core/actions";
import {
  IMAGE_SIZE_LIMIT_MB,
  ImageFileOrId,
  isImageFile,
  isImageOverSize,
  readFile,
} from "~/core/dataDisplay/image";
import { toIsoDateValue } from "~/core/dates";
import { Form } from "~/core/formElements/form";
import { ImageInput } from "~/core/formElements/imageInput";
import { Input } from "~/core/formElements/input";
import { RequiredStar } from "~/core/formElements/requiredStar";
import { SwitchInput } from "~/core/formElements/switchInput";
import { Textarea } from "~/core/formElements/textarea";
import { Separator } from "~/core/layout/separator";
import { createActionData, ensureDate } from "~/core/schemas";
import { Icon } from "~/generated/icon";

export const ActionFormData = createActionData(
  z.object({
    description: z.string().trim().min(1, "Veuillez entrer une description"),
    endDate: z.preprocess(
      ensureDate,
      z.date({
        required_error: "Veuillez entrer une date de fin",
        invalid_type_error: "Veuillez entrer une date de fin valide",
      })
    ),
    image: z.string({ required_error: "Veuillez choisir une affiche" }),
    isDraft: zfd.checkbox(),
    isFullDay: zfd.checkbox(),
    location: z.string().trim().min(1, "Veuillez entrer un lieu"),
    startDate: z.preprocess(
      ensureDate,
      z.date({
        required_error: "Veuillez entrer une date de début",
        invalid_type_error: "Veuillez entrer une date de début valide",
      })
    ),
    title: z.string().trim().min(1, "Veuillez entrer un titre"),
    url: z.union([
      z.literal(""),
      z.string().url("Veuillez entrer une URL valide"),
    ]),
  })
);

type ImageState = "loading" | "error" | { image: undefined | ImageFileOrId };

export function EventForm({
  defaultEvent,
  fetcher,
}: {
  defaultEvent?: null | SerializeFrom<
    Pick<
      Event,
      | "description"
      | "endDate"
      | "image"
      | "isFullDay"
      | "isVisible"
      | "location"
      | "startDate"
      | "title"
      | "url"
    >
  >;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultEvent == null;
  const action = useFormAction();
  const [imageState, setImageState] = useState<ImageState>({
    image: defaultEvent?.image,
  });
  const [isFullDay, setisFullDay] = useState(defaultEvent?.isFullDay ?? true);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.title != null) {
        titleRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.location != null) {
        locationRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.url != null) {
        urlRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.startDate != null) {
        startDateRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.endDate != null) {
        endDateRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.description != null) {
        descriptionRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  async function handleImageChange() {
    invariant(imageRef.current != null, "imageRef should be defined");

    if (imageRef.current.files != null && imageRef.current.files.length > 0) {
      setImageState("loading");

      try {
        setImageState({ image: await readFile(imageRef.current.files[0]) });
      } catch (error) {
        console.error("Could not import image:", error);
        setImageState("error");
      } finally {
        // Clear native input value to make sure the user can select multiple
        // times the same file.
        // https://stackoverflow.com/a/9617756
        imageRef.current.value = "";
      }
    }
  }

  let formErrors = fetcher.data?.errors?.formErrors ?? [];
  if (imageState === "error") {
    formErrors = formErrors.concat([
      "Une erreur est survenue lors de l’import d’image.",
    ]);
  }

  return (
    <Form
      noValidate
      hasHeader
      onSubmit={(event) => {
        // Because we manually create the FormData to send, we need to manually
        // submit the form.
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        if (
          typeof imageState === "object" &&
          imageState.image != null &&
          !isImageOverSize(imageState.image)
        ) {
          const value = isImageFile(imageState.image)
            ? imageState.image.file
            : imageState.image;
          formData.set(ActionFormData.keys.image, value);
        }

        fetcher.submit(formData, {
          method: "POST",
          encType: "multipart/form-data",
          action,
        });
      }}
    >
      <Form.Fields>
        <Form.Errors errors={formErrors} />

        <Form.Field>
          <Form.Label htmlFor={ActionFormData.keys.image}>
            Affiche <RequiredStar />
          </Form.Label>

          <ImageInput.Native
            ref={imageRef}
            id={ActionFormData.keys.image}
            aria-describedby="image-error"
            onChange={handleImageChange}
          />

          {imageState === "loading" ? (
            <span aria-hidden className="aspect-4/3 rounded-1 bg-gray-100" />
          ) : imageState === "error" || imageState.image == null ? (
            <ImageInput.Trigger
              label="Choisir"
              icon="upload"
              onClick={() => imageRef.current?.click()}
              hasError={fetcher.data?.errors?.fieldErrors.image != null}
              className="aspect-4/3"
            />
          ) : (
            <ImageInput.Preview>
              <ImageInput.PreviewImage
                alt="Affiche"
                image={imageState.image}
                fallbackSize="1024"
                sizes={{ default: "100vw", md: "600px" }}
              />

              <ImageInput.PreviewOverSizeHelper>
                Image trop grande. La taille maximum est de{" "}
                {IMAGE_SIZE_LIMIT_MB} MiB.
              </ImageInput.PreviewOverSizeHelper>

              <ImageInput.PreviewAction
                onClick={() => imageRef.current?.click()}
              >
                <Icon id="upload" />
                Changer
              </ImageInput.PreviewAction>
            </ImageInput.Preview>
          )}

          {fetcher.data?.errors?.fieldErrors.image != null ? (
            <Form.ErrorMessage id="image-error">
              {fetcher.data.errors.fieldErrors.image}
            </Form.ErrorMessage>
          ) : null}
        </Form.Field>

        <Separator />

        <Form.Field>
          <Form.Label htmlFor={ActionFormData.keys.title}>
            Titre <RequiredStar />
          </Form.Label>

          <Input
            ref={titleRef}
            id={ActionFormData.keys.title}
            type="text"
            name={ActionFormData.keys.title}
            defaultValue={defaultEvent?.title}
            hasError={fetcher.data?.errors?.fieldErrors.title != null}
            aria-describedby="title-error"
          />

          {fetcher.data?.errors?.fieldErrors.title != null ? (
            <Form.ErrorMessage id="title-error">
              {fetcher.data.errors.fieldErrors.title}
            </Form.ErrorMessage>
          ) : null}
        </Form.Field>

        <Form.Field isInline>
          <Form.Label htmlFor={ActionFormData.keys.isDraft}>
            Brouillon
          </Form.Label>

          <SwitchInput
            id={ActionFormData.keys.isDraft}
            name={ActionFormData.keys.isDraft}
            defaultChecked={defaultEvent?.isVisible === false}
          />
        </Form.Field>

        <Separator />

        <Form.Field>
          <Form.Label htmlFor={ActionFormData.keys.location}>
            Lieu <RequiredStar />
          </Form.Label>

          <Input
            ref={locationRef}
            id={ActionFormData.keys.location}
            type="text"
            name={ActionFormData.keys.location}
            defaultValue={defaultEvent?.location}
            hasError={fetcher.data?.errors?.fieldErrors.location != null}
            aria-describedby="location-error"
            leftAdornment={
              <Input.Adornment>
                <Icon id="locationDot" />
              </Input.Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.location != null ? (
            <Form.ErrorMessage id="location-error">
              {fetcher.data.errors.fieldErrors.location}
            </Form.ErrorMessage>
          ) : null}
        </Form.Field>

        <Form.Field>
          <Form.Label htmlFor={ActionFormData.keys.url}>
            Lien externe
          </Form.Label>

          <Input
            ref={urlRef}
            id={ActionFormData.keys.url}
            type="url"
            name={ActionFormData.keys.url}
            defaultValue={defaultEvent?.url ?? undefined}
            hasError={fetcher.data?.errors?.fieldErrors.url != null}
            aria-describedby="url-error"
            leftAdornment={
              <Input.Adornment>
                <Icon id="globe" />
              </Input.Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.url != null ? (
            <Form.ErrorMessage id="url-error">
              {fetcher.data.errors.fieldErrors.url}
            </Form.ErrorMessage>
          ) : null}
        </Form.Field>

        <Separator />

        <Form.Field isInline>
          <Form.Label htmlFor={ActionFormData.keys.isFullDay}>
            Journée complète
          </Form.Label>

          <SwitchInput
            id={ActionFormData.keys.isFullDay}
            name={ActionFormData.keys.isFullDay}
            checked={isFullDay}
            onChange={() => setisFullDay(!isFullDay)}
          />
        </Form.Field>

        <Form.Row>
          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.startDate}>
              Date de début <RequiredStar />
            </Form.Label>

            <Input
              ref={startDateRef}
              id={ActionFormData.keys.startDate}
              // Make sure to recreate the DOM element because the native values
              // don't have the same format between date and datetime-local and
              // triggers the following warning:
              // The specified value "2023-01-01T00:00" does not conform to the
              // required format, "yyyy-MM-dd".
              key={String(isFullDay)}
              type={isFullDay ? "date" : "datetime-local"}
              name={ActionFormData.keys.startDate}
              defaultValue={toIsoDateValue(defaultEvent?.startDate, {
                hasTime: !isFullDay,
              })}
              hasError={fetcher.data?.errors?.fieldErrors.startDate != null}
              aria-describedby="startDate-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="calendarDays" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.startDate != null ? (
              <Form.ErrorMessage id="startDate-error">
                {fetcher.data.errors.fieldErrors.startDate}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.endDate}>
              Date de fin <RequiredStar />
            </Form.Label>

            <Input
              ref={endDateRef}
              id={ActionFormData.keys.endDate}
              // Make sure to recreate the DOM element because the native values
              // don't have the same format between date and datetime-local and
              // triggers the following warning:
              // The specified value "2023-01-01T00:00" does not conform to the
              // required format, "yyyy-MM-dd".
              key={String(isFullDay)}
              type={isFullDay ? "date" : "datetime-local"}
              name={ActionFormData.keys.endDate}
              defaultValue={toIsoDateValue(defaultEvent?.endDate, {
                hasTime: !isFullDay,
              })}
              hasError={fetcher.data?.errors?.fieldErrors.endDate != null}
              aria-describedby="endDate-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="calendarDays" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.endDate != null ? (
              <Form.ErrorMessage id="endDate-error">
                {fetcher.data.errors.fieldErrors.endDate}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>
        </Form.Row>

        <Separator />

        <Form.Field>
          <Form.Label htmlFor={ActionFormData.keys.description}>
            Description <RequiredStar />
          </Form.Label>

          <Textarea
            ref={descriptionRef}
            id={ActionFormData.keys.description}
            name={ActionFormData.keys.description}
            defaultValue={defaultEvent?.description}
            hasError={fetcher.data?.errors?.fieldErrors.description != null}
            aria-describedby="description-error"
            rows={5}
          />

          {fetcher.data?.errors?.fieldErrors.description != null ? (
            <Form.ErrorMessage id="description-error">
              {fetcher.data.errors.fieldErrors.description}
            </Form.ErrorMessage>
          ) : null}
        </Form.Field>
      </Form.Fields>

      <Form.Action asChild>
        <Action type="submit">
          {isCreate ? "Créer" : "Enregistrer"}
          <Action.Loader isLoading={fetcher.state !== "idle"} />
        </Action>
      </Form.Action>
    </Form>
  );
}
