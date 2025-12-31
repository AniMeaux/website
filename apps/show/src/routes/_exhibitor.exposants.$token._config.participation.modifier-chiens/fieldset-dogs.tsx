import { FieldText } from "#i/core/form-elements/field-text";
import { FieldYesNo } from "#i/core/form-elements/field-yes-no";
import { FormLayout } from "#i/core/layout/form-layout";
import { DogsHelper } from "#i/exhibitors/dogs-configuration/helper";
import { Gender } from "@animeaux/prisma";
import { Fragment } from "react";
import { FieldDogGender } from "./field-dog-gender";
import { useForm } from "./form";

export function FieldsetDogs() {
  const { form, fields } = useForm();
  const fieldsDogs = fields.dogs.getFieldList();

  return (
    <FormLayout.Section>
      <FormLayout.Title>Chiens sur stand</FormLayout.Title>

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
                name: fields.dogs.name,
              })}
            >
              Retirer
            </FormLayout.InputList.Action>

            <FormLayout.FieldSeparator />
          </Fragment>
        );
      })}

      <FormLayout.InputList.Action
        {...form.insert.getButtonProps({ name: fields.dogs.name })}
      >
        Ajouter un chien
      </FormLayout.InputList.Action>
    </FormLayout.Section>
  );
}
