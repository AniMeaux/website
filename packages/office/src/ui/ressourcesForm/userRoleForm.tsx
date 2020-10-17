import {
  CreateUserRolePayload,
  DEFAULT_RESOURCE_PERMISSIONS,
  ResourceKeysOrder,
  ResourcePermissions,
  ResourcePermissionsLabels,
  UserRole,
} from "@animeaux/shared";
import * as React from "react";
import { FaShieldAlt } from "react-icons/fa";
import { Button } from "../button";
import { Adornment } from "../formElements/adornment";
import { Checkbox } from "../formElements/checkbox";
import { CheckboxField, Field } from "../formElements/field";
import { Form, FormProps } from "../formElements/form";
import { Input } from "../formElements/input";
import { Label } from "../formElements/label";
import { ProgressBar } from "../loaders/progressBar";

type UserRoleFormProps = FormProps & {
  userRole?: UserRole;
  onSubmit: (payload: CreateUserRolePayload) => void;
  errors?: {
    name?: string | null;
  };
};

export function UserRoleForm({
  userRole,
  onSubmit,
  errors,
  pending,
  ...rest
}: UserRoleFormProps) {
  const [name, setName] = React.useState("");
  const [resourcePermissions, setResourcePermissions] = React.useState<
    ResourcePermissions
  >(DEFAULT_RESOURCE_PERMISSIONS);

  return (
    <Form
      {...rest}
      pending={pending}
      onSubmit={() => onSubmit({ name, resourcePermissions })}
    >
      {pending && <ProgressBar />}

      <Field>
        <Label htmlFor="role-name">Nom</Label>
        <Input
          name="role-name"
          id="role-name"
          type="text"
          autoComplete="role-name"
          value={name}
          onChange={setName}
          autoFocus
          errorMessage={errors?.name}
          leftAdornment={
            <Adornment>
              <FaShieldAlt />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label>Peut modifier</Label>

        <ul>
          {ResourceKeysOrder.map((key) => (
            <li key={key}>
              <CheckboxField>
                <Checkbox
                  checked={resourcePermissions[key]}
                  onChange={(value) => {
                    setResourcePermissions({
                      ...resourcePermissions,
                      [key]: value,
                    });
                  }}
                  name="permission"
                />

                <span className="ml-2">{ResourcePermissionsLabels[key]}</span>
              </CheckboxField>
            </li>
          ))}
        </ul>
      </Field>

      <Field>
        <Button type="submit" variant="primary" color="blue" disabled={pending}>
          Créer
        </Button>
      </Field>
    </Form>
  );
}
