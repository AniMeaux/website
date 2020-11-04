import { getErrorMessage, User, UserFormPayload } from "@animeaux/shared";
import * as React from "react";
import { FaEnvelope, FaLock, FaShieldAlt, FaUser } from "react-icons/fa";
import { Button } from "../../ui/button";
import { Adornment } from "../../ui/formElements/adornment";
import { Field } from "../../ui/formElements/field";
import { Form, FormProps } from "../../ui/formElements/form";
import { Input } from "../../ui/formElements/input";
import { Label } from "../../ui/formElements/label";
import { PasswordInput } from "../../ui/formElements/passwordInput";
import { Select } from "../../ui/formElements/select";
import { Placeholder, Placeholders } from "../../ui/loaders/placeholder";
import { Spinner } from "../../ui/loaders/spinner";
import { useAllUserRoles } from "../userRole/userRoleQueries";

export type UserFormErrors = {
  displayName?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string | null;
};

type UserFormProps = Omit<FormProps, "onSubmit"> & {
  user?: User;
  onSubmit: (payload: UserFormPayload) => any;
  errors?: UserFormErrors;
};

export function UserForm({
  user,
  onSubmit,
  errors,
  pending,
  ...rest
}: UserFormProps) {
  const [displayName, setDisplayName] = React.useState(user?.displayName ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [password, setPassword] = React.useState("");
  const [roleId, setRoleId] = React.useState<string | null>(null);
  const [userRoles, userRolesRequest] = useAllUserRoles();

  React.useEffect(() => {
    if (user != null) {
      setDisplayName(user.displayName);
      setEmail(user.email);
      setRoleId(user.role.id);
    }
  }, [user]);

  return (
    <Form
      {...rest}
      pending={pending}
      onSubmit={() => onSubmit({ displayName, email, password, roleId })}
    >
      <Field>
        <Label htmlFor="name">Nom</Label>
        <Input
          name="name"
          id="name"
          type="text"
          autoComplete="name"
          value={displayName}
          onChange={setDisplayName}
          autoFocus
          placeholder="Jean"
          errorMessage={errors?.displayName}
          leftAdornment={
            <Adornment>
              <FaUser />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          id="email"
          type="text"
          autoComplete="email"
          // The email cannot be updated.
          disabled={user != null}
          value={email}
          onChange={setEmail}
          placeholder="jean@mail.fr"
          errorMessage={errors?.email}
          infoMessage={
            user == null
              ? "L'email ne pourra pas être changé plus tard"
              : "L'email ne peut pas être changé"
          }
          leftAdornment={
            <Adornment>
              <FaEnvelope />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label htmlFor="password">Mot de passe</Label>
        <PasswordInput
          name="password"
          id="password"
          autoComplete="password"
          value={password}
          onChange={setPassword}
          errorMessage={errors?.password}
          infoMessage={
            user == null
              ? "6 caractères minumum"
              : "6 caractères minumum ; laisser vide pour ne pas changer"
          }
          leftAdornment={
            <Adornment>
              <FaLock />
            </Adornment>
          }
        />
      </Field>

      <Field>
        <Label htmlFor="user-role">Rôle utilisateur</Label>
        <Select
          name="user-role"
          id="user-role"
          value={roleId}
          onChange={setRoleId}
          placeholder="Choisir un rôle"
          errorMessage={
            userRolesRequest.error == null
              ? errors?.role
              : getErrorMessage(userRolesRequest.error)
          }
          leftAdornment={
            <Adornment>
              <FaShieldAlt />
            </Adornment>
          }
          rightAdornment={
            userRolesRequest.isLoading ? (
              <Adornment>
                <Spinner />
              </Adornment>
            ) : null
          }
        >
          {userRoles != null &&
            userRoles.map((userRole) => (
              <option key={userRole.id} value={userRole.id}>
                {userRole.name}
              </option>
            ))}
        </Select>
      </Field>

      <Field>
        <Button type="submit" variant="primary" color="blue" disabled={pending}>
          {user == null ? "Créer" : "Modifier"}
        </Button>
      </Field>
    </Form>
  );
}

export function UserFormPlaceholder() {
  return (
    <Form>
      <Placeholders count={4}>
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
