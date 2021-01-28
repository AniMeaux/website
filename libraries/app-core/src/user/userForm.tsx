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
  Field,
  Form,
  FormProps,
  Input,
  Label,
  Message,
  PasswordInput,
  Placeholder,
  Placeholders,
  RequiredStar,
  Section,
  SectionTitle,
  Selector,
  SelectorCheckbox,
  SelectorIcon,
  SelectorItem,
  SelectorLabel,
  Selectors,
  Separator,
  Submit,
} from "@animeaux/ui-library";
import * as React from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { UserGroupIcon } from "./userGroupIcon";

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
      <Section>
        <SectionTitle>Profile</SectionTitle>

        <Field>
          <Label htmlFor="name">
            Nom <RequiredStar />
          </Label>
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

        <Field>
          <Label htmlFor="email">
            Email <RequiredStar />
          </Label>
          <Input
            name="email"
            id="email"
            type="email"
            autoComplete="new-email"
            // The email cannot be updated.
            disabled={isEdit}
            value={email}
            onChange={setEmail}
            placeholder="jean@mail.fr"
            errorMessage={errors?.email}
            infoMessage={
              isEdit
                ? "L'email ne peut pas être changé"
                : "L'email ne pourra pas être changé plus tard"
            }
            leftAdornment={
              <Adornment>
                <FaEnvelope />
              </Adornment>
            }
          />
        </Field>

        <Field>
          <Label htmlFor="password">
            Mot de passe {!isEdit && <RequiredStar />}
          </Label>
          <PasswordInput
            name="password"
            id="password"
            autoComplete="password"
            value={password}
            onChange={setPassword}
            errorMessage={errors?.password}
            infoMessage={
              isEdit
                ? "6 caractères minumum ; laisser vide pour ne pas changer"
                : "6 caractères minumum"
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
        <SectionTitle>
          Groupes <RequiredStar />
        </SectionTitle>

        {errors?.groups != null && (
          <Message type="error" className="mx-2 my-4">
            {errors.groups}
          </Message>
        )}

        <Selectors>
          {USER_GROUPS_ALPHABETICAL_ORDER.map((group) => (
            <SelectorItem
              key={group}
              itemsCount={USER_GROUPS_ALPHABETICAL_ORDER.length}
            >
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
      </Section>

      <Separator />

      <Section>
        <Submit>
          <Button
            type="submit"
            variant="primary"
            color="blue"
            disabled={pending}
          >
            {isEdit ? "Modifier" : "Créer"}
          </Button>
        </Submit>
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
          <Field>
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

        <Selectors>
          <Placeholders count={USER_GROUPS_ALPHABETICAL_ORDER.length}>
            <SelectorItem itemsCount={USER_GROUPS_ALPHABETICAL_ORDER.length}>
              <Placeholder preset="selector" />
            </SelectorItem>
          </Placeholders>
        </Selectors>
      </Section>
    </Form>
  );
}
