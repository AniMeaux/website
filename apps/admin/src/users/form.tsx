import { Action } from "#core/actions.tsx";
import {
  CheckboxInput,
  CheckboxInputList,
} from "#core/formElements/checkboxInput.tsx";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { PasswordInput } from "#core/formElements/passwordInput.tsx";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { Separator } from "#core/layout/separator.tsx";
import { Icon } from "#generated/icon.tsx";
import { GROUP_TRANSLATION, SORTED_GROUPS } from "#users/groups.tsx";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef } from "react";

export const ActionFormData = FormDataDelegate.create(
  zu.object({
    displayName: zu.string().trim().min(1, "Veuillez entrer un nom"),
    email: zu.string().email("Veuillez entrer un email valide"),
    groups: zu.repeatable(
      zu
        .nativeEnum(UserGroup)
        .array()
        .min(1, "Veuillez choisir au moins 1 groupe"),
    ),
    temporaryPassword: zu.string(),
  }),
);

export function UserForm({
  defaultUser,
  fetcher,
}: {
  defaultUser?: null | SerializeFrom<
    Pick<User, "displayName" | "email" | "groups">
  >;
  fetcher: FetcherWithComponents<{
    errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultUser == null;
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const groupsRef = useRef<HTMLInputElement>(null);
  const temporaryPasswordRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.displayName != null) {
        displayNameRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.groups != null) {
        groupsRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.temporaryPassword != null) {
        temporaryPasswordRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  return (
    <Form asChild hasHeader>
      <fetcher.Form method="POST" noValidate>
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.displayName}>
              Nom <RequiredStar />
            </Form.Label>

            <Input
              ref={displayNameRef}
              id={ActionFormData.keys.displayName}
              type="text"
              name={ActionFormData.keys.displayName}
              defaultValue={defaultUser?.displayName}
              hasError={fetcher.data?.errors?.fieldErrors.displayName != null}
              aria-describedby="displayName-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="user" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.displayName != null ? (
              <Form.ErrorMessage id="displayName-error">
                {fetcher.data.errors.fieldErrors.displayName}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.email}>
              Email <RequiredStar />
            </Form.Label>

            <Input
              ref={emailRef}
              id={ActionFormData.keys.email}
              type="email"
              name={ActionFormData.keys.email}
              defaultValue={defaultUser?.email}
              placeholder="jean@mail.com"
              hasError={fetcher.data?.errors?.fieldErrors.email != null}
              aria-describedby="email-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="envelope" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.email != null ? (
              <Form.ErrorMessage id="email-error">
                {fetcher.data.errors.fieldErrors.email}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label asChild>
              <span>
                Groupes <RequiredStar />
              </span>
            </Form.Label>

            <CheckboxInputList>
              {SORTED_GROUPS.map((group, index) => (
                <CheckboxInput
                  ref={index === 0 ? groupsRef : null}
                  key={group}
                  label={GROUP_TRANSLATION[group]}
                  name={ActionFormData.keys.groups}
                  value={group}
                  defaultChecked={
                    defaultUser?.groups.includes(group) ||
                    (defaultUser == null && group === UserGroup.VOLUNTEER)
                  }
                  aria-describedby="groups-error"
                />
              ))}
            </CheckboxInputList>

            {fetcher.data?.errors?.fieldErrors.groups != null ? (
              <Form.ErrorMessage id="groups-error">
                {fetcher.data.errors.fieldErrors.groups}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Separator />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.temporaryPassword}>
              Mot de passe temporaire {isCreate ? <RequiredStar /> : null}
            </Form.Label>

            <PasswordInput
              ref={temporaryPasswordRef}
              id={ActionFormData.keys.temporaryPassword}
              name={ActionFormData.keys.temporaryPassword}
              hasError={
                fetcher.data?.errors?.fieldErrors.temporaryPassword != null
              }
              aria-describedby={
                fetcher.data?.errors?.fieldErrors.temporaryPassword != null
                  ? "password-error"
                  : "password-helper"
              }
              leftAdornment={
                <PasswordInput.Adornment>
                  <Icon id="lock" />
                </PasswordInput.Adornment>
              }
            />

            {!isCreate ? (
              <Form.HelperMessage id="password-helper">
                Laisser vide pour ne pas changer.
              </Form.HelperMessage>
            ) : null}

            {fetcher.data?.errors?.fieldErrors.temporaryPassword != null ? (
              <Form.ErrorMessage id="password-error">
                {fetcher.data.errors.fieldErrors.temporaryPassword}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>
        </Form.Fields>

        <Form.Action asChild>
          <Action>{isCreate ? "Créer" : "Enregistrer"}</Action>
        </Form.Action>
      </fetcher.Form>
    </Form>
  );
}
