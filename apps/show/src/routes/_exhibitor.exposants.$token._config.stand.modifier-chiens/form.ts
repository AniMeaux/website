import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionSchema } from "./action";
import type { action, loader } from "./route";

export function useFormRoot() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-dogs",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      dogs: exhibitor.dogs.map((dog) => ({
        ...dog,
        isSterilized: dog.isSterilized ? "on" : "off",
        isCategorized: dog.isCategorized ? "on" : "off",
      })),
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });

  return [form, fields] as const;
}

type Form = ReturnType<typeof useFormRoot>[0];
type Fields = ReturnType<typeof useFormRoot>[1];

export const [FormProvider, useForm] = createStrictContext<{
  form: Form;
  fields: Fields;
}>();
