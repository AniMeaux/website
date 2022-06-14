import {
  AdoptionOption,
  Animal,
  AnimalStatus,
  PickUpReason,
  Trilean,
} from "@animeaux/shared";
import invariant from "invariant";
import uniq from "lodash.uniq";
import without from "lodash.without";
import { FaHome, FaMapMarkerAlt, FaTimes, FaUser } from "react-icons/fa";
import { string } from "yup";
import { PICK_UP_REASON_LABELS } from "~/animal/gender/labels";
import { ADOPTION_OPTION_LABELS } from "~/animal/labels";
import { AnimalStatusInput } from "~/animal/status/input";
import { Info } from "~/core/dataDisplay/info";
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { Field, Fields } from "~/core/formElements/field";
import { Form } from "~/core/formElements/form";
import { Input } from "~/core/formElements/input";
import { Label } from "~/core/formElements/label";
import { LinkInput } from "~/core/formElements/linkInput";
import {
  Selector,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "~/core/formElements/selector";
import { SubmitButton } from "~/core/formElements/submitButton";
import { Textarea } from "~/core/formElements/textarea";
import { BaseValidationError } from "~/core/formValidation";
import { includes } from "~/core/includes";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Separator } from "~/core/layouts/separator";
import { Placeholder, Placeholders } from "~/core/loaders/placeholder";
import { SetStateAction } from "~/core/types";
import { TRILEAN_LABELS } from "~/trilean/labels";

type ErrorCode =
  | "server-error"
  | "empty-manager"
  | "empty-pick-up-date"
  | "invalid-pick-up-date"
  | "empty-pick-up-location"
  | "empty-adoption-date"
  | "invalid-adoption-date";

class ValidationError extends BaseValidationError<ErrorCode> {}

const ERROR_CODE_LABEL: Record<ErrorCode, string> = {
  "server-error": "Une erreur est survenue.",
  "empty-manager": "Le responsable est obligatoire.",
  "empty-adoption-date": "La date d'adoption est obligatoire.",
  "invalid-adoption-date": "Le format de la date est invalide.",
  "empty-pick-up-date": "La date de prise en charge est obligatoire.",
  "invalid-pick-up-date": "Le format de la date est invalide.",
  "empty-pick-up-location": "Le lieux de prise en charge est obligatoire",
};

export type FormState = {
  status: AnimalStatus;
  manager: { id: string; displayName: string } | null;
  adoptionDate: string;
  adoptionOption: AdoptionOption;
  pickUpDate: string;
  pickUpLocation: string | null;
  pickUpReason: PickUpReason;
  fosterFamily: { id: string; name: string } | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
  comments: string;
  errors: ErrorCode[];
};

export type FormValue = {
  status: AnimalStatus;
  managerId: string;
  adoptionDate: string | null;
  adoptionOption: AdoptionOption | null;
  pickUpDate: string;
  pickUpLocation: string | null;
  pickUpReason: PickUpReason;
  fosterFamilyId: string | null;
  isOkChildren: Trilean;
  isOkDogs: Trilean;
  isOkCats: Trilean;
  isSterilized: boolean;
  comments: string | null;
};

export type AnimalSituationFormProps = {
  state: FormState;
  setState: React.Dispatch<SetStateAction<FormState>>;
  onSubmit: (value: FormValue) => void;
  pending?: boolean;
  isEdit?: boolean;
  serverErrors?: ErrorCode[];
};

export function AnimalSituationForm({
  state,
  setState,
  onSubmit,
  pending = false,
  isEdit = false,
  serverErrors = [],
}: AnimalSituationFormProps) {
  async function handleSubmit() {
    if (!pending) {
      try {
        onSubmit(validate(state));
      } catch (error) {
        invariant(
          error instanceof ValidationError,
          "The error is expected to be a ValidationError error"
        );

        setState(setErrors(error.codes));
      }
    }
  }

  const errors = uniq(
    [...serverErrors, ...state.errors].map((error) => ERROR_CODE_LABEL[error])
  );

  return (
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <Info variant="error">{joinReactNodes(errors, <br />)}</Info>
      )}

      <Fields>
        <Field>
          <Label>Statut</Label>

          <AnimalStatusInput
            value={state.status}
            onChange={(status) => setState(setStatus(status))}
          />
        </Field>

        <Separator />

        <Field>
          <Label hasError={includes(state.errors, "empty-manager")}>
            Responsable
          </Label>

          <LinkInput
            href="../manager"
            value={state.manager?.displayName}
            hasError={includes(state.errors, "empty-manager")}
            leftAdornment={
              <Adornment>
                <FaUser />
              </Adornment>
            }
          />
        </Field>

        {state.status === AnimalStatus.ADOPTED && (
          <>
            <Separator />

            <Field>
              <Label
                htmlFor="adoption-date"
                hasError={includes(
                  state.errors,
                  "empty-adoption-date",
                  "invalid-adoption-date"
                )}
              >
                Date d'adoption
              </Label>

              <Input
                name="adoption-date"
                id="adoption-date"
                type="date"
                value={state.adoptionDate}
                onChange={(adoptionDate) =>
                  setState(setAdoptionDate(adoptionDate))
                }
                hasError={includes(
                  state.errors,
                  "empty-adoption-date",
                  "invalid-adoption-date"
                )}
              />
            </Field>

            <Field>
              <Label>Option d'adoption</Label>

              <Selectors>
                {Object.values(AdoptionOption).map((adoptionOption) => (
                  <SelectorItem key={adoptionOption}>
                    <Selector>
                      <SelectorRadio
                        name="adoption-option"
                        checked={state.adoptionOption === adoptionOption}
                        onChange={() =>
                          setState(setAdoptionOption(adoptionOption))
                        }
                      />

                      <SelectorLabel>
                        {ADOPTION_OPTION_LABELS[adoptionOption]}
                      </SelectorLabel>
                    </Selector>
                  </SelectorItem>
                ))}
              </Selectors>
            </Field>
          </>
        )}

        <Separator />

        <Field>
          <Label
            htmlFor="pick-up-date"
            hasError={includes(
              state.errors,
              "empty-pick-up-date",
              "invalid-pick-up-date"
            )}
          >
            Date de prise en charge
          </Label>

          <Input
            name="pick-up-date"
            id="pick-up-date"
            type="date"
            value={state.pickUpDate}
            onChange={(pickUpDate) => setState(setPickUpDate(pickUpDate))}
            hasError={includes(
              state.errors,
              "empty-pick-up-date",
              "invalid-pick-up-date"
            )}
          />
        </Field>

        <Field>
          <Label hasError={includes(state.errors, "empty-pick-up-location")}>
            Lieux de prise en charge
          </Label>

          <LinkInput
            href="../pick-up-location"
            value={state.pickUpLocation}
            leftAdornment={
              <Adornment>
                <FaMapMarkerAlt />
              </Adornment>
            }
            hasError={includes(state.errors, "empty-pick-up-location")}
          />
        </Field>

        <Field>
          <Label>Raison de la prise en charge</Label>

          <Selectors>
            {Object.values(PickUpReason).map((pickUpReason) => (
              <SelectorItem key={pickUpReason}>
                <Selector>
                  <SelectorRadio
                    name="pick-up-reason"
                    checked={state.pickUpReason === pickUpReason}
                    onChange={() => setState(setPickUpReason(pickUpReason))}
                  />

                  <SelectorLabel>
                    {PICK_UP_REASON_LABELS[pickUpReason]}
                  </SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>

        {state.status !== AnimalStatus.ADOPTED && (
          <>
            <Separator />

            <Field>
              <Label isOptional>Famille d'accueil</Label>

              <LinkInput
                href="../foster-family"
                value={state.fosterFamily?.name}
                leftAdornment={
                  <Adornment>
                    <FaHome />
                  </Adornment>
                }
                rightAdornment={
                  state.fosterFamily != null && (
                    <ActionAdornment
                      onClick={() => setState(clearFosterFamily())}
                    >
                      <FaTimes />
                    </ActionAdornment>
                  )
                }
              />
            </Field>
          </>
        )}

        <Separator />

        <Field>
          <Label>Ok enfants</Label>

          <Selectors>
            {Object.values(Trilean).map((trileanValue) => (
              <SelectorItem key={trileanValue}>
                <Selector>
                  <SelectorRadio
                    name="is-ok-children"
                    checked={state.isOkChildren === trileanValue}
                    onChange={() => setState(setIsOkChildren(trileanValue))}
                  />

                  <SelectorLabel>{TRILEAN_LABELS[trileanValue]}</SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>

        <Field>
          <Label>Ok chiens</Label>

          <Selectors>
            {Object.values(Trilean).map((trileanValue) => (
              <SelectorItem key={trileanValue}>
                <Selector>
                  <SelectorRadio
                    name="is-ok-dogs"
                    checked={state.isOkDogs === trileanValue}
                    onChange={() => setState(setIsOkDogs(trileanValue))}
                  />

                  <SelectorLabel>{TRILEAN_LABELS[trileanValue]}</SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>

        <Field>
          <Label>Ok chats</Label>

          <Selectors>
            {Object.values(Trilean).map((trileanValue) => (
              <SelectorItem key={trileanValue}>
                <Selector>
                  <SelectorRadio
                    name="is-ok-cats"
                    checked={state.isOkCats === trileanValue}
                    onChange={() => setState(setIsOkCats(trileanValue))}
                  />

                  <SelectorLabel>{TRILEAN_LABELS[trileanValue]}</SelectorLabel>
                </Selector>
              </SelectorItem>
            ))}
          </Selectors>
        </Field>

        <Field>
          <Label>Stérilisé</Label>

          <Selectors>
            <SelectorItem>
              <Selector>
                <SelectorRadio
                  name="is-sterilized"
                  checked={state.isSterilized}
                  onChange={() => setState(setIsSterilized(true))}
                />

                <SelectorLabel>Oui</SelectorLabel>
              </Selector>
            </SelectorItem>

            <SelectorItem>
              <Selector>
                <SelectorRadio
                  name="is-sterilized"
                  checked={!state.isSterilized}
                  onChange={() => setState(setIsSterilized(false))}
                />

                <SelectorLabel>Non</SelectorLabel>
              </Selector>
            </SelectorItem>
          </Selectors>
        </Field>

        <Field>
          <Label htmlFor="comments" isOptional>
            Commentaires privées
          </Label>

          <Textarea
            name="comments"
            id="comments"
            value={state.comments}
            onChange={(comments) => setState(setComments(comments))}
          />
        </Field>
      </Fields>

      <SubmitButton loading={pending}>
        {isEdit ? "Modifier" : "Suivant"}
      </SubmitButton>
    </Form>
  );
}

export function getInitialState(initialAnimal?: Animal): FormState {
  return {
    manager: initialAnimal?.manager ?? null,
    adoptionDate: initialAnimal?.adoptionDate ?? "",
    adoptionOption: initialAnimal?.adoptionOption ?? AdoptionOption.UNKNOWN,
    comments: initialAnimal?.comments ?? "",
    fosterFamily: initialAnimal?.fosterFamily ?? null,
    isOkCats: initialAnimal?.isOkCats ?? Trilean.UNKNOWN,
    isOkChildren: initialAnimal?.isOkChildren ?? Trilean.UNKNOWN,
    isOkDogs: initialAnimal?.isOkDogs ?? Trilean.UNKNOWN,
    isSterilized: initialAnimal?.isSterilized ?? false,
    pickUpDate: initialAnimal?.pickUpDate ?? "",
    pickUpLocation: initialAnimal?.pickUpLocation ?? null,
    pickUpReason: initialAnimal?.pickUpReason ?? PickUpReason.OTHER,
    status: initialAnimal?.status ?? AnimalStatus.UNAVAILABLE,
    errors: [],
  };
}

function setStatus(status: AnimalStatus): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, status });
}

function setAdoptionDate(adoptionDate: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    adoptionDate,
    errors: without(
      prevState.errors,
      "empty-adoption-date",
      "invalid-adoption-date"
    ),
  });
}

function setAdoptionOption(
  adoptionOption: AdoptionOption
): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, adoptionOption });
}

function setPickUpDate(pickUpDate: string): SetStateAction<FormState> {
  return (prevState) => ({
    ...prevState,
    pickUpDate,
    errors: without(
      prevState.errors,
      "empty-pick-up-date",
      "invalid-pick-up-date"
    ),
  });
}

function setPickUpReason(
  pickUpReason: PickUpReason
): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, pickUpReason });
}

function clearFosterFamily(): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, fosterFamily: null });
}

function setIsOkChildren(isOkChildren: Trilean): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, isOkChildren });
}

function setIsOkDogs(isOkDogs: Trilean): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, isOkDogs });
}

function setIsOkCats(isOkCats: Trilean): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, isOkCats });
}

function setIsSterilized(isSterilized: boolean): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, isSterilized });
}

function setComments(comments: string): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, comments });
}

function setErrors(errors: ErrorCode[]): SetStateAction<FormState> {
  return (prevState) => ({ ...prevState, errors });
}

export function validate(state: FormState): FormValue {
  const errorCodes: ErrorCode[] = [];

  if (state.manager == null) {
    errorCodes.push("empty-manager");
  }

  if (state.status === AnimalStatus.ADOPTED) {
    if (!string().trim().required().isValidSync(state.adoptionDate)) {
      errorCodes.push("empty-adoption-date");
    } else if (!string().trim().dateISO().isValidSync(state.adoptionDate)) {
      errorCodes.push("invalid-adoption-date");
    }
  }

  if (!string().trim().required().isValidSync(state.pickUpDate)) {
    errorCodes.push("empty-pick-up-date");
  } else if (!string().trim().dateISO().isValidSync(state.pickUpDate)) {
    errorCodes.push("invalid-pick-up-date");
  }

  if (state.pickUpLocation == null) {
    errorCodes.push("empty-pick-up-location");
  }

  if (errorCodes.length > 0) {
    throw new ValidationError(errorCodes);
  }

  return {
    managerId: state.manager!.id,
    adoptionDate:
      state.status === AnimalStatus.ADOPTED ? state.adoptionDate : null,
    adoptionOption:
      state.status === AnimalStatus.ADOPTED ? state.adoptionOption : null,
    comments: state.comments.trim() || null,
    fosterFamilyId:
      state.status === AnimalStatus.ADOPTED
        ? null
        : state.fosterFamily?.id ?? null,
    isOkCats: state.isOkCats,
    isOkChildren: state.isOkChildren,
    isOkDogs: state.isOkDogs,
    isSterilized: state.isSterilized,
    pickUpDate: state.pickUpDate,
    pickUpLocation: state.pickUpLocation,
    pickUpReason: state.pickUpReason,
    status: state.status,
  };
}

export function AnimalSituationFormPlaceholder() {
  return (
    <Form>
      <Fields>
        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={Object.values(AnimalStatus).length}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>

        <Separator />

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Placeholder $preset="input" />
        </Field>

        <Separator />

        <Placeholders count={2}>
          <Field>
            <Label>
              <Placeholder $preset="label" />
            </Label>

            <Placeholder $preset="input" />
          </Field>
        </Placeholders>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={Object.values(PickUpReason).length}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>

        <Separator />

        <Placeholders count={3}>
          <Field>
            <Label>
              <Placeholder $preset="label" />
            </Label>

            <Selectors>
              <Placeholders count={Object.values(Trilean).length}>
                <SelectorItem>
                  <Placeholder $preset="selector" />
                </SelectorItem>
              </Placeholders>
            </Selectors>
          </Field>
        </Placeholders>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Selectors>
            <Placeholders count={2}>
              <SelectorItem>
                <Placeholder $preset="selector" />
              </SelectorItem>
            </Placeholders>
          </Selectors>
        </Field>

        <Field>
          <Label>
            <Placeholder $preset="label" />
          </Label>

          <Placeholder $preset="input" />
        </Field>
      </Fields>
    </Form>
  );
}
