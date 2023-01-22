import { User, UserGroup } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Adornment } from "~/core/formElements/adornment";
import { CheckboxInput } from "~/core/formElements/checkboxInput";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { PasswordInput } from "~/core/formElements/passwordInput";
import { RequiredStart } from "~/core/formElements/requiredStart";
import { Separator } from "~/core/layout/separator";
import { createActionData } from "~/core/schemas";
import { Icon } from "~/generated/icon";
import { GROUP_TRANSLATION, SORTED_GROUPS } from "~/users/groups";

export const ActionFormData = createActionData(
  z.object({
    displayName: z.string().trim().min(1, "Veuillez entrer un nom"),
    email: z.string().email("Veuillez entrer un email valide"),
    groups: zfd.repeatable(
      z
        .nativeEnum(UserGroup)
        .array()
        .min(1, "Veuillez choisir au moins 1 groupe")
    ),
    temporaryPassword: z.string(),
  })
);

export function UserForm({
  isCreate = false,
  defaultUser,
  fetcher,
}: {
  isCreate?: boolean;
  defaultUser?: null | SerializeFrom<
    Pick<User, "displayName" | "email" | "groups">
  >;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
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
    <fetcher.Form
      method="post"
      noValidate
      className={formClassNames.root({ hasHeader: true })}
    >
      <div className={formClassNames.fields.root()}>
        <FormErrors errors={fetcher.data?.errors?.formErrors} />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.displayName}
            className={formClassNames.fields.field.label()}
          >
            Nom <RequiredStart />
          </label>

          <Input
            ref={displayNameRef}
            id={ActionFormData.keys.displayName}
            type="text"
            name={ActionFormData.keys.displayName}
            defaultValue={defaultUser?.displayName}
            hasError={fetcher.data?.errors?.fieldErrors.displayName != null}
            aria-describedby="displayName-error"
            leftAdornment={
              <Adornment>
                <Icon id="user" />
              </Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.displayName != null ? (
            <p
              id="displayName-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.displayName}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.email}
            className={formClassNames.fields.field.label()}
          >
            Email <RequiredStart />
          </label>

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
              <Adornment>
                <Icon id="envelope" />
              </Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.email != null ? (
            <p
              id="email-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Groupes <RequiredStart />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
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
          </div>

          {fetcher.data?.errors?.fieldErrors.groups != null ? (
            <p
              id="groups-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.groups}
            </p>
          ) : null}
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.temporaryPassword}
            className={formClassNames.fields.field.label()}
          >
            Mot de passe temporaire {isCreate ? <RequiredStart /> : null}
          </label>

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
              <Adornment>
                <Icon id="lock" />
              </Adornment>
            }
          />

          {!isCreate ? (
            <p
              id="password-helper"
              className={formClassNames.fields.field.helperMessage()}
            >
              Laisser vide pour ne pas changer.
            </p>
          ) : null}

          {fetcher.data?.errors?.fieldErrors.temporaryPassword != null ? (
            <p
              id="password-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.temporaryPassword}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className={cn(actionClassName.standalone(), "w-full md:w-auto")}
      >
        {isCreate ? "Créer" : "Enregistrer"}
      </button>
    </fetcher.Form>
  );
}
