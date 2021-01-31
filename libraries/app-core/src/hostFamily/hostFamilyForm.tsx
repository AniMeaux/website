import { HostFamily, HostFamilyFormPayload } from "@animeaux/shared-entities";
import {
  ActionSection,
  ActionSectionList,
  Adornment,
  Button,
  Field,
  Form,
  FormProps,
  Input,
  Label,
  Placeholder,
  Placeholders,
  RequiredStar,
  Section,
  Separator,
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
      <Section>
        <Field>
          <Label htmlFor="host-family-name">
            Nom <RequiredStar />
          </Label>
          <Input
            name="host-family-name"
            id="host-family-name"
            type="text"
            autoComplete="host-family-name"
            value={name}
            onChange={setName}
            errorMessage={errors?.name}
            leftAdornment={
              <Adornment>
                <FaUser />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-phone">
            Téléphone <RequiredStar />
          </Label>
          <Input
            name="host-family-phone"
            id="host-family-phone"
            type="tel"
            autoComplete="host-family-phone"
            placeholder="+33612345678"
            value={phone}
            onChange={setPhone}
            errorMessage={errors?.phone}
            leftAdornment={
              <Adornment>
                <FaPhone />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-email">
            Email <RequiredStar />
          </Label>
          <Input
            name="host-family-email"
            id="host-family-email"
            type="email"
            autoComplete="host-family-email"
            placeholder="jean@mail.fr"
            value={email}
            onChange={setEmail}
            errorMessage={errors?.email}
            leftAdornment={
              <Adornment>
                <FaEnvelope />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-zip-code">
            Code postal <RequiredStar />
          </Label>
          <Input
            name="host-family-zip-code"
            id="host-family-zip-code"
            type="number"
            autoComplete="host-family-zip-code"
            value={zipCode}
            onChange={setZipCode}
            errorMessage={errors?.zipCode}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-city">
            Ville <RequiredStar />
          </Label>
          <Input
            name="host-family-city"
            id="host-family-city"
            type="text"
            autoComplete="host-family-city"
            value={city}
            onChange={setCity}
            errorMessage={errors?.city}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="host-family-address">
            Adresse <RequiredStar />
          </Label>
          <Input
            name="host-family-address"
            id="host-family-address"
            type="text"
            autoComplete="host-family-address"
            value={address}
            onChange={setAddress}
            errorMessage={errors?.address}
            leftAdornment={
              <Adornment>
                <FaMapMarker />
              </Adornment>
            }
          />
        </Field>
      </Section>

      <Separator />

      <ActionSection>
        <ActionSectionList>
          <Button
            type="submit"
            variant="primary"
            color="blue"
            disabled={pending}
          >
            {hostFamily == null ? "Créer" : "Modifier"}
          </Button>
        </ActionSectionList>
      </ActionSection>
    </Form>
  );
}

export function HostFamilyFormPlaceholder() {
  return (
    <Form>
      <Section>
        <Placeholders count={6}>
          <Field>
            <Label>
              <Placeholder preset="label" />
            </Label>

            <Placeholder preset="input" />
          </Field>
        </Placeholders>
      </Section>
    </Form>
  );
}
