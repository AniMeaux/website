import { AnimalDraft, Breed, Color, Gender, Species } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents, useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  agreementFromBoolean,
  agreementToBoolean,
  AgreementValue,
  AGREEMENT_TRANSLATION,
  SORTED_AGREEMENTS,
} from "~/animals/agreements";
import { GENDER_TRANSLATION, SORTED_GENDERS } from "~/animals/gender";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { toIsoDateValue } from "~/core/dates";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { FormErrors } from "~/core/formElements/formErrors";
import { Input } from "~/core/formElements/input";
import { RadioInput } from "~/core/formElements/radioInput";
import { RequiredStar } from "~/core/formElements/requiredStar";
import { Textarea } from "~/core/formElements/textarea";
import { Separator } from "~/core/layout/separator";
import { createActionData, ensureDate } from "~/core/schemas";
import { Icon } from "~/generated/icon";
import { BreedInput } from "~/routes/resources/breed";
import { ColorInput } from "~/routes/resources/color";

export const ActionFormData = createActionData(
  z.object({
    alias: z.string().trim(),
    birthdate: z.preprocess(
      ensureDate,
      z.date({
        required_error: "Veuillez entrer une date",
        invalid_type_error: "Veuillez entrer une date valide",
      })
    ),
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
    <fetcher.Form
      method="post"
      noValidate
      className={formClassNames.root({ hasHeader: true })}
    >
      <div className={formClassNames.fields.root()}>
        <FormErrors errors={fetcher.data?.errors?.formErrors} />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Espèce <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
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
          </div>

          {fetcher.data?.errors?.fieldErrors.species != null ? (
            <p
              id="species-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.species}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.name}
              className={formClassNames.fields.field.label()}
            >
              Nom <RequiredStar />
            </label>

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
                  <Adornment>
                    <Icon id={SPECIES_ICON[speciesState]} />
                  </Adornment>
                ) : null
              }
            />

            {fetcher.data?.errors?.fieldErrors.name != null ? (
              <p
                id="name-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.alias}
              className={formClassNames.fields.field.label()}
            >
              Alias
            </label>

            <Input
              id={ActionFormData.keys.alias}
              type="text"
              name={ActionFormData.keys.alias}
              defaultValue={defaultAnimal?.alias ?? undefined}
              leftAdornment={
                <Adornment>
                  <Icon id="comment" />
                </Adornment>
              }
            />
          </div>
        </div>

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.birthdate}
            className={formClassNames.fields.field.label()}
          >
            Date de naissance <RequiredStar />
          </label>

          <Input
            ref={birthdateRef}
            id={ActionFormData.keys.birthdate}
            type="date"
            name={ActionFormData.keys.birthdate}
            defaultValue={toIsoDateValue(defaultAnimal?.birthdate)}
            hasError={fetcher.data?.errors?.fieldErrors.birthdate != null}
            aria-describedby="birthdate-error"
            leftAdornment={
              <Adornment>
                <Icon id="calendarDays" />
              </Adornment>
            }
          />

          {fetcher.data?.errors?.fieldErrors.birthdate != null ? (
            <p
              id="birthdate-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.birthdate}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Genre <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
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
          </div>

          {fetcher.data?.errors?.fieldErrors.gender != null ? (
            <p
              id="gender-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.gender}
            </p>
          ) : null}
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.iCadNumber}
            className={formClassNames.fields.field.label()}
          >
            Numéro I-CAD
          </label>

          <Input
            id={ActionFormData.keys.iCadNumber}
            type="text"
            name={ActionFormData.keys.iCadNumber}
            defaultValue={defaultAnimal?.iCadNumber ?? undefined}
            leftAdornment={
              <Adornment>
                <Icon id="fingerprint" />
              </Adornment>
            }
          />
        </div>

        <Separator />

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <span className={formClassNames.fields.field.label()}>Race</span>

            <BreedInput
              ref={breedRef}
              name={ActionFormData.keys.breedId}
              defaultValue={defaultAnimal?.breed}
              species={speciesState}
              hasError={fetcher.data?.errors?.fieldErrors.breedId != null}
              aria-describedby="breedId-error"
            />

            {fetcher.data?.errors?.fieldErrors.breedId != null ? (
              <p
                id="breedId-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.breedId}
              </p>
            ) : null}
          </div>

          <div className={formClassNames.fields.field.root()}>
            <span className={formClassNames.fields.field.label()}>Couleur</span>

            <ColorInput
              ref={colorRef}
              name={ActionFormData.keys.colorId}
              defaultValue={defaultAnimal?.color}
              hasError={fetcher.data?.errors?.fieldErrors.colorId != null}
              aria-describedby="colorId-error"
            />

            {fetcher.data?.errors?.fieldErrors.colorId != null ? (
              <p
                id="colorId-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.colorId}
              </p>
            ) : null}
          </div>
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Ok chats <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
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
          </div>

          {fetcher.data?.errors?.fieldErrors.isOkCats != null ? (
            <p
              id="isOkCats-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.isOkCats}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Ok chiens <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
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
          </div>

          {fetcher.data?.errors?.fieldErrors.isOkDogs != null ? (
            <p
              id="isOkDogs-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.isOkDogs}
            </p>
          ) : null}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Ok enfants <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_AGREEMENTS.map((agreement, index) => (
              <RadioInput
                ref={index === 0 ? isOkChildrenRef : null}
                key={agreement}
                label={AGREEMENT_TRANSLATION[agreement]}
                name={ActionFormData.keys.isOkChildren}
                value={agreement}
                defaultChecked={
                  agreementFromBoolean(defaultAnimal?.isOkChildren ?? null) ===
                  agreement
                }
                aria-describedby="isOkChildren-error"
              />
            ))}
          </div>

          {fetcher.data?.errors?.fieldErrors.isOkChildren != null ? (
            <p
              id="isOkChildren-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.isOkChildren}
            </p>
          ) : null}
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <label
            htmlFor={ActionFormData.keys.description}
            className={formClassNames.fields.field.label()}
          >
            Description publique
          </label>

          <Textarea
            ref={descriptionRef}
            id={ActionFormData.keys.description}
            name={ActionFormData.keys.description}
            defaultValue={defaultAnimal?.description}
            rows={5}
          />
        </div>
      </div>

      <button
        type="submit"
        className={cn(actionClassName.standalone(), "w-full md:w-auto")}
      >
        {isCreate ? "Suivant" : "Enregistrer"}
      </button>
    </fetcher.Form>
  );
}
