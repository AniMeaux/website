import {
  ErrorCode,
  getErrorMessage,
  hasErrorCode,
  HostFamily,
  HostFamilyFormPayload,
} from "@animeaux/shared-entities";
import { Adornment } from "formElements/adornment";
import { Field } from "formElements/field";
import { FieldMessage } from "formElements/fieldMessage";
import { Form, FormProps } from "formElements/form";
import { Input } from "formElements/input";
import { Label } from "formElements/label";
import { SubmitButton } from "formElements/submitButton";
import { Placeholder, Placeholders } from "loaders/placeholder";
import * as React from "react";
import { FaEnvelope, FaMapMarker, FaPhone, FaUser } from "react-icons/fa";

export type HostFamilyFormErrors = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  zipCode?: string | null;
  city?: string | null;
  address?: string | null;
};

export function getHostFamilyFormErrors(
  error?: Error | null
): HostFamilyFormErrors {
  const errors: HostFamilyFormErrors = {};

  if (error != null) {
    const errorMessage = getErrorMessage(error);

    if (
      hasErrorCode(error, [
        ErrorCode.HOST_FAMILY_MISSING_NAME,
        ErrorCode.HOST_FAMILY_NAME_ALREADY_USED,
      ])
    ) {
      errors.name = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_PHONE)) {
      errors.phone = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_INVALID_EMAIL)) {
      errors.email = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_ADDRESS)) {
      errors.address = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_ZIP_CODE)) {
      errors.zipCode = errorMessage;
    } else if (hasErrorCode(error, ErrorCode.HOST_FAMILY_MISSING_CITY)) {
      errors.city = errorMessage;
    }
  }

  return errors;
}

type HostFamilyFormProps = Omit<FormProps, "onSubmit"> & {
  hostFamily?: HostFamily;
  onSubmit: (payload: HostFamilyFormPayload) => any;
  errors?: HostFamilyFormErrors;
};

export function HostFamilyForm({
  hostFamily,
  onSubmit,
  errors,
  pending,
  ...rest
}: HostFamilyFormProps) {
  const [name, setName] = React.useState(hostFamily?.name ?? "");
  const [phone, setPhone] = React.useState(hostFamily?.phone ?? "");
  const [email, setEmail] = React.useState(hostFamily?.email ?? "");
  const [address, setAddress] = React.useState(hostFamily?.address ?? "");
  const [zipCode, setZipCode] = React.useState(hostFamily?.zipCode ?? "");
  const [city, setCity] = React.useState(hostFamily?.city ?? "");

  React.useEffect(() => {
    if (hostFamily != null) {
      setName(hostFamily.name);
      setPhone(hostFamily.phone);
      setEmail(hostFamily.email);
      setAddress(hostFamily.address);
      setZipCode(hostFamily.zipCode);
      setCity(hostFamily.city);
    }
  }, [hostFamily]);

  function handleSubmit() {
    onSubmit({
      name,
      phone,
      email,
      zipCode,
      city,
      address,
    });
  }

  return (
    <Form {...rest} pending={pending} onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="host-family-name" hasError={errors?.name != null}>
          Nom
        </Label>

        <Input
          name="host-family-name"
          id="host-family-name"
          type="text"
          value={name}
          onChange={setName}
          hasError={errors?.name != null}
          leftAdornment={
            <Adornment>
              <FaUser />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.name} />
      </Field>

      <Field>
        <Label htmlFor="host-family-phone" hasError={errors?.phone != null}>
          Téléphone
        </Label>

        <Input
          name="host-family-phone"
          id="host-family-phone"
          type="tel"
          placeholder="+33612345678"
          value={phone}
          onChange={setPhone}
          hasError={errors?.phone != null}
          leftAdornment={
            <Adornment>
              <FaPhone />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.phone} />
      </Field>

      <Field>
        <Label htmlFor="host-family-email" hasError={errors?.email != null}>
          Email
        </Label>

        <Input
          name="host-family-email"
          id="host-family-email"
          type="email"
          placeholder="jean@mail.fr"
          value={email}
          onChange={setEmail}
          hasError={errors?.email != null}
          leftAdornment={
            <Adornment>
              <FaEnvelope />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.email} />
      </Field>

      <Field>
        <Label htmlFor="host-family-address" hasError={errors?.address != null}>
          Adresse
        </Label>

        <Input
          name="host-family-address"
          id="host-family-address"
          type="text"
          value={address}
          onChange={setAddress}
          hasError={errors?.address != null}
          leftAdornment={
            <Adornment>
              <FaMapMarker />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.address} />
      </Field>

      <Field>
        <Label
          htmlFor="host-family-zip-code"
          hasError={errors?.zipCode != null}
        >
          Code postal
        </Label>

        <Input
          name="host-family-zip-code"
          id="host-family-zip-code"
          type="number"
          value={zipCode}
          onChange={setZipCode}
          hasError={errors?.zipCode != null}
          leftAdornment={
            <Adornment>
              <FaMapMarker />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.zipCode} />
      </Field>

      <Field>
        <Label htmlFor="host-family-city" hasError={errors?.city != null}>
          Ville
        </Label>

        <Input
          name="host-family-city"
          id="host-family-city"
          type="text"
          value={city}
          onChange={setCity}
          hasError={errors?.city != null}
          leftAdornment={
            <Adornment>
              <FaMapMarker />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.city} />
      </Field>

      <SubmitButton loading={pending}>
        {hostFamily == null ? "Créer" : "Modifier"}
      </SubmitButton>
    </Form>
  );
}

export function HostFamilyFormPlaceholder() {
  return (
    <Form>
      <Placeholders count={6}>
        <Field>
          <Label>
            <Placeholder preset="label" />
          </Label>

          <Placeholder preset="input" />
        </Field>
      </Placeholders>
    </Form>
  );
}
