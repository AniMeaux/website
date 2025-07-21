import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData } from "@remix-run/react";
import { ActionSchema } from "./action-schema";
import type { action } from "./action.server";

export function useForm() {
  const actionData = useActionData<typeof action>();

  return useFormBase({
    id: "exhibitor-application",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });
}

export const [FieldsetsProvider, useFieldsets] = createStrictContext<{
  fieldsets: Fieldsets;
}>();

type Fieldsets = ReturnType<typeof useForm>[1];

export const FieldsetId = {
  DOCUMENTS: "documents",
  CONTACT: "contact",
  STRUCTURE: "structure",
  PARTICIPATION: "participation",
  PARTNERSHIP: "partnership",
  COMMENTS: "comments",
} as const;
