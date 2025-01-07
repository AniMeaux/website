import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useLoaderData } from "@remix-run/react";
import { ActionSchema } from "./action";
import type { action, loader } from "./route";

export function useFormRoot() {
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
      hasElectricalConnection: standConfiguration.hasElectricalConnection
        ? "on"
        : "off",
      hasTablecloths: standConfiguration.hasTablecloths ? "on" : "off",
      installationDay: standConfiguration.installationDay,
      peopleCount: standConfiguration.peopleCount,
      placementComment: standConfiguration.placementComment,
      size: standConfiguration.size,
      tableCount: standConfiguration.tableCount,
      zone: standConfiguration.zone,
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
