import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionSchema } from "./action";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function useFormRoot() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const [form, fields] = useFormBase({
    id: "exhibitor-stand",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      chairCount: exhibitor.chairCount,
      dividerCount: exhibitor.dividerCount,
      dividerType: exhibitor.dividerType,
      hasElectricalConnection: exhibitor.hasElectricalConnection ? "on" : "off",
      hasTablecloths: exhibitor.hasTablecloths ? "on" : "off",
      installationDay: exhibitor.installationDay,
      peopleCount: exhibitor.peopleCount,
      placementComment: exhibitor.placementComment,
      size: exhibitor.size,
      tableCount: exhibitor.tableCount,
      zone: exhibitor.zone,
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
