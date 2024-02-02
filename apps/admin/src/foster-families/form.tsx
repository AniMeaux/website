import { SORTED_SPECIES, SPECIES_TRANSLATION } from "#animals/species";
import { Action } from "#core/actions";
import { toIsoDateValue } from "#core/dates";
import {
  CheckboxInput,
  CheckboxInputList,
} from "#core/form-elements/checkbox-input";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { RadioInput, RadioInputList } from "#core/form-elements/radio-input";
import { RequiredStar } from "#core/form-elements/required-star";
import { Textarea } from "#core/form-elements/textarea";
import { Separator } from "#core/layout/separator";
import {
  AVAILABILITY_TRANSLATION,
  SORTED_AVAILABILITIES,
} from "#foster-families/availability";
import {
  GARDEN_TRANSLATION,
  HOUSING_TRANSLATION,
  SORTED_GARDEN,
  SORTED_HOUSING,
} from "#foster-families/housing";
import { Icon } from "#generated/icon";
import { FormDataDelegate } from "@animeaux/form-data";
import { zu } from "@animeaux/zod-utils";
import type { FosterFamily } from "@prisma/client";
import {
  FosterFamilyAvailability,
  FosterFamilyGarden,
  FosterFamilyHousing,
  Species,
} from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";

export const ActionFormData = FormDataDelegate.create(
  zu.object({
    address: zu.string().trim().min(1, "Veuillez entrer une adresse"),
    availability: zu.nativeEnum(FosterFamilyAvailability),
    availabilityExpirationDate: zu.text(
      zu.coerce
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional(),
    ),
    city: zu.string().trim().min(1, "Veuillez choisir une ville"),
    comments: zu.string().trim(),
    displayName: zu.string().trim().min(1, "Veuillez entrer un nom"),
    email: zu.string().email("Veuillez entrer un email valide"),
    garden: zu.nativeEnum(FosterFamilyGarden),
    housing: zu.nativeEnum(FosterFamilyHousing),
    phone: zu
      .string()
      .trim()
      .regex(/^\+?[\s\d]+$/, "Veuillez entrer un numéro de téléphone valide"),
    speciesAlreadyPresent: zu.repeatable(zu.nativeEnum(Species).array()),
    speciesToHost: zu.repeatable(zu.nativeEnum(Species).array()),
    zipCode: zu
      .string()
      .trim()
      .regex(/^\d{5}$/, "Veuillez entrer un code postal valide"),
  }),
);

type DefaultFosterFamily = null | SerializeFrom<
  Pick<
    FosterFamily,
    | "address"
    | "availability"
    | "availabilityExpirationDate"
    | "city"
    | "comments"
    | "displayName"
    | "email"
    | "garden"
    | "housing"
    | "phone"
    | "speciesAlreadyPresent"
    | "speciesToHost"
    | "zipCode"
  >
>;

export function FosterFamilyForm({
  defaultFosterFamily,
  fetcher,
}: {
  defaultFosterFamily?: DefaultFosterFamily;
  fetcher: FetcherWithComponents<{
    errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const isCreate = defaultFosterFamily == null;
  const addressRef = useRef<HTMLInputElement>(null);
  const availabilityDateRef = useRef<HTMLInputElement>(null);
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
      } else if (
        fetcher.data.errors.fieldErrors.availabilityExpirationDate != null
      ) {
        availabilityDateRef.current?.focus();
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

  const [availabilityState, setAvailabilityState] = useState(
    defaultFosterFamily?.availability ?? FosterFamilyAvailability.UNKNOWN,
  );

  const [availabilityExpirationDateState, setAvailabilityExpirationDateState] =
    useState(toIsoDateValue(defaultFosterFamily?.availabilityExpirationDate));

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
                  <Icon id="location-dot" />
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
                    <Icon id="location-dot" />
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
                    <Icon id="location-dot" />
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

          <HousingField defaultFosterFamily={defaultFosterFamily} />
          <GardenField defaultFosterFamily={defaultFosterFamily} />

          <Separator />

          <Form.Row>
            <Form.Field>
              <Form.Label asChild>
                <span>
                  Disponibilité <RequiredStar />
                </span>
              </Form.Label>

              <RadioInputList>
                {SORTED_AVAILABILITIES.map((availability) => (
                  <RadioInput
                    key={availability}
                    label={AVAILABILITY_TRANSLATION[availability]}
                    name={ActionFormData.keys.availability}
                    value={availability}
                    checked={availability === availabilityState}
                    onChange={() => setAvailabilityState(availability)}
                  />
                ))}
              </RadioInputList>
            </Form.Field>

            {availabilityState !== FosterFamilyAvailability.UNKNOWN ? (
              <Form.Field>
                <Form.Label
                  htmlFor={ActionFormData.keys.availabilityExpirationDate}
                >
                  Jusqu’au
                </Form.Label>

                <Input
                  ref={availabilityDateRef}
                  id={ActionFormData.keys.availabilityExpirationDate}
                  type="date"
                  min={toIsoDateValue(DateTime.now().toJSDate())}
                  name={ActionFormData.keys.availabilityExpirationDate}
                  value={availabilityExpirationDateState}
                  onChange={(event) =>
                    setAvailabilityExpirationDateState(event.target.value)
                  }
                  hasError={
                    fetcher.data?.errors?.fieldErrors
                      .availabilityExpirationDate != null
                  }
                  aria-describedby={
                    fetcher.data?.errors?.fieldErrors
                      .availabilityExpirationDate != null
                      ? "availabilityExpirationDate-error"
                      : "availabilityExpirationDate-helper"
                  }
                  leftAdornment={
                    <Input.Adornment>
                      <Icon id="calendar-days" />
                    </Input.Adornment>
                  }
                  rightAdornment={
                    availabilityExpirationDateState !== "" ? (
                      <Input.ActionAdornment
                        onClick={() => setAvailabilityExpirationDateState("")}
                      >
                        <Icon id="x-mark" />
                      </Input.ActionAdornment>
                    ) : null
                  }
                />

                {fetcher.data?.errors?.fieldErrors.availabilityExpirationDate !=
                null ? (
                  <Form.ErrorMessage id="availabilityExpirationDate-error">
                    {fetcher.data.errors.fieldErrors.availabilityExpirationDate}
                  </Form.ErrorMessage>
                ) : null}

                <Form.HelperMessage id="availabilityExpirationDate-helper">
                  Une fois la date passée, la famille d’accueil sera{" "}
                  <strong className="text-caption-emphasis">
                    {
                      AVAILABILITY_TRANSLATION[
                        availabilityState === FosterFamilyAvailability.AVAILABLE
                          ? FosterFamilyAvailability.UNAVAILABLE
                          : FosterFamilyAvailability.AVAILABLE
                      ]
                    }
                  </strong>
                  .
                </Form.HelperMessage>
              </Form.Field>
            ) : null}
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

function HousingField({
  defaultFosterFamily,
}: {
  defaultFosterFamily?: DefaultFosterFamily;
}) {
  return (
    <Form.Field>
      <Form.Label asChild>
        <span>
          Type de logement <RequiredStar />
        </span>
      </Form.Label>

      <RadioInputList>
        {SORTED_HOUSING.map((housing) => (
          <RadioInput
            key={housing}
            label={HOUSING_TRANSLATION[housing]}
            name={ActionFormData.keys.housing}
            value={housing}
            defaultChecked={
              housing ===
              (defaultFosterFamily?.housing ?? FosterFamilyHousing.UNKNOWN)
            }
          />
        ))}
      </RadioInputList>
    </Form.Field>
  );
}

function GardenField({
  defaultFosterFamily,
}: {
  defaultFosterFamily?: DefaultFosterFamily;
}) {
  return (
    <Form.Field>
      <Form.Label asChild>
        <span>
          Présence d’un jardin <RequiredStar />
        </span>
      </Form.Label>

      <RadioInputList>
        {SORTED_GARDEN.map((garden) => (
          <RadioInput
            key={garden}
            label={GARDEN_TRANSLATION[garden]}
            name={ActionFormData.keys.garden}
            value={garden}
            defaultChecked={
              garden ===
              (defaultFosterFamily?.garden ?? FosterFamilyGarden.UNKNOWN)
            }
          />
        ))}
      </RadioInputList>
    </Form.Field>
  );
}
