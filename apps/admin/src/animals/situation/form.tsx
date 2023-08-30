import {
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
} from "#animals/adoption.tsx";
import {
  PICK_UP_REASON_TRANSLATION,
  SORTED_PICK_UP_REASON,
} from "#animals/pickUp.ts";
import {
  SCREENING_RESULT_TRANSLATION,
  SORTED_SCREENING_RESULTS,
} from "#animals/screening.ts";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  STATUS_TRANSLATION,
} from "#animals/status.tsx";
import { Action } from "#core/actions.tsx";
import { toIsoDateValue } from "#core/dates.ts";
import { Form } from "#core/formElements/form.tsx";
import { Input } from "#core/formElements/input.tsx";
import { RadioInput, RadioInputList } from "#core/formElements/radioInput.tsx";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { Textarea } from "#core/formElements/textarea.tsx";
import { Separator } from "#core/layout/separator.tsx";
import { Icon } from "#generated/icon.tsx";
import { FosterFamilyInput } from "#routes/resources.foster-family.tsx";
import { ManagerInput } from "#routes/resources.manager.tsx";
import { PickUpLocationInput } from "#routes/resources.pick-up-location.tsx";
import { hasGroups } from "#users/groups.tsx";
import { createFormData } from "@animeaux/form-data";
import type { AnimalDraft, FosterFamily, User } from "@prisma/client";
import {
  AdoptionOption,
  Gender,
  PickUpReason,
  ScreeningResult,
  Species,
  Status,
  UserGroup,
} from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const ActionFormData = createFormData(
  z.object({
    adoptionDate: zfd.text(
      z.coerce
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional(),
    ),
    adoptionOption: z.nativeEnum(AdoptionOption).optional(),
    comments: z.string().trim(),
    fosterFamilyId: z.string().uuid().optional(),
    isSterilized: z.enum(["YES", "NO", "NOT_MANDATORY"], {
      required_error: "Veuillez choisir une option",
    }),
    managerId: z.string().uuid().optional(),
    nextVaccinationDate: zfd.text(
      z.coerce
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional(),
    ),
    pickUpDate: z.coerce.date({
      required_error: "Veuillez entrer une date",
      invalid_type_error: "Veuillez entrer une date valide",
    }),
    pickUpLocation: z.string().trim().optional(),
    pickUpReason: z.nativeEnum(PickUpReason, {
      required_error: "Veuillez choisir une raison",
    }),
    screeningFelv: z
      .nativeEnum(ScreeningResult)
      .default(ScreeningResult.UNKNOWN),
    screeningFiv: z
      .nativeEnum(ScreeningResult)
      .default(ScreeningResult.UNKNOWN),
    status: z.nativeEnum(Status, {
      required_error: "Veuillez choisir un statut",
    }),
    vaccination: z.enum(["MANDATORY", "WONT_BE_DONE"]),
  }),
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
      | "isVaccinationMandatory"
      | "nextVaccinationDate"
      | "pickUpDate"
      | "pickUpLocation"
      | "pickUpReason"
      | "screeningFelv"
      | "screeningFiv"
      | "species"
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
    defaultAnimal?.status ?? Status.UNAVAILABLE,
  );

  const [isVaccinationMandatoryState, setIsVaccinationMandatoryState] =
    useState(defaultAnimal?.isVaccinationMandatory !== false);

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
    <Form asChild hasHeader>
      <fetcher.Form method="POST" noValidate>
        <Form.Fields>
          <Form.Errors errors={fetcher.data?.errors?.formErrors} />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Statut <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
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
            </RadioInputList>
          </Form.Field>

          {statusState === Status.ADOPTED ? (
            <>
              <Separator />

              <Form.Field>
                <Form.Label htmlFor={ActionFormData.keys.adoptionDate}>
                  Date d’adoption <RequiredStar />
                </Form.Label>

                <Input
                  ref={adoptionDateRef}
                  id={ActionFormData.keys.adoptionDate}
                  type="date"
                  name={ActionFormData.keys.adoptionDate}
                  defaultValue={toIsoDateValue(defaultAnimal?.adoptionDate)}
                  hasError={
                    fetcher.data?.errors?.fieldErrors.adoptionDate != null
                  }
                  aria-describedby="adoptionDate-error"
                  leftAdornment={
                    <Input.Adornment>
                      <Icon id="calendarDays" />
                    </Input.Adornment>
                  }
                />

                {fetcher.data?.errors?.fieldErrors.adoptionDate != null ? (
                  <Form.ErrorMessage id="adoptionDate-error">
                    {fetcher.data.errors.fieldErrors.adoptionDate}
                  </Form.ErrorMessage>
                ) : null}
              </Form.Field>

              <Form.Field>
                <Form.Label asChild>
                  <span>
                    Option d’adoption <RequiredStar />
                  </span>
                </Form.Label>

                <RadioInputList>
                  {SORTED_ADOPTION_OPTION.map((adoptionOption) => (
                    <RadioInput
                      key={adoptionOption}
                      label={ADOPTION_OPTION_TRANSLATION[adoptionOption]}
                      name={ActionFormData.keys.adoptionOption}
                      value={adoptionOption}
                      defaultChecked={
                        adoptionOption ===
                        (defaultAnimal?.adoptionOption ??
                          AdoptionOption.UNKNOWN)
                      }
                    />
                  ))}
                </RadioInputList>
              </Form.Field>
            </>
          ) : null}

          <Separator />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Responsable{" "}
                {isCreate || defaultAnimal?.manager != null ? (
                  <RequiredStar />
                ) : null}
              </span>
            </Form.Label>

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
              <Form.ErrorMessage id="managerId-error">
                {fetcher.data.errors.fieldErrors.managerId}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Separator />

          <Form.Row>
            <Form.Field>
              <Form.Label htmlFor={ActionFormData.keys.pickUpDate}>
                Date de prise en charge <RequiredStar />
              </Form.Label>

              <Input
                ref={pickUpDateRef}
                id={ActionFormData.keys.pickUpDate}
                type="date"
                name={ActionFormData.keys.pickUpDate}
                defaultValue={toIsoDateValue(defaultAnimal?.pickUpDate)}
                hasError={fetcher.data?.errors?.fieldErrors.pickUpDate != null}
                aria-describedby="pickUpDate-error"
                leftAdornment={
                  <Input.Adornment>
                    <Icon id="calendarDays" />
                  </Input.Adornment>
                }
              />

              {fetcher.data?.errors?.fieldErrors.pickUpDate != null ? (
                <Form.ErrorMessage id="pickUpDate-error">
                  {fetcher.data.errors.fieldErrors.pickUpDate}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>

            <Form.Field>
              <Form.Label asChild>
                <span>
                  Lieux de prise en charge{" "}
                  {isCreate || defaultAnimal?.pickUpLocation != null ? (
                    <RequiredStar />
                  ) : null}
                </span>
              </Form.Label>

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
                <Form.ErrorMessage id="pickUpLocation-error">
                  {fetcher.data.errors.fieldErrors.pickUpLocation}
                </Form.ErrorMessage>
              ) : null}
            </Form.Field>
          </Form.Row>

          <Form.Field>
            <Form.Label asChild>
              <span>
                Raison de la prise en charge <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
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
            </RadioInputList>
          </Form.Field>

          {ACTIVE_ANIMAL_STATUS.includes(statusState) ? (
            <>
              <Separator />

              <Form.Field>
                <Form.Label asChild>
                  <span>Famille d’accueil</span>
                </Form.Label>

                <FosterFamilyInput
                  name={ActionFormData.keys.fosterFamilyId}
                  defaultValue={defaultAnimal?.fosterFamily}
                />
              </Form.Field>
            </>
          ) : null}

          <Separator />

          <Form.Field>
            <Form.Label asChild>
              <span>
                Stérilisé <RequiredStar />
              </span>
            </Form.Label>

            <RadioInputList>
              <RadioInput
                ref={isSterilizedRef}
                label="Oui"
                name={ActionFormData.keys.isSterilized}
                value={ActionFormData.schema.shape.isSterilized.Enum.YES}
                defaultChecked={defaultAnimal?.isSterilized === true}
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
            </RadioInputList>

            {fetcher.data?.errors?.fieldErrors.isSterilized != null ? (
              <Form.ErrorMessage id="isSterilized-error">
                {fetcher.data.errors.fieldErrors.isSterilized}
              </Form.ErrorMessage>
            ) : null}
          </Form.Field>

          <Form.Row>
            <Form.Field>
              <Form.Label asChild>
                <span>
                  Vaccination <RequiredStar />
                </span>
              </Form.Label>

              <RadioInputList>
                <RadioInput
                  label="Obligatoire"
                  name={ActionFormData.keys.vaccination}
                  value={ActionFormData.schema.shape.vaccination.Enum.MANDATORY}
                  checked={isVaccinationMandatoryState}
                  onChange={() => setIsVaccinationMandatoryState(true)}
                />

                <RadioInput
                  label="Ne sera pas faite"
                  name={ActionFormData.keys.vaccination}
                  value={
                    ActionFormData.schema.shape.vaccination.Enum.WONT_BE_DONE
                  }
                  checked={!isVaccinationMandatoryState}
                  onChange={() => setIsVaccinationMandatoryState(false)}
                />
              </RadioInputList>
            </Form.Field>

            {isVaccinationMandatoryState ? (
              <Form.Field>
                <Form.Label htmlFor={ActionFormData.keys.nextVaccinationDate}>
                  Prochaine vaccination{" "}
                  {!isCreate && defaultAnimal?.nextVaccinationDate != null ? (
                    <RequiredStar />
                  ) : null}
                </Form.Label>

                <Input
                  ref={nextVaccinationDateRef}
                  id={ActionFormData.keys.nextVaccinationDate}
                  type="date"
                  min={toIsoDateValue(new Date())}
                  name={ActionFormData.keys.nextVaccinationDate}
                  defaultValue={toIsoDateValue(
                    defaultAnimal?.nextVaccinationDate,
                  )}
                  hasError={
                    fetcher.data?.errors?.fieldErrors.nextVaccinationDate !=
                    null
                  }
                  aria-describedby="nextVaccinationDate-error"
                  leftAdornment={
                    <Input.Adornment>
                      <Icon id="calendarDays" />
                    </Input.Adornment>
                  }
                />

                {fetcher.data?.errors?.fieldErrors.nextVaccinationDate !=
                null ? (
                  <Form.ErrorMessage id="nextVaccinationDate-error">
                    {fetcher.data.errors.fieldErrors.nextVaccinationDate}
                  </Form.ErrorMessage>
                ) : null}
              </Form.Field>
            ) : null}
          </Form.Row>

          {defaultAnimal?.species === Species.CAT ? (
            <>
              <Separator />

              <Form.Row>
                <Form.Field>
                  <Form.Label asChild>
                    <span>
                      Dépistage FIV <RequiredStar />
                    </span>
                  </Form.Label>

                  <RadioInputList>
                    {SORTED_SCREENING_RESULTS.map((result) => (
                      <RadioInput
                        key={result}
                        label={
                          SCREENING_RESULT_TRANSLATION[result][Gender.MALE]
                        }
                        name={ActionFormData.keys.screeningFiv}
                        value={result}
                        defaultChecked={
                          result === defaultAnimal?.screeningFiv ??
                          ScreeningResult.UNKNOWN
                        }
                      />
                    ))}
                  </RadioInputList>
                </Form.Field>

                <Form.Field>
                  <Form.Label asChild>
                    <span>
                      Dépistage FeLV <RequiredStar />
                    </span>
                  </Form.Label>

                  <RadioInputList>
                    {SORTED_SCREENING_RESULTS.map((result) => (
                      <RadioInput
                        key={result}
                        label={
                          SCREENING_RESULT_TRANSLATION[result][Gender.MALE]
                        }
                        name={ActionFormData.keys.screeningFelv}
                        value={result}
                        defaultChecked={
                          result === defaultAnimal?.screeningFelv ??
                          ScreeningResult.UNKNOWN
                        }
                      />
                    ))}
                  </RadioInputList>
                </Form.Field>
              </Form.Row>
            </>
          ) : null}

          <Separator />

          <Form.Field>
            <Form.Label htmlFor={ActionFormData.keys.comments}>
              Commentaires privés
            </Form.Label>

            <Textarea
              ref={commentsRef}
              id={ActionFormData.keys.comments}
              name={ActionFormData.keys.comments}
              defaultValue={defaultAnimal?.comments ?? undefined}
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
