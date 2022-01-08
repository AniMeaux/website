import {
  Animal,
  AnimalBreed,
  AnimalColor,
  AnimalGender,
  AnimalSpecies,
} from "@animeaux/shared";
import { AnimalGenderIcon } from "animal/animalGenderIcon";
import { ANIMAL_GENDER_LABELS } from "animal/gender/labels";
import { AnimalSpeciesIcon } from "animal/species/icon";
import { AnimalSpeciesInput } from "animal/species/input";
import { Info } from "core/dataDisplay/info";
import { ActionAdornment, Adornment } from "core/formElements/adornment";
import { DateInput } from "core/formElements/dateInput";
import { Field, Fields } from "core/formElements/field";
import { Form } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { LinkInput } from "core/formElements/linkInput";
import {
  Selector,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { Textarea } from "core/formElements/textarea";
import { BaseValidationError } from "core/formValidation";
import { includes } from "core/includes";
import { joinReactNodes } from "core/joinReactNodes";
import { Separator } from "core/layouts/separator";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import { SetStateAction } from "core/types";
import invariant from "invariant";
import without from "lodash.without";
import {
  FaComment,
  FaDna,
  FaFingerprint,
  FaPalette,
  FaTimes,
} from "react-icons/fa";
import { string } from "yup";

type ErrorCode =
  | "server-error"
  | "empty-name"
  | "empty-birthdate"
  | "invalid-birthdate"
  | "empty-gender"
  | "empty-species"
  | "breed-species-missmatch";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-name": "Le nom est obligatoire.",
  "empty-birthdate": "La date de naissance est obligatoire.",
  "invalid-birthdate": "Le format de la date est invalide.",
  "empty-gender": "Le genre est obligatoire.",
  "empty-species": "L'espèce est obligatoire.",
  "breed-species-missmatch": "La race n'appartient pas à cette espèce",
};

export type FormState = {
  name: string;
  alias: string;
  birthdate: string;
  gender: AnimalGender | null;
  species: AnimalSpecies | null;
  breed: AnimalBreed | null;
  color: AnimalColor | null;
  iCadNumber: string;
  description: string;
  errors: ErrorCode[];
};

export type FormValue = {
  officialName: string;
  commonName: string | null;
  birthdate: string;
  gender: AnimalGender;
  species: AnimalSpecies;
  breedId: string | null;
  colorId: string | null;
  iCadNumber: string | null;
  description: string | null;
};

export type AnimalProfileFormProps = {
  state: FormState;
  setState: React.Dispatch<SetStateAction<FormState>>;
  onSubmit: (value: FormValue) => void;
  pending?: boolean;
  isEdit?: boolean;
  serverErrors?: ErrorCode[];
};

export function AnimalProfileForm({
  state,
  setState,
  onSubmit,
  pending = false,
  isEdit = false,
  serverErrors = [],
}: AnimalProfileFormProps) {
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

      <Fields>
        <Field>
          <Label hasError={includes(state.errors, "empty-species")}>
            Espèce
          </Label>

          <AnimalSpeciesInput
            value={state.species}
            onChange={(species) => setState(setSpecies(species))}
            hasError={includes(state.errors, "empty-species")}
          />
        </Field>

        <Field>
          <Label
            htmlFor="animal-name"
            hasError={includes(state.errors, "empty-name")}
          >
            Nom
          </Label>

          <Input
            name="animal-name"
            id="animal-name"
            type="text"
            value={state.name}
            onChange={(name) => setState(setName(name))}
            hasError={includes(state.errors, "empty-name")}
            leftAdornment={
              state.species != null && (
                <Adornment>
                  <AnimalSpeciesIcon species={state.species} />
                </Adornment>
              )
            }
          />
        </Field>

        <Field>
          <Label htmlFor="animal-alias" isOptional>
            Alias
          </Label>

          <Input
            name="animal-alias"
            id="animal-alias"
            type="text"
            value={state.alias}
            onChange={(alias) => setState(setAlias(alias))}
            leftAdornment={
              <Adornment>
                <FaComment />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="animal-birthdate"
            hasError={includes(
              state.errors,
              "empty-birthdate",
              "invalid-birthdate"
            )}
          >
            Date de naissance
          </Label>

          <DateInput
            name="animal-birthdate"
            id="animal-birthdate"
            value={state.birthdate}
            onChange={(birthdate) => setState(setBirthdate(birthdate))}
            hasError={includes(
              state.errors,
              "empty-birthdate",
              "invalid-birthdate"
            )}
          />
        </Field>

        <Field>
          <Label hasError={includes(state.errors, "empty-gender")}>Genre</Label>

          <Selectors>
            {Object.values(AnimalGender).map((gender) => (
              <SelectorItem key={gender}>
                <Selector hasError={includes(state.errors, "empty-gender")}>
                  <SelectorRadio
                    name="gender"
                    checked={state.gender === gender}
                    onChange={() => setState(setGender(gender))}
                  />

                  <SelectorIcon>
                    <AnimalGenderIcon gender={gender} />
                  </SelectorIcon>

                  <SelectorLabel>{ANIMAL_GENDER_LABELS[gender]}</SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>

        <Separator />

        <Field>
          <Label htmlFor="animal-i-cad-number" isOptional>
            Numéro I-CAD
          </Label>

          <Input
            name="animal-i-cad-number"
            id="animal-i-cad-number"
            type="text"
            value={state.iCadNumber}
            onChange={(iCadNumber) => setState(setICadNumber(iCadNumber))}
            leftAdornment={
              <Adornment>
                <FaFingerprint />
              </Adornment>
            }
          />
        </Field>

        <Separator />

        <Field>
          <Label
            isOptional
            hasError={includes(state.errors, "breed-species-missmatch")}
          >
            Race
          </Label>

          <LinkInput
            href="../breed"
            value={state.breed?.name}
            hasError={includes(state.errors, "breed-species-missmatch")}
            leftAdornment={
              <Adornment>
                <FaDna />
              </Adornment>
            }
            rightAdornment={
              state.breed != null && (
                <ActionAdornment onClick={() => setState(clearBreed())}>
                  <FaTimes />
                </ActionAdornment>
              )
            }
          />
        </Field>

        <Field>
          <Label isOptional htmlFor="animal-color">
            Couleur
          </Label>

          <LinkInput
            href="../color"
            value={state.color?.name}
            leftAdornment={
              <Adornment>
                <FaPalette />
              </Adornment>
            }
            rightAdornment={
              state.color != null && (
                <ActionAdornment onClick={() => setState(clearColor())}>
                  <FaTimes />
                </ActionAdornment>
              )
            }
          />
        </Field>

        <Field>
          <Label htmlFor="description" isOptional>
            Description publique
          </Label>

          <Textarea
            name="description"
            id="description"
            value={state.description}
            onChange={(description) => setState(setDescription(description))}
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Suivant"}
      </SubmitButton>
    </Form>
  );
}

export function initializeState(initialAnimal?: Animal) {
  return (): FormState => ({
    alias: initialAnimal?.commonName ?? "",
    birthdate: initialAnimal?.birthdate ?? "",
    breed: initialAnimal?.breed ?? null,
    color: initialAnimal?.color ?? null,
    description: initialAnimal?.description ?? "",
    gender: initialAnimal?.gender ?? null,
    iCadNumber: initialAnimal?.iCadNumber ?? "",
    name: initialAnimal?.officialName ?? "",
    species: initialAnimal?.species ?? null,
    errors: [],
  });
}

function setSpecies(species: AnimalSpecies): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    species,
    errors: without(
      prevState.errors,
      "empty-species",
      "breed-species-missmatch"
    ),
  });
}

function setName(name: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    name,
    errors: without(prevState.errors, "empty-name"),
  });
}

function setAlias(alias: string): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, alias });
}

function setBirthdate(birthdate: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    birthdate,
    errors: without(prevState.errors, "empty-birthdate", "invalid-birthdate"),
  });
}

function setGender(gender: AnimalGender): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    gender,
    errors: without(prevState.errors, "empty-gender"),
  });
}

function setICadNumber(iCadNumber: string): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, iCadNumber });
}

function clearBreed(): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    breed: null,
    errors: without(prevState.errors, "breed-species-missmatch"),
  });
}

function clearColor(): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, color: null });
}

function setDescription(description: string): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, description });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

export function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (state.species == null) {
    errorCodes.push("empty-species");
  }

  if (!string().trim().required().isValidSync(state.name)) {
    errorCodes.push("empty-name");
  }

  if (!string().trim().required().isValidSync(state.birthdate)) {
    errorCodes.push("empty-birthdate");
  } else if (!string().trim().dateISO().isValidSync(state.birthdate)) {
    errorCodes.push("invalid-birthdate");
  }

  if (state.gender == null) {
    errorCodes.push("empty-gender");
  }

  if (
    state.species != null &&
    state.breed != null &&
    state.breed.species !== state.species
  ) {
    errorCodes.push("breed-species-missmatch");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    birthdate: state.birthdate,
    breedId: state.breed?.id ?? null,
    colorId: state.color?.id ?? null,
    commonName: state.alias.trim() || null,
    description: state.description.trim() || null,
    gender: state.gender!,
    iCadNumber: state.iCadNumber.trim() || null,
    officialName: state.name.trim(),
    species: state.species!,
  };
}

export function AnimalProfileFormPlaceholder() {
  return (
    <Form>
      <Fields>
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

        <Placeholders count={3}>
          <Field>
            <Label>
              <Placeholder $preset="label" />
            </Label>

            <Placeholder $preset="input" />
          </Field>
        </Placeholders>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={Object.values(AnimalGender).length}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>

        <Separator />

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Placeholder $preset="input" />
        </Field>

        <Separator />

        <Placeholders count={3}>
          <Field>
            <Label>
              <Placeholder $preset="label" />
            </Label>

            <Placeholder $preset="input" />
          </Field>
        </Placeholders>
      </Fields>
    </Form>
  );
}
