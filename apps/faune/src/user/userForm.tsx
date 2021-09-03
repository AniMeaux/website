import {
  User,
  UserFormPayload,
  UserGroup,
  UserGroupLabels,
  USER_GROUPS_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import { Adornment } from "core/formElements/adornment";
import { Field } from "core/formElements/field";
import { FieldMessage } from "core/formElements/fieldMessage";
import { Form, FormProps } from "core/formElements/form";
import { Input } from "core/formElements/input";
import { Label } from "core/formElements/label";
import { PasswordInput } from "core/formElements/passwordInput";
import {
  Selector,
  SelectorCheckbox,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  Selectors,
} from "core/formElements/selector";
import { SubmitButton } from "core/formElements/submitButton";
import { Placeholder, Placeholders } from "core/loaders/placeholder";
import * as React from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { UserGroupIcon } from "user/userGroupIcon";

export type UserFormErrors = {
  displayName?: string | null;
  email?: string | null;
  password?: string | null;
  groups?: string | null;
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
  const isEdit = user != null;
  const [displayName, setDisplayName] = React.useState(user?.displayName ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [password, setPassword] = React.useState("");
  const [groups, setGroups] = React.useState<UserGroup[]>(user?.groups ?? []);

  React.useEffect(() => {
    if (user != null) {
      setDisplayName(user.displayName);
      setEmail(user.email);
      setGroups(user.groups);
    }
  }, [user]);

  return (
    <Form
      {...rest}
      pending={pending}
      onSubmit={() => onSubmit({ displayName, email, password, groups })}
    >
      <Field>
        <Label htmlFor="name" hasError={errors?.displayName != null}>
          Nom
        </Label>

        <Input
          name="name"
          id="name"
          type="text"
          value={displayName}
          onChange={setDisplayName}
          placeholder="Jean"
          hasError={errors?.displayName != null}
          leftAdornment={
            <Adornment>
              <FaUser />
            </Adornment>
          }
        />

        <FieldMessage errorMessage={errors?.displayName} />
      </Field>

      <Field>
        <Label htmlFor="email" hasError={errors?.email != null}>
          Email
        </Label>

        <Input
          name="email"
          id="email"
          type="email"
          // The email cannot be updated.
          disabled={isEdit}
          value={email}
          onChange={setEmail}
          placeholder="jean@mail.fr"
          hasError={errors?.email != null}
          leftAdornment={
            <Adornment>
              <FaEnvelope />
            </Adornment>
          }
        />

        <FieldMessage
          errorMessage={errors?.email}
          infoMessage={
            isEdit
              ? "L'email ne peut pas être changé"
              : "L'email ne pourra pas être changé plus tard"
          }
        />
      </Field>

      <Field>
        <Label htmlFor="password" hasError={errors?.password != null}>
          Mot de passe
        </Label>

        <PasswordInput
          name="password"
          id="password"
          value={password}
          onChange={setPassword}
          hasError={errors?.password != null}
          leftAdornment={
            <Adornment>
              <FaLock />
            </Adornment>
          }
        />

        <FieldMessage
          errorMessage={errors?.password}
          infoMessage={
            isEdit
              ? "6 caractères minumum ; laisser vide pour ne pas changer"
              : "6 caractères minumum"
          }
        />
      </Field>

      <Field>
        <Label hasError={errors?.groups != null}>Groupes</Label>

        <Selectors>
          {USER_GROUPS_ALPHABETICAL_ORDER.map((group) => (
            <SelectorItem key={group}>
              <Selector>
                <SelectorCheckbox
                  name="groups"
                  checked={groups.includes(group)}
                  onChange={(isChecked) => {
                    setGroups((groups) => {
                      if (isChecked) {
                        return groups.concat([group]);
                      }

                      return groups.filter((g) => g !== group);
                    });
                  }}
                />

                <SelectorIcon>
                  <UserGroupIcon userGroup={group} />
                </SelectorIcon>

                <SelectorLabel>{UserGroupLabels[group]}</SelectorLabel>
              </Selector>
            </SelectorItem>
          ))}
        </Selectors>

        <FieldMessage errorMessage={errors?.groups} />
      </Field>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Créer"}
      </SubmitButton>
    </Form>
  );
}

export function UserFormPlaceholder() {
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

      <Field>
        <Label>
          <Placeholder preset="label" />
        </Label>

        <Selectors>
          <Placeholders count={USER_GROUPS_ALPHABETICAL_ORDER.length}>
            <SelectorItem>
              <Placeholder preset="selector" />
            </SelectorItem>
          </Placeholders>
        </Selectors>
      </Field>
    </Form>
  );
}
