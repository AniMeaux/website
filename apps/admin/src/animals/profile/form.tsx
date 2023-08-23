import {
  AGREEMENT_TRANSLATION,
  AgreementValue,
  SORTED_AGREEMENTS,
  agreementFromBoolean,
  agreementToBoolean,
} from "#animals/agreements.tsx";
import { GENDER_TRANSLATION, SORTED_GENDERS } from "#animals/gender.tsx";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species.tsx";
import { createActionData } from "#core/actionData.tsx";
import { Action } from "#core/actions.tsx";
import { toIsoDateValue } from "#core/dates.ts";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { RadioInput, RadioInputList } from "#core/formElements/radioInput.tsx";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { Textarea } from "#core/formElements/textarea.tsx";
import { Separator } from "#core/layout/separator.tsx";
import { Icon } from "#generated/icon.tsx";
import { BreedInput } from "#routes/resources.breed.tsx";
import { ColorInput } from "#routes/resources.color.tsx";
import { AnimalDraft, Breed, Color, Gender, Species } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

export const ActionFormData = createActionData(
  z.object({
    alias: z.string().trim(),
    birthdate: z.coerce.date({
      required_error: "Veuillez entrer une date",
      invalid_type_error: "Veuillez entrer une date valide",
    }),
    breedId: z.string().uuid().optional(),
    colorId: z.string().uuid().optional(),
    description: z.string().trim(),
    gender: z.nativeEnum(Gender, {
      required_error: "Veuillez choisir un genre",
    }),
    iCadNumber: z.string().trim(),
    isOkCats: z
      .nativeEnum(AgreementValue, {
        required_error: "Veuillez choisir une option",
      })
      .transform(agreementToBoolean),
    isOkChildren: z
      .nativeEnum(AgreementValue, {
        required_error: "Veuillez choisir une option",
      })
      .transform(agreementToBoolean),
    isOkDogs: z
      .nativeEnum(AgreementValue, {
        required_error: "Veuillez choisir une option",
      })
      .transform(agreementToBoolean),
    name: z.string().trim().min(1, "Veuillez entrer un nom"),
    species: z.nativeEnum(Species, {
      required_error: "Veuillez choisir une espèce",
    }),
  })
);

export function AnimalProfileForm({
  isCreate = false,
  defaultAnimal,
  fetcher,
}: {
  isCreate?: boolean;
  defaultAnimal?: null | SerializeFrom<
    Pick<
      AnimalDraft,
      | "alias"
      | "birthdate"
      | "description"
      | "gender"
      | "iCadNumber"
      | "isOkCats"
      | "isOkChildren"
      | "isOkDogs"
      | "name"
      | "species"
    > & {
      breed?: null | Pick<Breed, "id" | "name">;
      color?: null | Pick<Color, "id" | "name">;
    }
  >;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const [speciesState, setSpeciesState] = useState(defaultAnimal?.species);

  const speciesRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const birthdateRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const breedRef = useRef<HTMLButtonElement>(null);
  const colorRef = useRef<HTMLButtonElement>(null);
  const isOkCatsRef = useRef<HTMLInputElement>(null);
  const isOkChildrenRef = useRef<HTMLInputElement>(null);
  const isOkDogsRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.species != null) {
        speciesRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.name != null) {
        nameRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.birthdate != null) {
        birthdateRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.gender != null) {
        genderRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.breedId != null) {
        breedRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.colorId != null) {
        colorRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.isOkCats != null) {
        isOkCatsRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.isOkDogs != null) {
        isOkDogsRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.isOkChildren != null) {
        isOkChildrenRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  const { hash } = useLocation();
  useEffect(() => {
    if (hash === `#${ActionFormData.keys.description}`) {
      descriptionRef.current?.focus();
    }
  }, [hash]);

  return (
    <Form asChild hasHeader>
      <fetcher.Form method="POST" noValidate>
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Espèce <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_SPECIES.map((species, index) => (
                <RadioInput
                  ref={index === 0 ? speciesRef : null}
                  key={species}
                  label={SPECIES_TRANSLATION[species]}
                  name={ActionFormData.keys.species}
                  value={species}
                  checked={speciesState === species}
                  onChange={() => setSpeciesState(species)}
                  aria-describedby="species-error"
                />
              ))}
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.species != null ? (
              <Form.ErrorMessage id="species-error">
                {fetcher.data.errors.fieldErrors.species}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.name}>
                Nom <RequiredStar />
              </Form.Label>

              <Input
                ref={nameRef}
                id={ActionFormData.keys.name}
                type="text"
                name={ActionFormData.keys.name}
                defaultValue={defaultAnimal?.name ?? undefined}
                hasError={fetcher.data?.errors?.fieldErrors.name != null}
                aria-describedby="name-error"
                leftAdornment={
                  speciesState != null ? (
                    <Input.Adornment>
                      <Icon id={SPECIES_ICON[speciesState]} />
                    </Input.Adornment>
                  ) : null
                }
              />

              {fetcher.data?.errors?.fieldErrors.name != null ? (
                <Form.ErrorMessage id="name-error">
                  {fetcher.data.errors.fieldErrors.name}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.alias}>Alias</Form.Label>

              <Input
                id={ActionFormData.keys.alias}
                type="text"
                name={ActionFormData.keys.alias}
                defaultValue={defaultAnimal?.alias ?? undefined}
                leftAdornment={
                  <Input.Adornment>
                    <Icon id="comment" />
                  </Input.Adornment>
                }
              />
            </Form.Field>
          </Form.Row>

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.birthdate}>
              Date de naissance <RequiredStar />
            </Form.Label>

            <Input
              ref={birthdateRef}
              id={ActionFormData.keys.birthdate}
              type="date"
              name={ActionFormData.keys.birthdate}
              defaultValue={toIsoDateValue(defaultAnimal?.birthdate)}
              hasError={fetcher.data?.errors?.fieldErrors.birthdate != null}
              aria-describedby="birthdate-error"
              leftAdornment={
                <Input.Adornment>
                  <Icon id="calendarDays" />
                </Input.Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.birthdate != null ? (
              <Form.ErrorMessage id="birthdate-error">
                {fetcher.data.errors.fieldErrors.birthdate}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label asChild>
              <span>
                Genre <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_GENDERS.map((gender, index) => (
                <RadioInput
                  ref={index === 0 ? genderRef : null}
                  key={gender}
                  label={GENDER_TRANSLATION[gender]}
                  name={ActionFormData.keys.gender}
                  value={gender}
                  defaultChecked={defaultAnimal?.gender === gender}
                  aria-describedby="gender-error"
                />
              ))}
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.gender != null ? (
              <Form.ErrorMessage id="gender-error">
                {fetcher.data.errors.fieldErrors.gender}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Separator />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.iCadNumber}>
              Numéro I-CAD
            </Form.Label>

            <Input
              id={ActionFormData.keys.iCadNumber}
              type="text"
              name={ActionFormData.keys.iCadNumber}
              defaultValue={defaultAnimal?.iCadNumber ?? undefined}
              leftAdornment={
                <Input.Adornment>
                  <Icon id="fingerprint" />
                </Input.Adornment>
              }
            />
          </Form.Field>

          <Separator />

          <Form.Row>
            <Form.Field>
              <Form.Label asChild>
                <span>Race</span>
              </Form.Label>

              <BreedInput
                ref={breedRef}
                name={ActionFormData.keys.breedId}
                defaultValue={defaultAnimal?.breed}
                species={speciesState}
                hasError={fetcher.data?.errors?.fieldErrors.breedId != null}
                aria-describedby="breedId-error"
              />

              {fetcher.data?.errors?.fieldErrors.breedId != null ? (
                <Form.ErrorMessage id="breedId-error">
                  {fetcher.data.errors.fieldErrors.breedId}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>

            <Form.Field>
              <Form.Label asChild>
                <span>Couleur</span>
              </Form.Label>

              <ColorInput
                ref={colorRef}
                name={ActionFormData.keys.colorId}
                defaultValue={defaultAnimal?.color}
                hasError={fetcher.data?.errors?.fieldErrors.colorId != null}
                aria-describedby="colorId-error"
              />

              {fetcher.data?.errors?.fieldErrors.colorId != null ? (
                <Form.ErrorMessage id="colorId-error">
                  {fetcher.data.errors.fieldErrors.colorId}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>
          </Form.Row>

          <Separator />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Ok chats <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_AGREEMENTS.map((agreement, index) => (
                <RadioInput
                  ref={index === 0 ? isOkCatsRef : null}
                  key={agreement}
                  label={AGREEMENT_TRANSLATION[agreement]}
                  name={ActionFormData.keys.isOkCats}
                  value={agreement}
                  defaultChecked={
                    agreementFromBoolean(defaultAnimal?.isOkCats ?? null) ===
                    agreement
                  }
                  aria-describedby="isOkCats-error"
                />
              ))}
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.isOkCats != null ? (
              <Form.ErrorMessage id="isOkCats-error">
                {fetcher.data.errors.fieldErrors.isOkCats}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label asChild>
              <span>
                Ok chiens <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_AGREEMENTS.map((agreement, index) => (
                <RadioInput
                  ref={index === 0 ? isOkDogsRef : null}
                  key={agreement}
                  label={AGREEMENT_TRANSLATION[agreement]}
                  name={ActionFormData.keys.isOkDogs}
                  value={agreement}
                  defaultChecked={
                    agreementFromBoolean(defaultAnimal?.isOkDogs ?? null) ===
                    agreement
                  }
                  aria-describedby="isOkDogs-error"
                />
              ))}
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.isOkDogs != null ? (
              <Form.ErrorMessage id="isOkDogs-error">
                {fetcher.data.errors.fieldErrors.isOkDogs}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Field>
            <Form.Label asChild>
              <span>
                Ok enfants <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              {SORTED_AGREEMENTS.map((agreement, index) => (
                <RadioInput
                  ref={index === 0 ? isOkChildrenRef : null}
                  key={agreement}
                  label={AGREEMENT_TRANSLATION[agreement]}
                  name={ActionFormData.keys.isOkChildren}
                  value={agreement}
                  defaultChecked={
                    agreementFromBoolean(
                      defaultAnimal?.isOkChildren ?? null
                    ) === agreement
                  }
                  aria-describedby="isOkChildren-error"
                />
              ))}
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.isOkChildren != null ? (
              <Form.ErrorMessage id="isOkChildren-error">
                {fetcher.data.errors.fieldErrors.isOkChildren}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Separator />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.description}>
              Description publique
            </Form.Label>

            <Textarea
              ref={descriptionRef}
              id={ActionFormData.keys.description}
              name={ActionFormData.keys.description}
              defaultValue={defaultAnimal?.description ?? undefined}
              rows={5}
            />
          </Form.Field>
        </Form.Fields>

        <Form.Action asChild>
          <Action>{isCreate ? "Suivant" : "Enregistrer"}</Action>
        </Form.Action>
      </fetcher.Form>
    </Form>
  );
}
