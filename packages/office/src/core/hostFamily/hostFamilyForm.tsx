import { HostFamily, HostFamilyFormPayload } from "@animeaux/shared-entities";
import * as React from "react";
import { FaMapMarker, FaPhone } from "react-icons/fa";
import { Button } from "../../ui/button";
import { Adornment } from "../../ui/formElements/adornment";
import { Field } from "../../ui/formElements/field";
import { Form, FormProps } from "../../ui/formElements/form";
import { Input } from "../../ui/formElements/input";
import { Label } from "../../ui/formElements/label";
import { Placeholder, Placeholders } from "../../ui/loaders/placeholder";
import { ResourceIcon } from "../resource";

export type HostFamilyFormErrors = {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
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
  const [address, setAddress] = React.useState(hostFamily?.address ?? "");
  const [phone, setPhone] = React.useState(hostFamily?.phone ?? "");

  React.useEffect(() => {
    if (hostFamily != null) {
      setName(hostFamily.name);
      setAddress(hostFamily.address);
      setPhone(hostFamily.phone);
    }
  }, [hostFamily]);

  return (
    <Form
      {...rest}
      pending={pending}
      onSubmit={() => onSubmit({ name, address, phone })}
    >
      <Field>
        <Label htmlFor="host-family-name">Nom</Label>
        <Input
          name="host-family-name"
          id="host-family-name"
          type="text"
          autoComplete="host-family-name"
          value={name}
          onChange={setName}
          autoFocus
          errorMessage={errors?.name}
          leftAdornment={
            <Adornment>
              <ResourceIcon resourceKey="host_family" />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label htmlFor="host-family-address">Adresse</Label>
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

      <Field>
        <Label htmlFor="host-family-phone">Téléphone</Label>
        <Input
          name="host-family-phone"
          id="host-family-phone"
          type="tel"
          autoComplete="host-family-phone"
          placeholder="0612345678"
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
        <Button type="submit" variant="primary" color="blue" disabled={pending}>
          {hostFamily == null ? "Créer" : "Modifier"}
        </Button>
      </Field>
    </Form>
  );
}

export function HostFamilyFormPlaceholder() {
  return (
    <Form>
      <Placeholders count={3}>
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
