import { Event, EventCategory, EVENT_CATEGORY_LABELS } from "@animeaux/shared";
import { Button } from "core/actions/button";
import {
  getFiles,
  Image,
  ImageFileOrId,
  IMAGE_SIZE_LIMIT,
} from "core/dataDisplay/image";
import { Info } from "core/dataDisplay/info";
import { AsideFields, Field, Fields } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import {
  Selector,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { Textarea } from "core/formElements/textarea";
import { ToggleInput } from "core/formElements/toggleInput";
import { BaseValidationError } from "core/formValidation";
import { includes } from "core/includes";
import { joinReactNodes } from "core/joinReactNodes";
import { Separator } from "core/layouts/separator";
import { showSnackbar, Snackbar } from "core/popovers/snackbar";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import { DateTime } from "luxon";
import { useRef, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import styled from "styled-components";
import { theme } from "styles/theme";
import { string } from "yup";

type ErrorCode =
  | "server-error"
  | "empty-title"
  | "empty-short-description"
  | "empty-description"
  | "empty-start-date"
  | "invalid-start-date"
  | "empty-start-time"
  | "invalid-start-time"
  | "empty-end-date"
  | "invalid-end-date"
  | "empty-end-time"
  | "invalid-end-time"
  | "end-date-before-start"
  | "empty-location"
  | "empty-category"
  | "image-upload-error";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-title": "Le titre est obligatoire.",
  "empty-short-description": "La description courte est obligatoire.",
  "empty-description": "La description est obligatoire.",
  "empty-start-date": "La date de début est obligatoire.",
  "invalid-start-date": "Le format de la date de début est invalide.",
  "empty-start-time": "L'heure de début est obligatoire.",
  "invalid-start-time": "Le format de l'heure de début est invalide.",
  "empty-end-date": "La date de fin est obligatoire.",
  "invalid-end-date": "Le format de la date de fin est invalide.",
  "empty-end-time": "L'heure de fin est obligatoire.",
  "invalid-end-time": "Le format de l'heure de fin est invalide.",
  "end-date-before-start":
    "La date de fin ne peut pas être avant la date de début.",
  "empty-location": "Le lieu est obligatoire.",
  "empty-category": "La catégorie est obligatoire.",
  "image-upload-error": "L'image n'a pas pu être envoyée.",
};

type FormState = {
  title: string;
  shortDescription: string;
  description: string;
  image: ImageFileOrId | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isFullDay: boolean;
  location: string;
  category: EventCategory | null;
  isVisible: boolean;
  errors: ErrorCode[];
};

export type FormValue = {
  title: string;
  shortDescription: string;
  description: string;
  image: ImageFileOrId | null;
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  location: string;
  category: EventCategory;
  isVisible: boolean;
};

type EventFormProps = {
  initialEvent?: Event;
  pending: boolean;
  onSubmit: (value: FormValue) => void;
  serverErrors: ErrorCode[];
};

export function EventForm({
  initialEvent,
  onSubmit,
  pending,
  serverErrors,
}: EventFormProps) {
  const [state, setState] = useState(initializeState(initialEvent));

  async function handleSubmit() {
    if (!pending) {
      try {
        onSubmit(validate(state));
      } catch (error) {
        invariant(
          error instanceof ValidationError,
          "The error is expected to be a ValidationError error"
        );

        setState(setErrors(error.codes));
      }
    }
  }

  const inputFile = useRef<HTMLInputElement | null>(null);

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files != null && event.target.files.length === 1) {
      try {
        const [image] = await getFiles(event.target.files);

        if (image.file.size >= IMAGE_SIZE_LIMIT) {
          showSnackbar.error(<Snackbar>L'image est trop grande</Snackbar>);
        }

        setState(setImage(image));
      } catch (error) {
        showSnackbar.error(
          <Snackbar>
            Une erreur est survenue lors de l'import de l'image
          </Snackbar>
        );
      } finally {
        invariant(inputFile.current != null, "inputFile should be applied.");

        // Clear native input value to make sure the user can select multiple
        // times the same file.
        // https://stackoverflow.com/a/9617756
        inputFile.current.value = "";
      }
    }
  }

  const errors = [...serverErrors, ...state.errors];

  return (
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <Info variant="error">
          {joinReactNodes(
            errors.map((error) => ERROR_CODE_LABEL[error]),
            <br />
          )}
        </Info>
      )}

      <Fields>
        <Field>
          <Label htmlFor="event-image">Image de l'événement</Label>
          <EventImage alt="Image de l'événement" image={state.image} />

          <ImageInput
            ref={inputFile}
            id="event-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          <ImageActions>
            <Button
              type="button"
              onClick={() => inputFile.current?.click()}
              style={{ flex: "none" }}
            >
              <FaUpload />
              {state.image == null ? "Ajouter une image" : "Modifier l'image"}
            </Button>

            <Button
              type="button"
              onClick={() => setState(setImage(null))}
              disabled={state.image == null}
              style={{
                flex: "none",
                paddingLeft: theme.spacing.x2,
                paddingRight: theme.spacing.x2,
              }}
            >
              <span
                style={{
                  height: "calc(1em * 1.5)",
                  width: "calc(1em * 1.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaTrash />
              </span>
            </Button>
          </ImageActions>
        </Field>

        <Separator />

        <Field>
          <Label
            htmlFor="event-title"
            hasError={includes(errors, "empty-title")}
          >
            Titre
          </Label>

          <Input
            name="event-title"
            id="event-title"
            type="text"
            value={state.title}
            onChange={(title) => setState(setTitle(title))}
            hasError={includes(errors, "empty-title")}
          />
        </Field>

        <ToggleInput
          label="Afficher sur le site internet"
          checked={state.isVisible}
          onChange={(event) => setState(setIsVisible(event.target.checked))}
        />

        <Field>
          <Label hasError={includes(errors, "empty-category")}>Catégorie</Label>

          <Selectors>
            {Object.values(EventCategory).map((category) => (
              <SelectorItem key={category}>
                <Selector hasError={includes(errors, "empty-category")}>
                  <SelectorRadio
                    name="category"
                    checked={state.category === category}
                    onChange={() => setState(setCategory(category))}
                  />

                  <SelectorLabel>
                    {EVENT_CATEGORY_LABELS[category]}
                  </SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>

        <Field>
          <Label
            htmlFor="event-location"
            hasError={includes(errors, "empty-location")}
          >
            Lieu
          </Label>

          <Input
            name="event-location"
            id="event-location"
            type="text"
            value={state.location}
            onChange={(location) => setState(setLocation(location))}
            hasError={includes(errors, "empty-location")}
          />
        </Field>

        <Field>
          <Label
            htmlFor="short-description"
            hasError={includes(errors, "empty-short-description")}
          >
            Courte description
          </Label>

          <Input
            name="short-description"
            id="short-description"
            type="text"
            value={state.shortDescription}
            onChange={(shortDescription) =>
              setState(setShortDescription(shortDescription))
            }
            hasError={includes(errors, "empty-short-description")}
          />
        </Field>

        <Separator />

        <AsideFields>
          <Field>
            <Label
              htmlFor="event-start-date"
              hasError={includes(
                state.errors,
                "empty-start-date",
                "invalid-start-date",
                "end-date-before-start"
              )}
            >
              Date de début
            </Label>

            <Input
              name="event-start-date"
              id="event-start-date"
              type="date"
              value={state.startDate}
              onChange={(startDate) => setState(setStartDate(startDate))}
              hasError={includes(
                state.errors,
                "empty-start-date",
                "invalid-start-date",
                "end-date-before-start"
              )}
            />
          </Field>

          <Field>
            <Label
              htmlFor="event-end-date"
              hasError={includes(
                state.errors,
                "empty-end-date",
                "invalid-end-date",
                "end-date-before-start"
              )}
            >
              Date de fin
            </Label>

            <Input
              name="event-end-date"
              id="event-end-date"
              type="date"
              value={state.endDate}
              onChange={(endDate) => setState(setEndDate(endDate))}
              hasError={includes(
                state.errors,
                "empty-end-date",
                "invalid-end-date",
                "end-date-before-start"
              )}
            />
          </Field>
        </AsideFields>

        <ToggleInput
          label="Journée complète"
          checked={state.isFullDay}
          onChange={(event) => setState(setIsFullDay(event.target.checked))}
        />

        {!state.isFullDay && (
          <>
            <AsideFields>
              <Field>
                <Label
                  htmlFor="event-start-time"
                  hasError={includes(
                    state.errors,
                    "empty-start-time",
                    "invalid-start-time",
                    "end-date-before-start"
                  )}
                >
                  Heure de début
                </Label>

                <Input
                  name="event-start-time"
                  id="event-start-time"
                  type="time"
                  value={state.startTime}
                  onChange={(startTime) => setState(setStartTime(startTime))}
                  hasError={includes(
                    state.errors,
                    "empty-start-time",
                    "invalid-start-time",
                    "end-date-before-start"
                  )}
                />
              </Field>

              <Field>
                <Label
                  htmlFor="event-end-time"
                  hasError={includes(
                    state.errors,
                    "empty-end-time",
                    "invalid-end-time",
                    "end-date-before-start"
                  )}
                >
                  Heure de fin
                </Label>

                <Input
                  name="event-end-time"
                  id="event-end-time"
                  type="time"
                  value={state.endTime}
                  onChange={(endTime) => setState(setEndTime(endTime))}
                  hasError={includes(
                    state.errors,
                    "empty-end-time",
                    "invalid-end-time",
                    "end-date-before-start"
                  )}
                />
              </Field>
            </AsideFields>
          </>
        )}

        <Separator />

        <Field>
          <Label
            htmlFor="description"
            hasError={includes(errors, "empty-description")}
          >
            Description
          </Label>

          <Textarea
            name="description"
            id="description"
            value={state.description}
            onChange={(description) => setState(setDescription(description))}
            hasError={includes(errors, "empty-description")}
            rows={5}
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {initialEvent == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

const EventImage = styled(Image)`
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: ${theme.borderRadius.m};

  &[data-fallback] {
    background: ${theme.colors.dark[30]};
    font-size: 60px;
  }
`;

const ImageInput = styled.input`
  visibility: hidden;
  display: none;
`;

const ImageActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.x4};
`;

function initializeState(initialEvent?: Event) {
  return (): FormState => {
    const initialStartDate =
      initialEvent == null ? null : DateTime.fromISO(initialEvent.startDate);

    const initialEndDate =
      initialEvent == null ? null : DateTime.fromISO(initialEvent.endDate);

    return {
      title: initialEvent?.title ?? "",
      shortDescription: initialEvent?.shortDescription ?? "",
      description: initialEvent?.description ?? "",
      image: initialEvent?.image ?? null,
      startDate: initialStartDate?.toISODate() ?? DateTime.now().toISODate(),
      startTime: initialStartDate?.toISOTime().substring(0, 5) ?? "00:00",
      endDate: initialEndDate?.toISODate() ?? DateTime.now().toISODate(),
      endTime: initialEndDate?.toISOTime().substring(0, 5) ?? "23:59",
      isFullDay: initialEvent?.isFullDay ?? true,
      location: initialEvent?.location ?? "",
      category: initialEvent?.category ?? null,
      isVisible: initialEvent?.isVisible ?? false,
      errors: [],
    };
  };
}

function setImage(image: FormState["image"]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, image });
}

function setTitle(title: FormState["title"]): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    title,
    errors: without(prevState.errors, "empty-title"),
  });
}

function setLocation(
  location: FormState["location"]
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    location,
    errors: without(prevState.errors, "empty-location"),
  });
}

function setIsVisible(
  isVisible: FormState["isVisible"]
): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, isVisible });
}

function setCategory(
  category: FormState["category"]
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    category,
    errors: without(prevState.errors, "empty-category"),
  });
}

function setShortDescription(
  shortDescription: FormState["shortDescription"]
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    shortDescription,
    errors: without(prevState.errors, "empty-short-description"),
  });
}

function setDescription(
  description: FormState["description"]
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    description,
    errors: without(prevState.errors, "empty-description"),
  });
}

function setStartDate(
  startDate: FormState["startDate"]
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    startDate,
    errors: without(
      prevState.errors,
      "empty-start-date",
      "invalid-start-date",
      "end-date-before-start"
    ),
  });
}

function setEndDate(endDate: FormState["endDate"]): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    endDate,
    errors: without(
      prevState.errors,
      "empty-end-date",
      "invalid-end-date",
      "end-date-before-start"
    ),
  });
}

function setIsFullDay(
  isFullDay: FormState["isFullDay"]
): SetStateAction<FormState> {
  return (prevState) => {
    return {
      ...prevState,
      isFullDay,
      errors: without(
        prevState.errors,
        "empty-start-time",
        "empty-end-time",
        "end-date-before-start"
      ),
    };
  };
}

function setStartTime(
  startTime: FormState["startTime"]
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    startTime,
    errors: without(
      prevState.errors,
      "empty-start-time",
      "invalid-start-time",
      "end-date-before-start"
    ),
  });
}

function setEndTime(endTime: FormState["endTime"]): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    endTime,
    errors: without(
      prevState.errors,
      "empty-end-time",
      "invalid-end-time",
      "end-date-before-start"
    ),
  });
}

function setErrors(errors: FormState["errors"]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (!string().trim().required().isValidSync(state.title)) {
    errorCodes.push("empty-title");
  }

  if (!string().trim().required().isValidSync(state.shortDescription)) {
    errorCodes.push("empty-short-description");
  }

  if (!string().trim().required().isValidSync(state.description)) {
    errorCodes.push("empty-description");
  }

  if (!string().trim().required().isValidSync(state.startDate)) {
    errorCodes.push("empty-start-date");
  } else if (!string().trim().dateISO().isValidSync(state.startDate)) {
    errorCodes.push("invalid-start-date");
  }

  if (!string().trim().required().isValidSync(state.endDate)) {
    errorCodes.push("empty-end-date");
  } else if (!string().trim().dateISO().isValidSync(state.endDate)) {
    errorCodes.push("invalid-end-date");
  }

  if (!state.isFullDay) {
    if (!string().trim().required().isValidSync(state.startTime)) {
      errorCodes.push("empty-start-time");
    } else if (
      !string()
        .trim()
        .matches(/^\d\d:\d\d$/)
        .isValidSync(state.startTime)
    ) {
      errorCodes.push("invalid-start-time");
    }

    if (!string().trim().required().isValidSync(state.endTime)) {
      errorCodes.push("empty-end-time");
    } else if (
      !string()
        .trim()
        .matches(/^\d\d:\d\d$/)
        .isValidSync(state.endTime)
    ) {
      errorCodes.push("invalid-end-time");
    }
  }

  let startDateTime = DateTime.fromISO(
    state.isFullDay ? state.startDate : `${state.startDate}T${state.startTime}`
  );

  let endDateTime = DateTime.fromISO(
    state.isFullDay ? state.endDate : `${state.endDate}T${state.endTime}`
  );

  if (state.isFullDay) {
    startDateTime = startDateTime.startOf("day");
    endDateTime = endDateTime.endOf("day");
  }

  if (startDateTime >= endDateTime) {
    errorCodes.push("end-date-before-start");
  }

  if (!string().trim().required().isValidSync(state.location)) {
    errorCodes.push("empty-location");
  }

  if (state.category == null) {
    errorCodes.push("empty-category");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    title: state.title.trim(),
    shortDescription: state.shortDescription.trim(),
    description: state.description.trim(),
    image: state.image,
    startDate: startDateTime.toISO(),
    endDate: endDateTime.toISO(),
    isFullDay: state.isFullDay,
    location: state.location.trim(),
    category: state.category!,
    isVisible: state.isVisible,
  };
}
