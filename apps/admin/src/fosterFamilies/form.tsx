import { FosterFamily } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { RequiredStart } from "~/core/formElements/requiredStart";
import { Separator } from "~/core/layout/separator";
import { createActionData } from "~/core/schemas";
import { Icon } from "~/generated/icon";

export const ActionFormData = createActionData(
  z.object({
    address: z.string().trim().min(1, "Veuillez entrer une adresse"),
    city: z.string().trim().min(1, "Veuillez choisir une ville"),
    displayName: z.string().trim().min(1, "Veuillez entrer un nom"),
    email: z.string().email("Veuillez entrer un email valide"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\s\d]+$/, "Veuillez entrer un numéro de téléphone valide"),
    zipCode: z
      .string()
      .trim()
      .regex(/^\d{5}$/, "Veuillez entrer un code postal valide"),
  })
);

export function FosterFamilyForm({
  isCreate = false,
  defaultFosterFamily,
  fetcher,
}: {
  isCreate?: boolean;
  defaultFosterFamily?: null | SerializeFrom<
    Pick<
      FosterFamily,
      "address" | "city" | "displayName" | "email" | "phone" | "zipCode"
    >
  >;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const zipCodeRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.displayName != null) {
        displayNameRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.phone != null) {
        phoneRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.email != null) {
        emailRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.address != null) {
        addressRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.zipCode != null) {
        zipCodeRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.city != null) {
        cityRef.current?.focus();
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
            defaultValue={defaultFosterFamily?.displayName}
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
            htmlFor={ActionFormData.keys.phone}
            className={formClassNames.fields.field.label()}
          >
            Téléphone <RequiredStart />
          </label>

          <Input
            ref={phoneRef}
            id={ActionFormData.keys.phone}
            type="tel"
            name={ActionFormData.keys.phone}
            defaultValue={defaultFosterFamily?.phone}
            placeholder="+33612345678"
            hasError={fetcher.data?.errors?.fieldErrors.phone != null}
            aria-describedby="phone-error"
            leftAdornment={
              <Adornment>
                <Icon id="phone" />
              </Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.phone != null ? (
            <p
              id="phone-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.phone}
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
            defaultValue={defaultFosterFamily?.email}
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

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.address}
            className={formClassNames.fields.field.label()}
          >
            Adresse <RequiredStart />
          </label>

          <Input
            ref={addressRef}
            id={ActionFormData.keys.address}
            type="text"
            name={ActionFormData.keys.address}
            defaultValue={defaultFosterFamily?.address}
            hasError={fetcher.data?.errors?.fieldErrors.address != null}
            aria-describedby="address-error"
            leftAdornment={
              <Adornment>
                <Icon id="locationDot" />
              </Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.address != null ? (
            <p
              id="address-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.address}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.zipCode}
              className={formClassNames.fields.field.label()}
            >
              Code postal <RequiredStart />
            </label>

            <Input
              ref={zipCodeRef}
              id={ActionFormData.keys.zipCode}
              type="text"
              inputMode="numeric"
              pattern="\d{5}"
              name={ActionFormData.keys.zipCode}
              defaultValue={defaultFosterFamily?.zipCode}
              hasError={fetcher.data?.errors?.fieldErrors.zipCode != null}
              aria-describedby="zipCode-error"
              leftAdornment={
                <Adornment>
                  <Icon id="locationDot" />
                </Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.zipCode != null ? (
              <p
                id="zipCode-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.zipCode}
              </p>
            ) : null}
          </div>

          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.city}
              className={formClassNames.fields.field.label()}
            >
              Ville <RequiredStart />
            </label>

            <Input
              ref={cityRef}
              id={ActionFormData.keys.city}
              type="text"
              name={ActionFormData.keys.city}
              defaultValue={defaultFosterFamily?.city}
              hasError={fetcher.data?.errors?.fieldErrors.city != null}
              aria-describedby="city-error"
              leftAdornment={
                <Adornment>
                  <Icon id="locationDot" />
                </Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.city != null ? (
              <p
                id="city-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.city}
              </p>
            ) : null}
          </div>
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
