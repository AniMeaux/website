import { FosterFamily, Species } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents, useLocation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { SORTED_SPECIES, SPECIES_TRANSLATION } from "~/animals/species";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Adornment } from "~/core/formElements/adornment";
import { CheckboxInput } from "~/core/formElements/checkboxInput";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { RequiredStar } from "~/core/formElements/requiredStar";
import { Textarea } from "~/core/formElements/textarea";
import { Separator } from "~/core/layout/separator";
import { createActionData } from "~/core/schemas";
import { Icon } from "~/generated/icon";

export const ActionFormData = createActionData(
  z.object({
    address: z.string().trim().min(1, "Veuillez entrer une adresse"),
    city: z.string().trim().min(1, "Veuillez choisir une ville"),
    comments: z.string().trim(),
    displayName: z.string().trim().min(1, "Veuillez entrer un nom"),
    email: z.string().email("Veuillez entrer un email valide"),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[\s\d]+$/, "Veuillez entrer un numéro de téléphone valide"),
    speciesAlreadyPresent: zfd.repeatable(z.nativeEnum(Species).array()),
    speciesToHost: zfd.repeatable(z.nativeEnum(Species).array()),
    zipCode: z
      .string()
      .trim()
      .regex(/^\d{5}$/, "Veuillez entrer un code postal valide"),
  })
);

export function FosterFamilyForm({
  defaultFosterFamily,
  fetcher,
}: {
  defaultFosterFamily?: null | SerializeFrom<
    Pick<
      FosterFamily,
      | "address"
      | "city"
      | "comments"
      | "displayName"
      | "email"
      | "phone"
      | "speciesAlreadyPresent"
      | "speciesToHost"
      | "zipCode"
    >
  >;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultFosterFamily == null;
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const commentsRef = useRef<HTMLTextAreaElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const speciesToHostRef = useRef<HTMLInputElement>(null);
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
      } else if (fetcher.data.errors.fieldErrors.speciesToHost != null) {
        speciesToHostRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  const { hash } = useLocation();
  useEffect(() => {
    const key = hash.replace("#", "");
    if (key === ActionFormData.keys.comments) {
      commentsRef.current?.focus();
    }
  }, [hash]);

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
            Nom <RequiredStar />
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

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.phone}
            className={formClassNames.fields.field.label()}
          >
            Téléphone <RequiredStar />
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
            Email <RequiredStar />
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

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.address}
            className={formClassNames.fields.field.label()}
          >
            Adresse <RequiredStar />
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
              Code postal <RequiredStar />
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
              Ville <RequiredStar />
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

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Espèces à accueillir{" "}
            {isCreate || defaultFosterFamily.speciesToHost.length !== 0 ? (
              <RequiredStar />
            ) : null}
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_SPECIES.map((species, index) => (
              <CheckboxInput
                ref={index === 0 ? speciesToHostRef : null}
                key={species}
                label={SPECIES_TRANSLATION[species]}
                name={ActionFormData.keys.speciesToHost}
                value={species}
                defaultChecked={defaultFosterFamily?.speciesToHost.includes(
                  species
                )}
                aria-describedby="speciesToHost-error"
              />
            ))}
          </div>

          {fetcher.data?.errors?.fieldErrors.speciesToHost != null ? (
            <p
              id="speciesToHost-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.speciesToHost}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Espèces déjà présentes
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_SPECIES.map((species) => (
              <CheckboxInput
                key={species}
                label={SPECIES_TRANSLATION[species]}
                name={ActionFormData.keys.speciesAlreadyPresent}
                value={species}
                defaultChecked={defaultFosterFamily?.speciesAlreadyPresent.includes(
                  species
                )}
              />
            ))}
          </div>
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.comments}
            className={formClassNames.fields.field.label()}
          >
            Commentaires privées
          </label>

          <Textarea
            ref={commentsRef}
            id={ActionFormData.keys.comments}
            name={ActionFormData.keys.comments}
            defaultValue={defaultFosterFamily?.comments}
            rows={5}
          />
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
