import { Animal, Breed, Gender, Species } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Form, useLocation } from "@remix-run/react";
import { DateTime } from "luxon";
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
import { SORTED_SPECIES, SPECIES_TRANSLATION } from "~/animals/species";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
import { Helper } from "~/core/dataDisplay/helper";
import { Adornment } from "~/core/formElements/adornment";
import { formClassNames } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { RadioInput } from "~/core/formElements/radioInput";
import { RequiredStart } from "~/core/formElements/requiredStart";
import { Textarea } from "~/core/formElements/textarea";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Separator } from "~/core/layout/separator";
import { createActionData, ensureBoolean, ensureDate } from "~/core/schemas";
import { Icon } from "~/generated/icon";
import { BreedInput } from "~/routes/resources/breeds";

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
    description: z.string().trim(),
    gender: z.nativeEnum(Gender, {
      required_error: "Veuillez choisir un genre",
    }),
    iCadNumber: z.string().trim(),
    id: z.string().uuid(),
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
    isSterilized: z.preprocess(
      ensureBoolean,
      z.boolean({ required_error: "Veuillez choisir une option" })
    ),
    name: z.string().trim().min(1, "Veuillez entrer un nom"),
    species: z.nativeEnum(Species, {
      required_error: "Veuillez choisir une espèce",
    }),
  })
);

export function AnimalProfileForm({
  animal,
  errors = { formErrors: [], fieldErrors: {} },
}: {
  animal: SerializeFrom<
    Pick<
      Animal,
      | "alias"
      | "birthdate"
      | "description"
      | "gender"
      | "iCadNumber"
      | "id"
      | "isOkCats"
      | "isOkChildren"
      | "isOkDogs"
      | "isSterilized"
      | "name"
      | "species"
    > & {
      breed: null | Pick<Breed, "id" | "name">;
    }
  >;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
}) {
  const [speciesState, setSpeciesState] = useState(animal.species);

  const speciesRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const birthdateRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const breedRef = useRef<HTMLButtonElement>(null);
  const isOkCatsRef = useRef<HTMLInputElement>(null);
  const isOkChildrenRef = useRef<HTMLInputElement>(null);
  const isOkDogsRef = useRef<HTMLInputElement>(null);
  const isSterilizedRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (errors.fieldErrors.species != null) {
      speciesRef.current?.focus();
    } else if (errors.fieldErrors.name != null) {
      nameRef.current?.focus();
    } else if (errors.fieldErrors.birthdate != null) {
      birthdateRef.current?.focus();
    } else if (errors.fieldErrors.gender != null) {
      genderRef.current?.focus();
    } else if (errors.fieldErrors.breedId != null) {
      breedRef.current?.focus();
    } else if (errors.fieldErrors.isOkCats != null) {
      isOkCatsRef.current?.focus();
    } else if (errors.fieldErrors.isOkDogs != null) {
      isOkDogsRef.current?.focus();
    } else if (errors.fieldErrors.isOkChildren != null) {
      isOkChildrenRef.current?.focus();
    } else if (errors.fieldErrors.isSterilized != null) {
      isSterilizedRef.current?.focus();
    }
  }, [errors.fieldErrors]);

  const { hash } = useLocation();
  useEffect(() => {
    if (hash === `#${ActionFormData.keys.description}`) {
      descriptionRef.current?.focus();
    }
  }, [hash]);

  return (
    <Form
      method="post"
      noValidate
      className={formClassNames.root({ hasHeader: true })}
    >
      <input type="hidden" name={ActionFormData.keys.id} value={animal.id} />

      <div className={formClassNames.fields.root()}>
        {errors.formErrors.length > 0 && (
          <Helper variant="error">
            {joinReactNodes(errors.formErrors, <br />)}
          </Helper>
        )}

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Espèce <RequiredStart />
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

          {errors.fieldErrors.species != null && (
            <p
              id="species-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.species}
            </p>
          )}
        </div>

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.name}
              className={formClassNames.fields.field.label()}
            >
              Nom <RequiredStart />
            </label>

            <Input
              ref={nameRef}
              id={ActionFormData.keys.name}
              type="text"
              name={ActionFormData.keys.name}
              defaultValue={animal.name}
              hasError={errors.fieldErrors.name != null}
              aria-describedby="name-error"
              leftAdornment={
                <Adornment>
                  <Icon id="cat" />
                </Adornment>
              }
            />

            {errors.fieldErrors.name != null && (
              <p
                id="name-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {errors.fieldErrors.name}
              </p>
            )}
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
              defaultValue={animal.alias ?? ""}
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
            Date de naissance <RequiredStart />
          </label>

          <Input
            ref={birthdateRef}
            id={ActionFormData.keys.birthdate}
            type="date"
            name={ActionFormData.keys.birthdate}
            defaultValue={DateTime.fromISO(animal.birthdate).toISODate()}
            hasError={errors.fieldErrors.birthdate != null}
            aria-describedby="birthdate-error"
            leftAdornment={
              <Adornment>
                <Icon id="calendarDays" />
              </Adornment>
            }
          />

          {errors.fieldErrors.birthdate != null && (
            <p
              id="birthdate-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.birthdate}
            </p>
          )}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Genre <RequiredStart />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_GENDERS.map((gender, index) => (
              <RadioInput
                ref={index === 0 ? genderRef : null}
                key={gender}
                label={GENDER_TRANSLATION[gender]}
                name={ActionFormData.keys.gender}
                value={gender}
                defaultChecked={animal.gender === gender}
                aria-describedby="gender-error"
              />
            ))}
          </div>

          {errors.fieldErrors.gender != null && (
            <p
              id="gender-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.gender}
            </p>
          )}
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
            defaultValue={animal.iCadNumber ?? ""}
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
              defaultValue={animal.breed}
              species={speciesState}
              hasError={errors.fieldErrors.breedId != null}
              aria-describedby="breedId-error"
            />

            {errors.fieldErrors.breedId != null && (
              <p
                id="breedId-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {errors.fieldErrors.breedId}
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Ok chats <RequiredStart />
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
                  agreementFromBoolean(animal.isOkCats) === agreement
                }
                aria-describedby="isOkCats-error"
              />
            ))}
          </div>

          {errors.fieldErrors.isOkCats != null && (
            <p
              id="isOkCats-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.isOkCats}
            </p>
          )}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Ok chiens <RequiredStart />
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
                  agreementFromBoolean(animal.isOkDogs) === agreement
                }
                aria-describedby="isOkDogs-error"
              />
            ))}
          </div>

          {errors.fieldErrors.isOkDogs != null && (
            <p
              id="isOkDogs-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.isOkDogs}
            </p>
          )}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Ok enfants <RequiredStart />
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
                  agreementFromBoolean(animal.isOkChildren) === agreement
                }
                aria-describedby="isOkChildren-error"
              />
            ))}
          </div>

          {errors.fieldErrors.isOkChildren != null && (
            <p
              id="isOkChildren-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.isOkChildren}
            </p>
          )}
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Stérilisé <RequiredStart />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            <RadioInput
              ref={isSterilizedRef}
              label="Oui"
              name={ActionFormData.keys.isSterilized}
              value={String(true)}
              defaultChecked={animal.isSterilized}
              aria-describedby="isSterilized-error"
            />

            <RadioInput
              label="Non"
              name={ActionFormData.keys.isSterilized}
              value={String(false)}
              defaultChecked={!animal.isSterilized}
              aria-describedby="isSterilized-error"
            />
          </div>

          {errors.fieldErrors.isSterilized != null && (
            <p
              id="isSterilized-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.isSterilized}
            </p>
          )}
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
            defaultValue={animal.description ?? ""}
            rows={5}
          />
        </div>
      </div>

      <button
        type="submit"
        className={cn(actionClassName.standalone(), "w-full md:w-auto")}
      >
        Enregistrer
      </button>
    </Form>
  );
}
