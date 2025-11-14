import {
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
} from "#animals/adoption";
import {
  PICK_UP_REASON_TRANSLATION,
  SORTED_PICK_UP_REASON,
} from "#animals/pick-up";
import {
  SCREENING_RESULT_TRANSLATION,
  SORTED_SCREENING_RESULTS,
} from "#animals/screening";
import {
  DIAGNOSIS_TRANSLATION,
  SORTED_DIAGNOSIS,
} from "#animals/situation/diagnosis";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  STATUS_TRANSLATION,
} from "#animals/status";
import { Action } from "#core/actions";
import { toIsoDateValue } from "#core/dates";
import { Form } from "#core/form-elements/form";
import { Input } from "#core/form-elements/input";
import { RadioInput, RadioInputList } from "#core/form-elements/input-choice";
import { RequiredStar } from "#core/form-elements/required-star";
import { Textarea } from "#core/form-elements/textarea";
import { Separator } from "#core/layout/separator";
import { Icon } from "#generated/icon";
import { FosterFamilyInput } from "#routes/resources.foster-family/input";
import { ManagerInput } from "#routes/resources.manager/input";
import { PickUpLocationInput } from "#routes/resources.pick-up-location/input";
import { hasGroups } from "#users/groups";
import { FormDataDelegate } from "@animeaux/form-data";
import type { AnimalDraft, FosterFamily, User } from "@animeaux/prisma";
import {
  AdoptionOption,
  Diagnosis,
  Gender,
  PickUpReason,
  ScreeningResult,
  Species,
  Status,
  UserGroup,
} from "@animeaux/prisma";
import { zu } from "@animeaux/zod-utils";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useLocation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

export const ActionFormData = FormDataDelegate.create(
  zu.object({
    adoptionDate: zu.text(
      zu.coerce
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional(),
    ),
    adoptionOption: zu.nativeEnum(AdoptionOption).optional(),
    comments: zu.string().trim(),
    diagnosis: zu.nativeEnum(Diagnosis).default(Diagnosis.UNKNOWN),
    fosterFamilyId: zu.string().uuid().optional(),
    isSterilized: zu.enum(["YES", "NO", "NOT_MANDATORY"], {
      required_error: "Veuillez choisir une option",
    }),
    managerId: zu.string().uuid().optional(),
    nextVaccinationDate: zu.text(
      zu.coerce
        .date({ invalid_type_error: "Veuillez entrer une date valide" })
        .optional(),
    ),
    pickUpDate: zu.coerce.date({
      required_error: "Veuillez entrer une date",
      invalid_type_error: "Veuillez entrer une date valide",
    }),
    pickUpLocation: zu.string().trim().optional(),
    pickUpReason: zu.nativeEnum(PickUpReason, {
      required_error: "Veuillez choisir une raison",
    }),
    screeningFelv: zu
      .nativeEnum(ScreeningResult)
      .default(ScreeningResult.UNKNOWN),
    screeningFiv: zu
      .nativeEnum(ScreeningResult)
      .default(ScreeningResult.UNKNOWN),
    status: zu.nativeEnum(Status, {
      required_error: "Veuillez choisir un statut",
    }),
    vaccination: zu.enum(["MANDATORY", "WONT_BE_DONE"]),
  }),
);

type DefaultAnimal = null | SerializeFrom<
  Pick<
    AnimalDraft,
    | "adoptionDate"
    | "adoptionOption"
    | "comments"
    | "diagnosis"
    | "gender"
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

export function AnimalSituationForm({
  isCreate = false,
  defaultAnimal,
  currentUser,
  fetcher,
}: {
  isCreate?: boolean;
  defaultAnimal?: DefaultAnimal;
  currentUser?: null | Pick<User, "id" | "displayName" | "groups">;
  fetcher: FetcherWithComponents<{
    errors?: zu.inferFlattenedErrors<typeof ActionFormData.schema>;
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

          {ACTIVE_ANIMAL_STATUS.includes(statusState) ? (
            <>
              <Form.Field>
                <Form.Label>Famille d’accueil</Form.Label>

                <FosterFamilyInput
                  name={ActionFormData.keys.fosterFamilyId}
                  defaultValue={defaultAnimal?.fosterFamily}
                />
              </Form.Field>

              <Separator />
            </>
          ) : null}

          <Form.Field>
            <Form.Label>
              Statut <RequiredStar />
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
                      <Icon href="icon-calendar-days-solid" />
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
                <Form.Label>
                  Option d’adoption <RequiredStar />
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
            <Form.Label>
              Responsable{" "}
              {isCreate || defaultAnimal?.manager != null ? (
                <RequiredStar />
              ) : null}
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
                    <Icon href="icon-calendar-days-solid" />
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
              <Form.Label>
                Lieux de prise en charge{" "}
                {isCreate || defaultAnimal?.pickUpLocation != null ? (
                  <RequiredStar />
                ) : null}
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
            <Form.Label>
              Raison de la prise en charge <RequiredStar />
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

          <Separator />

          <Form.Field>
            <Form.Label>
              Stérilisé <RequiredStar />
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
              <Form.Label>
                Vaccination <RequiredStar />
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
                      <Icon href="icon-calendar-days-solid" />
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
            <Form.Row>
              <Form.Field>
                <Form.Label>
                  Dépistage FIV <RequiredStar />
                </Form.Label>

                <RadioInputList>
                  {SORTED_SCREENING_RESULTS.map((result) => (
                    <RadioInput
                      key={result}
                      label={SCREENING_RESULT_TRANSLATION[result][Gender.MALE]}
                      name={ActionFormData.keys.screeningFiv}
                      value={result}
                      defaultChecked={
                        result ===
                        (defaultAnimal?.screeningFiv ?? ScreeningResult.UNKNOWN)
                      }
                    />
                  ))}
                </RadioInputList>
              </Form.Field>

              <Form.Field>
                <Form.Label>
                  Dépistage FeLV <RequiredStar />
                </Form.Label>

                <RadioInputList>
                  {SORTED_SCREENING_RESULTS.map((result) => (
                    <RadioInput
                      key={result}
                      label={SCREENING_RESULT_TRANSLATION[result][Gender.MALE]}
                      name={ActionFormData.keys.screeningFelv}
                      value={result}
                      defaultChecked={
                        result ===
                        (defaultAnimal?.screeningFelv ??
                          ScreeningResult.UNKNOWN)
                      }
                    />
                  ))}
                </RadioInputList>
              </Form.Field>
            </Form.Row>
          ) : null}

          <DiagnosisField defaultAnimal={defaultAnimal} />

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

function DiagnosisField({ defaultAnimal }: { defaultAnimal?: DefaultAnimal }) {
  const gender = defaultAnimal?.gender;
  invariant(gender != null, "gender must be defined");

  if (defaultAnimal?.species !== Species.DOG) {
    return null;
  }

  return (
    <Form.Field>
      <Form.Label>
        Diagnose <RequiredStar />
      </Form.Label>

      <RadioInputList>
        {SORTED_DIAGNOSIS.map((diagnosis) => (
          <RadioInput
            key={diagnosis}
            label={DIAGNOSIS_TRANSLATION[diagnosis][gender]}
            name={ActionFormData.keys.diagnosis}
            value={diagnosis}
            defaultChecked={
              diagnosis === (defaultAnimal?.diagnosis ?? Diagnosis.UNKNOWN)
            }
          />
        ))}
      </RadioInputList>
    </Form.Field>
  );
}
