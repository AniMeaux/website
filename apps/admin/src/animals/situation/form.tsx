import {
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
  SORTED_STATUS,
  STATUS_TRANSLATION,
} from "#/animals/status";
import { actionClassName } from "#/core/actions";
import { cn } from "#/core/classNames";
import { Adornment } from "#/core/formElements/adornment";
import { formClassNames } from "#/core/formElements/form";
import { FormErrors } from "#/core/formElements/formErrors";
import { Input } from "#/core/formElements/input";
import { RadioInput } from "#/core/formElements/radioInput";
import { RequiredStart } from "#/core/formElements/requiredStart";
import { Textarea } from "#/core/formElements/textarea";
import { Separator } from "#/core/layout/separator";
import { createActionData, ensureDate } from "#/core/schemas";
import { Icon } from "#/generated/icon";
import { ManagerInput } from "#/routes/resources/manager";
import {
  AdoptionOption,
  Animal,
  PickUpReason,
  Status,
  User,
} from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { PICK_UP_REASON_TRANSLATION, SORTED_PICK_UP_REASON } from "../pickUp";

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
    id: z.string().uuid(),
    managerId: z.string().uuid().optional(),
    pickUpDate: z.preprocess(
      ensureDate,
      z.date({
        required_error: "Veuillez entrer une date",
        invalid_type_error: "Veuillez entrer une date valide",
      })
    ),
    pickUpReason: z.nativeEnum(PickUpReason, {
      required_error: "Veuillez choisir une raison",
    }),
    status: z.nativeEnum(Status, {
      required_error: "Veuillez choisir un status",
    }),
  })
);

export function AnimalSituationForm({
  animal,
  errors = { formErrors: [], fieldErrors: {} },
}: {
  animal: SerializeFrom<
    Pick<
      Animal,
      | "adoptionDate"
      | "adoptionOption"
      | "comments"
      | "id"
      | "pickUpDate"
      | "pickUpReason"
      | "status"
    > & {
      manager: null | Pick<User, "id" | "displayName">;
    }
  >;
  errors?: z.inferFlattenedErrors<typeof ActionFormData.schema>;
}) {
  const [statusState, setStatusState] = useState(animal.status);

  const managerRef = useRef<HTMLButtonElement>(null);
  const adoptionDateRef = useRef<HTMLInputElement>(null);
  const pickUpDateRef = useRef<HTMLInputElement>(null);

  // Focus the first field having an error.
  useEffect(() => {
    if (errors.formErrors.length > 0) {
      window.scrollTo({ top: 0 });
    } else if (errors.fieldErrors.managerId != null) {
      managerRef.current?.focus();
    } else if (errors.fieldErrors.adoptionDate != null) {
      adoptionDateRef.current?.focus();
    } else if (errors.fieldErrors.pickUpDate != null) {
      pickUpDateRef.current?.focus();
    }
  }, [errors.formErrors, errors.fieldErrors]);

  return (
    <Form
      method="post"
      noValidate
      className={formClassNames.root({ hasHeader: true })}
    >
      <input type="hidden" name={ActionFormData.keys.id} value={animal.id} />

      <div className={formClassNames.fields.root()}>
        <FormErrors errors={errors.formErrors} />

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Status <RequiredStart />
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
                Date d’adoption <RequiredStart />
              </label>

              <Input
                ref={adoptionDateRef}
                id={ActionFormData.keys.adoptionDate}
                type="date"
                name={ActionFormData.keys.adoptionDate}
                defaultValue={
                  animal.adoptionDate == null
                    ? ""
                    : DateTime.fromISO(animal.adoptionDate).toISODate()
                }
                hasError={errors.fieldErrors.adoptionDate != null}
                aria-describedby="adoptionDate-error"
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
              />

              {errors.fieldErrors.adoptionDate != null && (
                <p
                  id="adoptionDate-error"
                  className={formClassNames.fields.field.errorMessage()}
                >
                  {errors.fieldErrors.adoptionDate}
                </p>
              )}
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Option d’adoption <RequiredStart />
              </span>

              <div className="py-1 flex flex-wrap gap-2">
                {SORTED_ADOPTION_OPTION.map((adoptionOption) => (
                  <RadioInput
                    key={adoptionOption}
                    label={ADOPTION_OPTION_TRANSLATION[adoptionOption]}
                    name={ActionFormData.keys.adoptionOption}
                    value={adoptionOption}
                    defaultChecked={
                      animal.adoptionOption == null
                        ? adoptionOption === AdoptionOption.UNKNOWN
                        : animal.adoptionOption === adoptionOption
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
            Responsable {animal.manager != null ? <RequiredStart /> : null}
          </span>

          <ManagerInput
            ref={managerRef}
            name={ActionFormData.keys.managerId}
            defaultValue={animal.manager}
            hasError={errors.fieldErrors.managerId != null}
            aria-describedby="managerId-error"
          />

          {errors.fieldErrors.managerId != null && (
            <p
              id="managerId-error"
              className={formClassNames.fields.field.errorMessage()}
            >
              {errors.fieldErrors.managerId}
            </p>
          )}
        </div>

        <Separator />

        <div className={formClassNames.fields.row()}>
          <div className={formClassNames.fields.field.root()}>
            <label
              htmlFor={ActionFormData.keys.pickUpDate}
              className={formClassNames.fields.field.label()}
            >
              Date de prise en charge <RequiredStart />
            </label>

            <Input
              ref={pickUpDateRef}
              id={ActionFormData.keys.pickUpDate}
              type="date"
              name={ActionFormData.keys.pickUpDate}
              defaultValue={DateTime.fromISO(animal.pickUpDate).toISODate()}
              hasError={errors.fieldErrors.pickUpDate != null}
              aria-describedby="pickUpDate-error"
              leftAdornment={
                <Adornment>
                  <Icon id="calendarDays" />
                </Adornment>
              }
            />

            {errors.fieldErrors.pickUpDate != null && (
              <p
                id="pickUpDate-error"
                className={formClassNames.fields.field.errorMessage()}
              >
                {errors.fieldErrors.pickUpDate}
              </p>
            )}
          </div>
        </div>

        <div className={formClassNames.fields.field.root()}>
          <span className={formClassNames.fields.field.label()}>
            Raison de la prise en charge <RequiredStart />
          </span>

          <div className="py-1 flex flex-wrap gap-2">
            {SORTED_PICK_UP_REASON.map((pickUpReason) => (
              <RadioInput
                key={pickUpReason}
                label={PICK_UP_REASON_TRANSLATION[pickUpReason]}
                name={ActionFormData.keys.pickUpReason}
                value={pickUpReason}
                defaultChecked={animal.pickUpReason === pickUpReason}
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
            id={ActionFormData.keys.comments}
            name={ActionFormData.keys.comments}
            defaultValue={animal.comments ?? ""}
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
