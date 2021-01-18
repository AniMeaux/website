import {
  User,
  UserFormPayload,
  UserGroup,
  UserGroupLabels,
  USER_GROUPS_ALPHABETICAL_ORDER,
} from "@animeaux/shared-entities";
import {
  Adornment,
  Button,
  Checkbox,
  CheckboxField,
  Field,
  Form,
  FormProps,
  Input,
  Label,
  Message,
  PasswordInput,
  Placeholder,
  Placeholders,
  Section,
  SectionTitle,
  Separator,
  UserGroupIcon,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

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
      <Section>
        <SectionTitle>Profile</SectionTitle>

        <Field className="px-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            name="name"
            id="name"
            type="text"
            autoComplete="name"
            value={displayName}
            onChange={setDisplayName}
            placeholder="Jean"
            errorMessage={errors?.displayName}
            leftAdornment={
              <Adornment>
                <FaUser />
              </Adornment>
            }
          />
        </Field>

        <Field className="px-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            type="email"
            autoComplete="new-email"
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

        <Field className="px-2">
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
      </Section>

      <Separator />

      <Section>
        <SectionTitle>Groupes</SectionTitle>

        {errors?.groups != null && (
          <Message type="error">{errors?.groups}</Message>
        )}

        <Field className="px-2">
          <ul>
            {USER_GROUPS_ALPHABETICAL_ORDER.map((group) => (
              <li key={group}>
                <CheckboxField>
                  <Checkbox
                    checked={groups.includes(group)}
                    onChange={(isChecked) => {
                      setGroups((groups) => {
                        if (isChecked) {
                          return groups.concat([group]);
                        }

                        return groups.filter((g) => g !== group);
                      });
                    }}
                    name="groups"
                  />

                  <Adornment className="ml-2">
                    <UserGroupIcon userGroup={group} />
                  </Adornment>

                  <span>{UserGroupLabels[group]}</span>
                </CheckboxField>
              </li>
            ))}
          </ul>
        </Field>
      </Section>

      <Separator />

      <Section>
        <Field className="px-2">
          <Button
            type="submit"
            variant="primary"
            color="blue"
            disabled={pending}
          >
            {user == null ? "Créer" : "Modifier"}
          </Button>
        </Field>
      </Section>
    </Form>
  );
}

export function UserFormPlaceholder() {
  return (
    <Form>
      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Placeholders count={3}>
          <Field className="px-2">
            <Label>
              <Placeholder preset="label" />
            </Label>

            <Placeholder preset="input" />
          </Field>
        </Placeholders>
      </Section>

      <Separator />

      <Section>
        <SectionTitle>
          <Placeholder preset="text" />
        </SectionTitle>

        <Field className="px-2">
          <ul>
            <Placeholders count={USER_GROUPS_ALPHABETICAL_ORDER.length}>
              <li>
                <Placeholder preset="checkbox-field" />
              </li>
            </Placeholders>
          </ul>
        </Field>
      </Section>
    </Form>
  );
}
