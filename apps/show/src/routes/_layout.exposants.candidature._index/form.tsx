import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useActionData, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { createActionSchema } from "./action-schema";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function useForm() {
  const { availableStandSizes } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const schema = useMemo(
    () => createActionSchema(availableStandSizes),
    [availableStandSizes],
  );

  return useFormBase({
    id: "exhibitor-application",
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    lastResult: actionData,

    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
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
  SPONSORSHIP: "sponsorship",
  COMMENTS: "comments",
  PERSONAL_DATA: "personal-data",
} as const;
