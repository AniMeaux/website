import { FieldFile } from "#core/form-elements/field-file";
import { FormLayout } from "#core/layout/form-layout";
import { getFormProps, useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  Form,
  useActionData,
  useFormAction,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { ActionSchema } from "./action";
import type { action, loader } from "./route";

export function SectionForm() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fieldset] = useForm();

  return (
    <FormLayout.Form asChild>
      <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
        <FormLayout.Section>
          <FormLayout.Title>Documents</FormLayout.Title>

          <FormLayout.Row>
            <FieldFile
              label="Pièce d’identité"
              field={fieldset.identificationFile}
              currentIdField={fieldset.identificationFileCurrentId}
              defaultFile={exhibitor.identificationFile}
              helper={<FormLayout.Helper>CNI ou Passeport</FormLayout.Helper>}
            />

            <FieldFile
              label="Justificatif d’immatriculation"
              field={fieldset.kbisFile}
              currentIdField={fieldset.kbisFileCurrentId}
              defaultFile={exhibitor.kbisFile}
              helper={
                <FormLayout.Helper>Kbis, SIRENE ou récépissé</FormLayout.Helper>
              }
            />

            <FieldFile
              label="Assurance"
              field={fieldset.insuranceFile}
              currentIdField={fieldset.insuranceFileCurrentId}
              defaultFile={exhibitor.insuranceFile}
            />
          </FormLayout.Row>
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
  const { exhibitor } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-profile",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      identificationFileCurrentId: exhibitor.identificationFile?.id,
      insuranceFileCurrentId: exhibitor.insuranceFile?.id,
      kbisFileCurrentId: exhibitor.kbisFile?.id,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });

  return [form, fields] as const;
}
