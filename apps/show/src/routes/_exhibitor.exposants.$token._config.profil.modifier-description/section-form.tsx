import { getFormProps } from "@conform-to/react"
import { Form, useFormAction, useNavigation } from "@remix-run/react"

import { FormLayout } from "#i/core/layout/form-layout.js"

import { FieldsetDescription } from "./fieldset-description.js"
import { FormProvider, useFormRoot } from "./form.js"

export function SectionForm() {
  const formAction = useFormAction()
  const navigation = useNavigation()
  const [form, fields] = useFormRoot()

  return (
    <FormProvider form={form} fields={fields}>
      <FormLayout.Form asChild>
        <Form {...getFormProps(form)} method="POST">
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
  )
}
