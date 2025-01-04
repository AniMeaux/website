import { FieldText } from "#core/form-elements/field-text";
import { FieldYesNo } from "#core/form-elements/field-yes-no";
import { FormLayout } from "#core/layout/form-layout";
import type { FieldMetadata, FormMetadata } from "@conform-to/react";
import { Gender } from "@prisma/client";
import { Fragment } from "react/jsx-runtime";
import { FieldDogGender } from "./field-dog-gender";

export function FieldsetDogs<TFormSchema extends Record<string, unknown>>({
  form,
  field,
}: {
  form: FormMetadata<TFormSchema>;
  field: FieldMetadata<
    {
      gender: Gender;
      idNumber: string;
      isCategorized: "on" | "off";
      isSterilized: "on" | "off";
    }[]
  >;
}) {
  const fields = field.getFieldList();

  return (
    <>
      {fields.map((fieldDog, index) => {
        const fieldsetDog = fieldDog.getFieldset();

        const gender = fieldsetDog.gender.value as undefined | Gender;

        return (
          <Fragment key={fieldDog.key}>
            <FieldText
              field={fieldsetDog.idNumber}
              label="Numéro d’identification"
            />

            <FieldDogGender field={fieldsetDog.gender} label="Genre" />

            <FieldYesNo
              field={fieldsetDog.isSterilized}
              label={[
                gender !== Gender.FEMALE ? "Il est castré" : null,
                gender !== Gender.MALE ? "Elle est stérilisée" : null,
              ]
                .filter(Boolean)
                .join(" / ")}
              helper={
                gender === Gender.FEMALE &&
                fieldsetDog.isSterilized.value === "off" ? (
                  <FormLayout.Helper variant="error">
                    Les femelles en chaleur sont interdites sur le salon
                  </FormLayout.Helper>
                ) : null
              }
            />

            <FieldYesNo
              field={fieldsetDog.isCategorized}
              label={[
                gender !== Gender.FEMALE ? "Il est catégorisé" : null,
                gender !== Gender.MALE ? "Elle est catégorisée" : null,
              ]
                .filter(Boolean)
                .join(" / ")}
            />

            <FormLayout.InputList.Action
              {...form.remove.getButtonProps({ index, name: field.name })}
            >
              Retirer
            </FormLayout.InputList.Action>

            <FormLayout.FieldSeparator />
          </Fragment>
        );
      })}

      <FormLayout.InputList.Action
        {...form.insert.getButtonProps({ name: field.name })}
      >
        Ajouter un chien
      </FormLayout.InputList.Action>
    </>
  );
}
