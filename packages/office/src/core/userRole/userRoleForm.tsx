import {
  DEFAULT_RESOURCE_PERMISSIONS,
  ResourceKeysOrder,
  ResourceLabels,
  ResourcePermissions,
  UserRole,
  UserRoleFormPayload,
} from "@animeaux/shared";
import * as React from "react";
import { FaShieldAlt } from "react-icons/fa";
import { Button } from "../../ui/button";
import { Adornment } from "../../ui/formElements/adornment";
import { Checkbox } from "../../ui/formElements/checkbox";
import { CheckboxField, Field } from "../../ui/formElements/field";
import { Form, FormProps } from "../../ui/formElements/form";
import { Input } from "../../ui/formElements/input";
import { Label } from "../../ui/formElements/label";
import { Placeholder, Placeholders } from "../../ui/loaders/placeholder";
import { ProgressBar } from "../../ui/loaders/progressBar";

type UserRoleFormProps = Omit<FormProps, "onSubmit"> & {
  userRole?: UserRole;
  onSubmit: (payload: UserRoleFormPayload) => any;
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
  const [name, setName] = React.useState(userRole?.name ?? "");
  const [resourcePermissions, setResourcePermissions] = React.useState<
    ResourcePermissions
  >(userRole?.resourcePermissions ?? DEFAULT_RESOURCE_PERMISSIONS);

  React.useEffect(() => {
    setName(userRole?.name ?? "");
    setResourcePermissions(
      userRole?.resourcePermissions ?? DEFAULT_RESOURCE_PERMISSIONS
    );
  }, [userRole]);

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
        <Label>Ressources pouvant être modifiées</Label>

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

                <span className="ml-2">{ResourceLabels[key]}</span>
              </CheckboxField>
            </li>
          ))}
        </ul>
      </Field>

      <Field className="md:items-start">
        <Button type="submit" variant="primary" color="blue" disabled={pending}>
          {userRole == null ? "Créer" : "Modifier"}
        </Button>
      </Field>
    </Form>
  );
}

export function UserRoleFormPlaceholder() {
  return (
    <Form>
      <Field>
        <Label>
          <Placeholder preset="label" />
        </Label>

        <Placeholder preset="input" />
      </Field>

      <Field>
        <Label>
          <Placeholder preset="label" />
        </Label>

        <ul>
          <Placeholders count={ResourceKeysOrder.length}>
            <li>
              <Placeholder preset="checkbox-field" />
            </li>
          </Placeholders>
        </ul>
      </Field>
    </Form>
  );
}
