import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useLoaderData } from "@remix-run/react";
import { actionSchema } from "./action";
import type { action, loader } from "./route";

export function useFormRoot() {
  const { exhibitor, application } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-billing",
    constraint: getZodConstraint(actionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      sameAsStructure:
        exhibitor.billingAddress === application.structureAddress &&
        exhibitor.billingCity === application.structureCity &&
        exhibitor.billingZipCode === application.structureZipCode &&
        exhibitor.billingCountry === application.structureCountry
          ? "on"
          : "off",

      address: exhibitor.billingAddress,
      city: exhibitor.billingCity,
      zipCode: exhibitor.billingZipCode,
      country: exhibitor.billingCountry,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: actionSchema }),
  });

  return [form, fields] as const;
}

type Form = ReturnType<typeof useFormRoot>[0];
type Fields = ReturnType<typeof useFormRoot>[1];

export const [FormProvider, useForm] = createStrictContext<{
  form: Form;
  fields: Fields;
}>();
