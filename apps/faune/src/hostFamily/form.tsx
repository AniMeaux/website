import {
  HostFamily,
  OperationResult,
  PickOperationErrorResult,
} from "@animeaux/shared";
import invariant from "invariant";
import without from "lodash.without";
import { useState } from "react";
import { FaEnvelope, FaMapMarker, FaPhone, FaUser } from "react-icons/fa";
import { string } from "yup";
import { Info } from "~/core/dataDisplay/info";
import { Adornment } from "~/core/formElements/adornment";
import { Field, Fields } from "~/core/formElements/field";
import { Form } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { Label } from "~/core/formElements/label";
import { SubmitButton } from "~/core/formElements/submitButton";
import { BaseValidationError } from "~/core/formValidation";
import { includes } from "~/core/includes";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Separator } from "~/core/layouts/separator";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { SetStateAction } from "~/core/types";

type ErrorCode =
  | PickOperationErrorResult<
      OperationResult<"createHostFamily" | "updateHostFamily">
    >["code"]
  | "server-error"
  | "empty-name"
  | "empty-phone"
  | "empty-email"
  | "invalid-email"
  | "empty-zip-code"
  | "invalid-zip-code"
  | "empty-city"
  | "empty-address";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-name": "Le nom est obligatoire.",
  "empty-email": "L'email est obligatoire.",
  "invalid-email": "Le format de l'email est invalide.",
  "empty-address": "L'adresse est obligatoire.",
  "empty-city": "La ville est obligatoire.",
  "empty-phone": "Le numéro de téléphone est obligatoire.",
  "empty-zip-code": "Le code postal est obligatoire.",
  "invalid-zip-code": "Le format du code postal est invalide.",
  "name-already-used": "Le nom est déjà utilisé",
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  zipCode: string;
  city: string;
  address: string;
  errors: ErrorCode[];
};

type FormValue = Omit<FormState, "errors">;

type HostFamilyFormProps = {
  initialHostFamily?: HostFamily;
  pending: boolean;
  onSubmit: (value: FormValue) => void;
  serverErrors: ErrorCode[];
};

export function HostFamilyForm({
  initialHostFamily,
  onSubmit,
  pending,
  serverErrors,
}: HostFamilyFormProps) {
  const [state, setState] = useState(initializeState(initialHostFamily));

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
            htmlFor="host-family-name"
            hasError={includes(errors, "empty-name", "name-already-used")}
          >
            Nom
          </Label>

          <Input
            name="host-family-name"
            id="host-family-name"
            type="text"
            value={state.name}
            onChange={(name) => setState(setName(name))}
            hasError={includes(errors, "empty-name", "name-already-used")}
            leftAdornment={
              <Adornment>
                <FaUser />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="host-family-phone"
            hasError={includes(errors, "empty-phone")}
          >
            Téléphone
          </Label>

          <Input
            name="host-family-phone"
            id="host-family-phone"
            type="tel"
            placeholder="+33612345678"
            value={state.phone}
            onChange={(phone) => setState(setPhone(phone))}
            hasError={includes(errors, "empty-phone")}
            leftAdornment={
              <Adornment>
                <FaPhone />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="host-family-email"
            hasError={includes(errors, "empty-email", "invalid-email")}
          >
            Email
          </Label>

          <Input
            name="host-family-email"
            id="host-family-email"
            type="email"
            placeholder="jean@mail.fr"
            value={state.email}
            onChange={(email) => setState(setEmail(email))}
            hasError={includes(errors, "empty-email", "invalid-email")}
            leftAdornment={
              <Adornment>
                <FaEnvelope />
              </Adornment>
            }
          />
        </Field>

        <Separator />

        <Field>
          <Label
            htmlFor="host-family-zip-code"
            hasError={includes(errors, "empty-zip-code", "invalid-zip-code")}
          >
            Code postal
          </Label>

          <Input
            name="host-family-zip-code"
            id="host-family-zip-code"
            type="text"
            inputMode="numeric"
            value={state.zipCode}
            onChange={(zipCode) => setState(setZipCode(zipCode))}
            hasError={includes(errors, "empty-zip-code", "invalid-zip-code")}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="host-family-city"
            hasError={includes(errors, "empty-city")}
          >
            Ville
          </Label>

          <Input
            name="host-family-city"
            id="host-family-city"
            type="text"
            value={state.city}
            onChange={(city) => setState(setCity(city))}
            hasError={includes(errors, "empty-city")}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label
            htmlFor="host-family-address"
            hasError={includes(errors, "empty-address")}
          >
            Adresse
          </Label>

          <Input
            name="host-family-address"
            id="host-family-address"
            type="text"
            value={state.address}
            onChange={(address) => setState(setAddress(address))}
            hasError={includes(errors, "empty-address")}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {initialHostFamily == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

function initializeState(initialHostFamily?: HostFamily) {
  return (): FormState => ({
    name: initialHostFamily?.name ?? "",
    email: initialHostFamily?.email ?? "",
    phone: initialHostFamily?.phone ?? "",
    zipCode: initialHostFamily?.zipCode ?? "",
    city: initialHostFamily?.city ?? "",
    address: initialHostFamily?.address ?? "",
    errors: [],
  });
}

function setName(name: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    name,
    errors: without(prevState.errors, "empty-name", "name-already-used"),
  });
}

function setEmail(email: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    email,
    errors: without(prevState.errors, "empty-email", "invalid-email"),
  });
}

function setPhone(phone: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    phone,
    errors: without(prevState.errors, "empty-phone"),
  });
}

function setZipCode(zipCode: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    zipCode,
    errors: without(prevState.errors, "empty-zip-code", "invalid-zip-code"),
  });
}

function setCity(city: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    city,
    errors: without(prevState.errors, "empty-city"),
  });
}

function setAddress(address: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    address,
    errors: without(prevState.errors, "empty-address"),
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

  if (!string().trim().required().isValidSync(state.email)) {
    errorCodes.push("empty-email");
  } else if (!string().trim().email().isValidSync(state.email)) {
    errorCodes.push("invalid-email");
  }

  if (!string().trim().required().isValidSync(state.phone)) {
    errorCodes.push("empty-phone");
  }

  if (!string().trim().required().isValidSync(state.zipCode)) {
    errorCodes.push("empty-zip-code");
  } else if (
    !string()
      .trim()
      .matches(/^\d{5}$/)
      .isValidSync(state.zipCode)
  ) {
    errorCodes.push("invalid-zip-code");
  }

  if (!string().trim().required().isValidSync(state.city)) {
    errorCodes.push("empty-city");
  }

  if (!string().trim().required().isValidSync(state.address)) {
    errorCodes.push("empty-address");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    name: state.name,
    email: state.email,
    phone: state.phone,
    zipCode: state.zipCode,
    city: state.city,
    address: state.address,
  };
}

export function HostFamilyFormPlaceholder() {
  return (
    <Form>
      <Fields>
        <Placeholders count={3}>
          <Field>
            <Label>
              <Placeholder $preset="label" />
            </Label>

            <Placeholder $preset="input" />
          </Field>
        </Placeholders>

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
