import { FieldTextarea } from "#core/form-elements/field-textarea";
import { FormLayout } from "#core/layout/form-layout";
import { FieldActivityField } from "#exhibitors/activity-field/field";
import { FieldActivityTarget } from "#exhibitors/activity-target/field";
import { FieldLogo } from "#exhibitors/field-logo";
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
import { FieldLinks } from "./field-links";
import type { action, loader } from "./route";

export function SectionForm() {
  const { profile } = useLoaderData<typeof loader>();
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fieldset] = useForm();

  return (
    <FormLayout.Form asChild>
      <Form {...getFormProps(form)} method="POST" encType="multipart/form-data">
        <FormLayout.Section>
          <FieldLogo
            label="Logo"
            field={fieldset.logo}
            defaultLogo={{ path: profile.logoPath, alt: profile.name }}
          />

          <FieldActivityTarget
            label="Cibles"
            field={fieldset.activityTargets}
          />

          <FieldActivityField
            label="Domaines d’activités"
            field={fieldset.activityFields}
          />

          <FieldLinks
            form={form}
            label="Liens du site internet ou réseaux sociaux"
            field={fieldset.links}
          />

          <FieldTextarea
            label="Description"
            field={fieldset.description}
            rows={3}
          />
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
  const { profile } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-profile",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      activityTargets: profile.activityTargets,
      activityFields: profile.activityFields,
      links: profile.links,
      description: profile.description,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });

  return [form, fields] as const;
}
