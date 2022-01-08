import {
  AnimalBreed,
  AnimalSpecies,
  OperationResult,
  PickOperationErrorResult,
} from "@animeaux/shared";
import { AnimalSpeciesInput } from "animal/species/input";
import { Info } from "core/dataDisplay/info";
import { Adornment } from "core/formElements/adornment";
import { Field, Fields } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { SelectorItem, Selectors } from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { BaseValidationError } from "core/formValidation";
import { includes } from "core/includes";
import { joinReactNodes } from "core/joinReactNodes";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import { useState } from "react";
import { FaDna } from "react-icons/fa";
import { string } from "yup";

type ErrorCode =
  | PickOperationErrorResult<
      OperationResult<"createAnimalBreed" | "updateAnimalBreed">
    >["code"]
  | "server-error"
  | "empty-name"
  | "empty-species";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-name": "Le nom est obligatoire.",
  "empty-species": "L'espèce est obligatoire",
  "already-exists": "Cette race existe déjà",
};

type FormState = {
  name: string;
  species: AnimalSpecies | null;
  errors: ErrorCode[];
};

type FormValue = {
  name: string;
  species: AnimalSpecies;
};

type AnimalBreedFormProps = {
  initialAnimalBreed?: AnimalBreed;
  pending: boolean;
  onSubmit: (value: FormValue) => void;
  serverErrors: ErrorCode[];
};

export function AnimalBreedForm({
  initialAnimalBreed,
  onSubmit,
  pending,
  serverErrors,
}: AnimalBreedFormProps) {
  const [state, setState] = useState(initializeState(initialAnimalBreed));

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
            htmlFor="animal-breed-name"
            hasError={includes(errors, "empty-name", "already-exists")}
          >
            Nom
          </Label>

          <Input
            name="animal-breed-name"
            id="animal-breed-name"
            type="text"
            value={state.name}
            onChange={(name) => setState(setName(name))}
            hasError={includes(errors, "empty-name", "already-exists")}
            leftAdornment={
              <Adornment>
                <FaDna />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label hasError={includes(errors, "empty-species", "already-exists")}>
            Espèce
          </Label>

          <AnimalSpeciesInput
            value={state.species}
            onChange={(species) => setState(setSpecies(species))}
            hasError={includes(errors, "empty-species", "already-exists")}
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {state == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

function initializeState(initialAnimalBreed?: AnimalBreed) {
  return (): FormState => ({
    name: initialAnimalBreed?.name ?? "",
    species: initialAnimalBreed?.species ?? null,
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

function setSpecies(species: AnimalSpecies): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    species,
    errors: without(prevState.errors, "empty-species"),
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

  if (state.species == null) {
    errorCodes.push("empty-species");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    name: state.name,
    species: state.species!,
  };
}

export function AnimalBreedFormPlaceholder() {
  return (
    <Form>
      <Fields>
        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Placeholder $preset="input" />
        </Field>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={Object.values(AnimalSpecies).length}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>
      </Fields>
    </Form>
  );
}
