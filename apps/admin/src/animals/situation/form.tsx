import {
  AdoptionOption,
  AnimalDraft,
  FosterFamily,
  PickUpReason,
  Status,
  User,
  UserGroup,
} from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { FetcherWithComponents, useLocation } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
} from "~/animals/adoption";
import {
  PICK_UP_REASON_TRANSLATION,
  SORTED_PICK_UP_REASON,
} from "~/animals/pickUp";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  STATUS_TRANSLATION,
} from "~/animals/status";
import { actionClassName } from "~/core/actions";
import { cn } from "~/core/classNames";
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
import { FosterFamilyInput } from "~/routes/resources/foster-family";
import { ManagerInput } from "~/routes/resources/manager";
import { PickUpLocationInput } from "~/routes/resources/pick-up-location";
import { hasGroups } from "~/users/groups";

export const ActionFormData = createActionData(
  z.object({
    adoptionDate: z.preprocess(
      ensureDate,
      z
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional()
    ),
    adoptionOption: z.nativeEnum(AdoptionOption).optional(),
    comments: z.string().trim(),
    fosterFamilyId: z.string().uuid().optional(),
    isSterilized: z.enum(["YES", "NO", "NOT_MANDATORY"], {
      required_error: "Veuillez choisir une option",
    }),
    managerId: z.string().uuid().optional(),
    nextVaccinationDate: z.preprocess(
      ensureDate,
      z
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional()
    ),
    pickUpDate: z.preprocess(
      ensureDate,
      z.date({
        required_error: "Veuillez entrer une date",
        invalid_type_error: "Veuillez entrer une date valide",
      })
    ),
    pickUpLocation: z.string().trim().optional(),
    pickUpReason: z.nativeEnum(PickUpReason, {
      required_error: "Veuillez choisir une raison",
    }),
    status: z.nativeEnum(Status, {
      required_error: "Veuillez choisir un statut",
    }),
  })
);

export function AnimalSituationForm({
  isCreate = false,
  defaultAnimal,
  currentUser,
  fetcher,
}: {
  isCreate?: boolean;
  defaultAnimal?: null | SerializeFrom<
    Pick<
      AnimalDraft,
      | "adoptionDate"
      | "adoptionOption"
      | "comments"
      | "isSterilizationMandatory"
      | "isSterilized"
      | "nextVaccinationDate"
      | "pickUpDate"
      | "pickUpLocation"
      | "pickUpReason"
      | "status"
    > & {
      fosterFamily?: null | Pick<FosterFamily, "id" | "displayName">;
      manager?: null | Pick<User, "id" | "displayName">;
    }
  >;
  currentUser?: null | Pick<User, "id" | "displayName" | "groups">;
  fetcher: FetcherWithComponents<{
    errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
  }>;
}) {
  const [statusState, setStatusState] = useState(
    defaultAnimal?.status ?? Status.UNAVAILABLE
  );

  const adoptionDateRef = useRef<HTMLInputElement>(null);
  const commentsRef = useRef<HTMLTextAreaElement>(null);
  const isSterilizedRef = useRef<HTMLInputElement>(null);
  const managerRef = useRef<HTMLButtonElement>(null);
  const nextVaccinationDateRef = useRef<HTMLInputElement>(null);
  const pickUpDateRef = useRef<HTMLInputElement>(null);
  const pickUpLocationRef = useRef<HTMLButtonElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (fetcher.data?.errors != null) {
      if (fetcher.data.errors.formErrors.length > 0) {
        window.scrollTo({ top: 0 });
      } else if (fetcher.data.errors.fieldErrors.managerId != null) {
        managerRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.adoptionDate != null) {
        adoptionDateRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.pickUpDate != null) {
        pickUpDateRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.pickUpLocation != null) {
        pickUpLocationRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.isSterilized != null) {
        isSterilizedRef.current?.focus();
      } else if (fetcher.data.errors.fieldErrors.nextVaccinationDate != null) {
        nextVaccinationDateRef.current?.focus();
      }
    }
  }, [fetcher.data?.errors]);

  const { hash } = useLocation();
  useEffect(() => {
    if (hash === `#${ActionFormData.keys.comments}`) {
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
          <span className={formClassNames.fields.field.label()}>
            Statut <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_STATUS.map((status) => (
              <RadioInput
                key={status}
                label={STATUS_TRANSLATION[status]}
                name={ActionFormData.keys.status}
                value={status}
                checked={statusState === status}
                onChange={() => setStatusState(status)}
              />
            ))}
          </div>
        </div>

        {statusState === Status.ADOPTED ? (
          <>
            <Separator />

            <div className={formClassNames.fields.field.root()}>
              <label
                htmlFor={ActionFormData.keys.adoptionDate}
                className={formClassNames.fields.field.label()}
              >
                Date d’adoption <RequiredStar />
              </label>

              <Input
                ref={adoptionDateRef}
                id={ActionFormData.keys.adoptionDate}
                type="date"
                name={ActionFormData.keys.adoptionDate}
                defaultValue={
                  defaultAnimal?.adoptionDate == null
                    ? null
                    : DateTime.fromISO(defaultAnimal.adoptionDate).toISODate()
                }
                hasError={
                  fetcher.data?.errors?.fieldErrors.adoptionDate != null
                }
                aria-describedby="adoptionDate-error"
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
              />

              {fetcher.data?.errors?.fieldErrors.adoptionDate != null ? (
                <p
                  id="adoptionDate-error"
                  className={formClassNames.fields.field.errorMessage()}
                >
                  {fetcher.data.errors.fieldErrors.adoptionDate}
                </p>
              ) : null}
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Option d’adoption <RequiredStar />
              </span>

              <div className="py-1 flex flex-wrap gap-2">
                {SORTED_ADOPTION_OPTION.map((adoptionOption) => (
                  <RadioInput
                    key={adoptionOption}
                    label={ADOPTION_OPTION_TRANSLATION[adoptionOption]}
                    name={ActionFormData.keys.adoptionOption}
                    value={adoptionOption}
                    defaultChecked={
                      adoptionOption ===
                      (defaultAnimal?.adoptionOption ?? AdoptionOption.UNKNOWN)
                    }
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}

        <Separator />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Responsable{" "}
            {isCreate || defaultAnimal?.manager != null ? (
              <RequiredStar />
            ) : null}
          </span>

          <ManagerInput
            ref={managerRef}
            name={ActionFormData.keys.managerId}
            defaultValue={
              defaultAnimal?.manager ??
              (isCreate &&
              currentUser != null &&
              hasGroups(currentUser, [UserGroup.ANIMAL_MANAGER])
                ? currentUser
                : null)
            }
            hasError={fetcher.data?.errors?.fieldErrors.managerId != null}
            aria-describedby="managerId-error"
          />

          {fetcher.data?.errors?.fieldErrors.managerId != null ? (
            <p
              id="managerId-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {fetcher.data.errors.fieldErrors.managerId}
            </p>
          ) : null}
        </div>

        <Separator />

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.pickUpDate}
              className={formClassNames.fields.field.label()}
            >
              Date de prise en charge <RequiredStar />
            </label>

            <Input
              ref={pickUpDateRef}
              id={ActionFormData.keys.pickUpDate}
              type="date"
              name={ActionFormData.keys.pickUpDate}
              defaultValue={
                defaultAnimal?.pickUpDate == null
                  ? null
                  : DateTime.fromISO(defaultAnimal.pickUpDate).toISODate()
              }
              hasError={fetcher.data?.errors?.fieldErrors.pickUpDate != null}
              aria-describedby="pickUpDate-error"
              leftAdornment={
                <Adornment>
                  <Icon id="calendarDays" />
                </Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.pickUpDate != null ? (
              <p
                id="pickUpDate-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.pickUpDate}
              </p>
            ) : null}
          </div>

          <div className={formClassNames.fields.field.root()}>
            <span className={formClassNames.fields.field.label()}>
              Lieux de prise en charge{" "}
              {isCreate || defaultAnimal?.pickUpLocation != null ? (
                <RequiredStar />
              ) : null}
            </span>

            <PickUpLocationInput
              ref={pickUpLocationRef}
              name={ActionFormData.keys.pickUpLocation}
              defaultValue={defaultAnimal?.pickUpLocation}
              hasError={
                fetcher.data?.errors?.fieldErrors.pickUpLocation != null
              }
              aria-describedby="pickUpLocation-error"
            />

            {fetcher.data?.errors?.fieldErrors.pickUpLocation != null ? (
              <p
                id="pickUpLocation-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.pickUpLocation}
              </p>
            ) : null}
          </div>
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Raison de la prise en charge <RequiredStar />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_PICK_UP_REASON.map((pickUpReason) => (
              <RadioInput
                key={pickUpReason}
                label={PICK_UP_REASON_TRANSLATION[pickUpReason]}
                name={ActionFormData.keys.pickUpReason}
                value={pickUpReason}
                defaultChecked={
                  pickUpReason ===
                  (defaultAnimal?.pickUpReason ?? PickUpReason.OTHER)
                }
              />
            ))}
          </div>
        </div>

        {ACTIVE_ANIMAL_STATUS.includes(statusState) ? (
          <>
            <Separator />

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Famille d’accueil
              </span>

              <FosterFamilyInput
                name={ActionFormData.keys.fosterFamilyId}
                defaultValue={defaultAnimal?.fosterFamily}
              />
            </div>
          </>
        ) : null}

        <Separator />

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <span className={formClassNames.fields.field.label()}>
              Stérilisé <RequiredStar />
            </span>

            <div className="py-1 flex flex-wrap gap-2">
              <RadioInput
                ref={isSterilizedRef}
                label="Oui"
                name={ActionFormData.keys.isSterilized}
                value={ActionFormData.schema.shape.isSterilized.Enum.YES}
                defaultChecked={defaultAnimal?.isSterilized}
                aria-describedby="isSterilized-error"
              />

              <RadioInput
                label="Non"
                name={ActionFormData.keys.isSterilized}
                value={ActionFormData.schema.shape.isSterilized.Enum.NO}
                defaultChecked={
                  !defaultAnimal?.isSterilized &&
                  defaultAnimal?.isSterilizationMandatory !== false
                }
                aria-describedby="isSterilized-error"
              />

              <RadioInput
                label="Non, et ne le sera pas"
                name={ActionFormData.keys.isSterilized}
                value={
                  ActionFormData.schema.shape.isSterilized.Enum.NOT_MANDATORY
                }
                defaultChecked={
                  defaultAnimal?.isSterilizationMandatory === false
                }
                aria-describedby="isSterilized-error"
              />
            </div>

            {fetcher.data?.errors?.fieldErrors.isSterilized != null ? (
              <p
                id="isSterilized-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.isSterilized}
              </p>
            ) : null}
          </div>

          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.nextVaccinationDate}
              className={formClassNames.fields.field.label()}
            >
              Prochaine vaccination{" "}
              {!isCreate && defaultAnimal?.nextVaccinationDate != null ? (
                <RequiredStar />
              ) : null}
            </label>

            <Input
              ref={nextVaccinationDateRef}
              id={ActionFormData.keys.nextVaccinationDate}
              type="date"
              min={DateTime.now().toISODate()}
              name={ActionFormData.keys.nextVaccinationDate}
              defaultValue={
                defaultAnimal?.nextVaccinationDate == null
                  ? null
                  : DateTime.fromISO(
                      defaultAnimal.nextVaccinationDate
                    ).toISODate()
              }
              hasError={
                fetcher.data?.errors?.fieldErrors.nextVaccinationDate != null
              }
              aria-describedby="nextVaccinationDate-error"
              leftAdornment={
                <Adornment>
                  <Icon id="calendarDays" />
                </Adornment>
              }
            />

            {fetcher.data?.errors?.fieldErrors.nextVaccinationDate != null ? (
              <p
                id="nextVaccinationDate-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {fetcher.data.errors.fieldErrors.nextVaccinationDate}
              </p>
            ) : null}
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
            defaultValue={defaultAnimal?.comments}
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
