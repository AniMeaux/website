import { HostFamily, HostFamilyFormPayload } from "@animeaux/shared-entities";
import {
  Adornment,
  Field,
  FieldMessage,
  Form,
  FormProps,
  Input,
  Label,
  Placeholder,
  Placeholders,
  SubmitButton,
} from "@animeaux/ui-library";
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
  const [zipCode, setZipCode] = React.useState(hostFamily?.zipCode ?? "");
  const [city, setCity] = React.useState(hostFamily?.city ?? "");
  const [address, setAddress] = React.useState(hostFamily?.address ?? "");

  React.useEffect(() => {
    if (hostFamily != null) {
      setName(hostFamily.name);
      setPhone(hostFamily.phone);
      setEmail(hostFamily.email);
      setZipCode(hostFamily.zipCode);
      setCity(hostFamily.city);
      setAddress(hostFamily.address);
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
          autoComplete="host-family-name"
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
          autoComplete="host-family-phone"
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
          autoComplete="host-family-email"
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
          autoComplete="host-family-zip-code"
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
          autoComplete="host-family-city"
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

      <Field>
        <Label htmlFor="host-family-address" hasError={errors?.address != null}>
          Adresse
        </Label>

        <Input
          name="host-family-address"
          id="host-family-address"
          type="text"
          autoComplete="host-family-address"
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

      <SubmitButton disabled={pending}>
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
