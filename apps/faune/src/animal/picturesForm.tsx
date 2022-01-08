import { Animal } from "@animeaux/shared";
import { Avatar } from "core/dataDisplay/avatar";
import { Image, ImageFileOrId } from "core/dataDisplay/image";
import { Info } from "core/dataDisplay/info";
import { Field } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { ImageInput } from "core/formElements/imageInput";
import { SubmitButton } from "core/formElements/submitButton";
import { BaseValidationError } from "core/formValidation";
import { joinReactNodes } from "core/joinReactNodes";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import { FaPaw } from "react-icons/fa";
import styled from "styled-components";
import { theme } from "styles/theme";

type ErrorCode = "server-error" | "image-upload-error" | "missing-avatar";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "image-upload-error": "Les images n'ont pas pu être envoyées.",
  "missing-avatar": "L'avatar est obligatoire",
};

export type FormState = {
  pictures: ImageFileOrId[];
  errors: ErrorCode[];
};

export type FormValue = {
  avatar: ImageFileOrId;
  pictures: ImageFileOrId[];
};

export type AnimalPicturesFormProps = {
  state: FormState;
  setState: React.Dispatch<SetStateAction<FormState>>;
  onSubmit: (value: FormValue) => void;
  pending?: boolean;
  isEdit?: boolean;
  serverErrors?: ErrorCode[];
};

export function AnimalPicturesForm({
  state,
  setState,
  onSubmit,
  pending = false,
  isEdit = false,
  serverErrors = [],
}: AnimalPicturesFormProps) {
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

  const errors = [...serverErrors, ...state.errors].map(
    (error) => ERROR_CODE_LABEL[error]
  );

  return (
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <Info variant="error">{joinReactNodes(errors, <br />)}</Info>
      )}

      <Preview>
        <AnimalAvatar>
          {state.pictures.length === 0 ? (
            <FaPaw />
          ) : (
            <AnimalImage image={state.pictures[0]} alt="Avatar" />
          )}
        </AnimalAvatar>

        <Helper>La première photo sera utilisée comme avatar</Helper>
      </Preview>

      <Field>
        <ImageInput
          value={state.pictures}
          onChange={(change) => setState(setPictures(change))}
        />
      </Field>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Créer"}
      </SubmitButton>
    </Form>
  );
}

const Preview = styled.div`
  padding: ${theme.spacing.x2} ${theme.spacing.x4};
  display: flex;
  align-items: center;
`;

const AnimalAvatar = styled(Avatar)`
  font-size: 60px;
`;

const AnimalImage = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Helper = styled.p`
  margin-left: ${theme.spacing.x4};
  flex: 1;
  color: ${theme.colors.text.secondary};
`;

export function initializeState(initialAnimal?: Animal) {
  return (): FormState => ({
    pictures:
      initialAnimal == null
        ? []
        : [initialAnimal.avatarId, ...initialAnimal.picturesId],
    errors: [],
  });
}

function setPictures(
  change: SetStateAction<ImageFileOrId[]>
): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    pictures: change(prevState.pictures),
    errors: without(prevState.errors, "missing-avatar"),
  });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (state.pictures.length < 1) {
    errorCodes.push("missing-avatar");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    avatar: state.pictures[0],
    pictures: state.pictures.slice(1),
  };
}
