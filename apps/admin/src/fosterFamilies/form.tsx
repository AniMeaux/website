import { SORTED_SPECIES, SPECIES_TRANSLATION } from "#animals/species.tsx";
import { Action } from "#core/actions.tsx";
import {
  CheckboxInput,
  CheckboxInputList,
} from "#core/formElements/checkboxInput.tsx";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { Textarea } from "#core/formElements/textarea.tsx";
import { Separator } from "#core/layout/separator.tsx";
import { Icon } from "#generated/icon.tsx";
import { createFormData } from "@animeaux/form-data";
import type { FosterFamily } from "@prisma/client";
import { Species } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const ActionFormData = createFormData(
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
  }),
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
              defaultValue={defaultFosterFamily?.displayName}
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

          <Separator />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.phone}>
              Téléphone <RequiredStar />
            </Form.Label>

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
                <Input.Adornment>
                  <Icon id="phone" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.phone != null ? (
              <Form.ErrorMessage id="phone-error">
                {fetcher.data.errors.fieldErrors.phone}
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
              defaultValue={defaultFosterFamily?.email}
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
            <Form.Label htmlFor={ActionFormData.keys.address}>
              Adresse <RequiredStar />
            </Form.Label>

            <Input
              ref={addressRef}
              id={ActionFormData.keys.address}
              type="text"
              name={ActionFormData.keys.address}
              defaultValue={defaultFosterFamily?.address}
              hasError={fetcher.data?.errors?.fieldErrors.address != null}
              aria-describedby="address-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="locationDot" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.address != null ? (
              <Form.ErrorMessage id="address-error">
                {fetcher.data.errors.fieldErrors.address}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.zipCode}>
                Code postal <RequiredStar />
              </Form.Label>

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
                  <Input.Adornment>
                    <Icon id="locationDot" />
                  </Input.Adornment>
                }
              />

              {fetcher.data?.errors?.fieldErrors.zipCode != null ? (
                <Form.ErrorMessage id="zipCode-error">
                  {fetcher.data.errors.fieldErrors.zipCode}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.city}>
                Ville <RequiredStar />
              </Form.Label>

              <Input
                ref={cityRef}
                id={ActionFormData.keys.city}
                type="text"
                name={ActionFormData.keys.city}
                defaultValue={defaultFosterFamily?.city}
                hasError={fetcher.data?.errors?.fieldErrors.city != null}
                aria-describedby="city-error"
                leftAdornment={
                  <Input.Adornment>
                    <Icon id="locationDot" />
                  </Input.Adornment>
                }
              />

              {fetcher.data?.errors?.fieldErrors.city != null ? (
                <Form.ErrorMessage id="city-error">
                  {fetcher.data.errors.fieldErrors.city}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>
          </Form.Row>

          <Separator />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Espèces à accueillir{" "}
                {isCreate || defaultFosterFamily.speciesToHost.length !== 0 ? (
                  <RequiredStar />
                ) : null}
              </span>
            </Form.Label>

            <CheckboxInputList>
              {SORTED_SPECIES.map((species, index) => (
                <CheckboxInput
                  ref={index === 0 ? speciesToHostRef : null}
                  key={species}
                  label={SPECIES_TRANSLATION[species]}
                  name={ActionFormData.keys.speciesToHost}
                  value={species}
                  defaultChecked={defaultFosterFamily?.speciesToHost.includes(
                    species,
                  )}
                  aria-describedby="speciesToHost-error"
                />
              ))}
            </CheckboxInputList>

            {fetcher.data?.errors?.fieldErrors.speciesToHost != null ? (
              <Form.ErrorMessage id="speciesToHost-error">
                {fetcher.data.errors.fieldErrors.speciesToHost}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label asChild>
              <span>Espèces déjà présentes</span>
            </Form.Label>

            <CheckboxInputList>
              {SORTED_SPECIES.map((species) => (
                <CheckboxInput
                  key={species}
                  label={SPECIES_TRANSLATION[species]}
                  name={ActionFormData.keys.speciesAlreadyPresent}
                  value={species}
                  defaultChecked={defaultFosterFamily?.speciesAlreadyPresent.includes(
                    species,
                  )}
                />
              ))}
            </CheckboxInputList>
          </Form.Field>

          <Separator />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.comments}>
              Commentaires privés
            </Form.Label>

            <Textarea
              ref={commentsRef}
              id={ActionFormData.keys.comments}
              name={ActionFormData.keys.comments}
              defaultValue={defaultFosterFamily?.comments ?? undefined}
              rows={5}
            />
          </Form.Field>
        </Form.Fields>

        <Form.Action asChild>
          <Action>{isCreate ? "Créer" : "Enregistrer"}</Action>
        </Form.Action>
      </fetcher.Form>
    </Form>
  );
}
