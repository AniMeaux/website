import { FormLayout } from "#i/core/layout/form-layout";
import { getFormProps } from "@conform-to/react";
import { Form, useFormAction, useNavigation } from "@remix-run/react";
import { FieldsetStand } from "./fieldset-stand";
import { FormProvider, useFormRoot } from "./form";

export function SectionForm() {
  const formAction = useFormAction();
  const navigation = useNavigation();
  const [form, fields] = useFormRoot();

  return (
    <FormProvider form={form} fields={fields}>
      <FormLayout.Form asChild>
        <Form {...getFormProps(form)} method="POST">
          <FieldsetStand />

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
