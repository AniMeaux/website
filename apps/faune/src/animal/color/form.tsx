import {
  AnimalColor,
  OperationResult,
  PickOperationErrorResult,
} from "@animeaux/shared";
import { Info } from "core/dataDisplay/info";
import { Adornment } from "core/formElements/adornment";
import { Field, Fields } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { SubmitButton } from "core/formElements/submitButton";
import { BaseValidationError } from "core/formValidation";
import { includes } from "core/includes";
import { joinReactNodes } from "core/joinReactNodes";
import { Placeholder } from "core/loaders/placeholder";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import { useState } from "react";
import { FaPalette } from "react-icons/fa";
import { string } from "yup";

type ErrorCode =
  | PickOperationErrorResult<
      OperationResult<"createAnimalColor" | "updateAnimalColor">
    >["code"]
  | "server-error"
  | "empty-name";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-name": "Le nom est obligatoire.",
  "name-already-used": "Le nom est déjà utilisé.",
};

type FormState = {
  name: string;
  errors: ErrorCode[];
};

type FormValue = Omit<FormState, "errors">;

type AnimalColorFormProps = {
  initialAnimalColor?: AnimalColor;
  pending: boolean;
  onSubmit: (value: FormValue) => void;
  serverErrors: ErrorCode[];
};

export function AnimalColorForm({
  initialAnimalColor,
  onSubmit,
  pending,
  serverErrors,
}: AnimalColorFormProps) {
  const [state, setState] = useState(initializeState(initialAnimalColor));

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
          <Label
            htmlFor="animal-color-name"
            hasError={includes(errors, "empty-name", "name-already-used")}
          >
            Nom
          </Label>

          <Input
            name="animal-color-name"
            id="animal-color-name"
            type="text"
            value={state.name}
            onChange={(animalColor) => setState(setName(animalColor))}
            hasError={includes(errors, "empty-name", "name-already-used")}
            leftAdornment={
              <Adornment>
                <FaPalette />
              </Adornment>
            }
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {initialAnimalColor == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

function initializeState(initialAnimalColor?: AnimalColor) {
  return (): FormState => ({
    name: initialAnimalColor?.name ?? "",
    errors: [],
  });
}

function setName(name: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    name,
    errors: without(prevState.errors, "empty-name"),
  });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (!string().trim().required().isValidSync(state.name)) {
    errorCodes.push("empty-name");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return { name: state.name };
}

export function AnimalColorFormPlaceholder() {
  return (
    <Form>
      <Fields>
        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Placeholder $preset="input" />
        </Field>
      </Fields>
    </Form>
  );
}
