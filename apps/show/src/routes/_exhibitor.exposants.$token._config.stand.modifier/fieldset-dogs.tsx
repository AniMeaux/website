import { FieldText } from "#core/form-elements/field-text";
import { FieldYesNo } from "#core/form-elements/field-yes-no";
import { FormLayout } from "#core/layout/form-layout";
import { DogsHelper } from "#exhibitors/stand-configuration/dogs-helper";
import { Gender } from "@prisma/client";
import { Fragment } from "react/jsx-runtime";
import { FieldDogGender } from "./field-dog-gender";
import { useForm } from "./form";

export function FieldsetDogs() {
  const { form, fields } = useForm();
  const fieldsDogs = fields.presentDogs.getFieldList();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Chiens présents</FormLayout.Title>

      <DogsHelper />

      {fieldsDogs.map((fieldDog, index) => {
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
              {...form.remove.getButtonProps({
                index,
                name: fields.presentDogs.name,
              })}
            >
              Retirer
            </FormLayout.InputList.Action>

            <FormLayout.FieldSeparator />
          </Fragment>
        );
      })}

      <FormLayout.InputList.Action
        {...form.insert.getButtonProps({ name: fields.presentDogs.name })}
      >
        Ajouter un chien
      </FormLayout.InputList.Action>
    </FormLayout.Section>
  );
}
