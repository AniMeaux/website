import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { DividerType, createActionSchema } from "./action-schema";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function useFormRoot() {
  const { exhibitor, availableStandSizes, availableDividerTypes } =
    useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const schema = useMemo(
    () => createActionSchema({ availableStandSizes, availableDividerTypes }),
    [availableStandSizes, availableDividerTypes],
  );

  const [form, fields] = useFormBase({
    id: "exhibitor-stand",
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    defaultValue: {
      chairCount: exhibitor.chairCount,
      dividerCount: exhibitor.dividerCount,
      dividerType: exhibitor.dividerType?.id ?? DividerType.none,
      hasElectricalConnection: exhibitor.hasElectricalConnection ? "on" : "off",
      hasTablecloths: exhibitor.hasTablecloths ? "on" : "off",
      installationDay: exhibitor.installationDay,
      peopleCount: exhibitor.peopleCount,
      placementComment: exhibitor.placementComment,
      standSize: exhibitor.size.id,
      tableCount: exhibitor.tableCount,
    },

    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
  });

  return [form, fields] as const;
}

type Form = ReturnType<typeof useFormRoot>[0];
type Fields = ReturnType<typeof useFormRoot>[1];

export const [FormProvider, useForm] = createStrictContext<{
  form: Form;
  fields: Fields;
}>();
