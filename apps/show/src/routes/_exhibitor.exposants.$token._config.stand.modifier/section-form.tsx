import { FieldStepper } from "#core/form-elements/field-stepper";
import { FieldSwitch } from "#core/form-elements/field-switch";
import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { DogsHelper } from "#exhibitors/stand-configuration/dogs-helper";
import {
  MAX_DIVIDER_COUNT,
  MAX_DIVIDER_COUNT_BY_STAND_SIZE,
} from "#exhibitors/stand-size/divider-count";
import { FieldStandSize } from "#exhibitors/stand-size/field";
import {
  MAX_PEOPLE_COUNT,
  MAX_PEOPLE_COUNT_BY_STAND_SIZE,
} from "#exhibitors/stand-size/people-count";
import {
  MAX_TABLE_COUNT,
  MAX_TABLE_COUNT_BY_STAND_SIZE,
} from "#exhibitors/stand-size/table-count";
import { getFormProps, useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import type { ShowStandSize } from "@prisma/client";
import {
  Form,
  useActionData,
  useFormAction,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { ActionSchema } from "./action";
import { FieldDividerType } from "./field-divider-type";
import { FieldInstallationDay } from "./field-installation-day";
import { FieldStandZone } from "./field-stand-zone";
import { FieldsetDogs } from "./fieldset-dogs";
import type { action, loader } from "./route";

export function SectionForm() {
  const { profile } = useLoaderData<typeof loader>();
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fieldset] = useForm();

  return (
    <FormLayout.Form asChild>
      <Form {...getFormProps(form)} method="POST">
        <FormLayout.Section>
          <FormLayout.Title>Configuration de stand</FormLayout.Title>

          <FieldStandSize
            label="Taille du stand"
            field={fieldset.size}
            selectedActivityFields={profile.activityFields}
          />

          <FormLayout.Row>
            <FieldDividerType
              label="Type de cloisons"
              field={fieldset.dividerType}
            />

            <FieldStepper
              label="Nombre de cloisons"
              field={fieldset.dividerCount}
              maxValue={
                fieldset.size.value == null
                  ? MAX_DIVIDER_COUNT
                  : MAX_DIVIDER_COUNT_BY_STAND_SIZE[
                      fieldset.size.value as ShowStandSize
                    ]
              }
              helper={
                <FormLayout.Helper>
                  Sous réserve de disponibilité
                </FormLayout.Helper>
              }
            />
          </FormLayout.Row>

          <FieldStepper
            label="Nombre de tables"
            field={fieldset.tableCount}
            maxValue={
              fieldset.size.value == null
                ? MAX_TABLE_COUNT
                : MAX_TABLE_COUNT_BY_STAND_SIZE[
                    fieldset.size.value as ShowStandSize
                  ]
            }
            helper={
              <FormLayout.Helper>
                Sous réserve de disponibilité
              </FormLayout.Helper>
            }
          />

          <FieldSwitch
            label="Nappage des tables"
            field={fieldset.hasTablecloths}
          />

          <FormLayout.Row>
            <FieldStepper
              label="Nombre de personnes sur le stand"
              field={fieldset.peopleCount}
              maxValue={
                fieldset.size.value == null
                  ? MAX_PEOPLE_COUNT
                  : MAX_PEOPLE_COUNT_BY_STAND_SIZE[
                      fieldset.size.value as ShowStandSize
                    ]
              }
            />

            <FieldStepper
              label="Nombre de chaises"
              field={fieldset.chairCount}
              maxValue={
                isNaN(Number(fieldset.peopleCount.value))
                  ? undefined
                  : Number(fieldset.peopleCount.value)
              }
            />
          </FormLayout.Row>

          <FieldInstallationDay
            label="Jour d’installation"
            field={fieldset.installationDay}
          />

          <FieldStandZone label="Emplacement" field={fieldset.zone} />

          <FieldTextarea
            label="Commentaire sur votre choix d’emplacement"
            field={fieldset.placementComment}
            rows={3}
          />
        </FormLayout.Section>

        <FormLayout.SectionSeparator />

        <FormLayout.Section>
          <FormLayout.Title>Chiens présents</FormLayout.Title>

          <DogsHelper />

          <FieldsetDogs form={form} field={fieldset.presentDogs} />
        </FormLayout.Section>

        <FormLayout.SectionSeparator />

        <FormLayout.Action
          isLoading={
            navigation.state !== "idle" && navigation.formAction === formAction
          }
        >
          Enregistrer
        </FormLayout.Action>
      </Form>
    </FormLayout.Form>
  );
}

function useForm() {
  const { standConfiguration } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-stand",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      chairCount: standConfiguration.chairCount,
      dividerCount: standConfiguration.dividerCount,
      dividerType: standConfiguration.dividerType,
      hasTablecloths: standConfiguration.hasTablecloths,
      installationDay: standConfiguration.installationDay,
      peopleCount: standConfiguration.peopleCount,
      placementComment: standConfiguration.placementComment,
      size: standConfiguration.size,
      tableCount: standConfiguration.tableCount,
      zone: standConfiguration.zone,

      presentDogs: standConfiguration.presentDogs.map((presentDog) => ({
        ...presentDog,
        isSterilized: presentDog.isSterilized ? "on" : "off",
        isCategorized: presentDog.isCategorized ? "on" : "off",
      })),
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });

  return [form, fields] as const;
}
