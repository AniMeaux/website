import { FormLayout } from "#core/layout/form-layout";
import { getFormProps } from "@conform-to/react";
import { Form, useFormAction, useNavigation } from "@remix-run/react";
import { FieldsetDescription } from "./fieldset-description";
import { FieldsetPublicProfile } from "./fieldset-public-profile";
import { FormProvider, useFormRoot } from "./form";

export function SectionForm() {
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fields] = useFormRoot();

  return (
    <FormProvider form={form} fields={fields}>
      <FormLayout.Form asChild>
        <Form
          {...getFormProps(form)}
          method="POST"
          encType="multipart/form-data"
        >
          <FieldsetPublicProfile />

          <FormLayout.SectionSeparator />

          <FieldsetDescription />

          <FormLayout.SectionSeparator />

          <FormLayout.Action
            isLoading={
              navigation.state !== "idle" &&
              navigation.formAction === formAction
            }
          >
            Enregistrer
          </FormLayout.Action>
        </Form>
      </FormLayout.Form>
    </FormProvider>
  );
}
