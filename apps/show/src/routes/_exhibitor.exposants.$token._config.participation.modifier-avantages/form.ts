import { createStrictContext } from "@animeaux/core"
import { useForm as useFormBase } from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
import { useActionData, useLoaderData } from "@remix-run/react"
import { useMemo } from "react"

import type { action } from "./action.server.js"
import { createActionSchema } from "./action-schema.js"
import type { loader } from "./loader.server.js"

export function useFormRoot() {
  const { exhibitor } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  const schema = useMemo(
    () => createActionSchema({ peopleCount: exhibitor.peopleCount }),
    [exhibitor.peopleCount],
  )

  const [form, fields] = useFormBase({
    id: "exhibitor-perks",
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      appetizerPeopleCount: exhibitor.appetizerPeopleCount,
      breakfastPeopleCountSaturday: exhibitor.breakfastPeopleCountSaturday,
      breakfastPeopleCountSunday: exhibitor.breakfastPeopleCountSunday,
    },

    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  })

  return [form, fields] as const
}

type Form = ReturnType<typeof useFormRoot>[0]
type Fields = ReturnType<typeof useFormRoot>[1]

export const [FormProvider, useForm] = createStrictContext<{
  form: Form
  fields: Fields
}>()
