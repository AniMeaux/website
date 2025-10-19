import { OnOff } from "#core/form-elements/field-on-off.js";
import { useBackIfPossible } from "#core/navigation";
import { Visibility } from "#show/visibility";
import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { actionSchema } from "./action-schema";
import type { action } from "./action.server";
import type { loader } from "./loader.server";

export function useFormRoot() {
  const { exhibitor } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useBackIfPossible({
    fallbackRedirectTo:
      fetcher.data != null && "redirectTo" in fetcher.data
        ? fetcher.data.redirectTo
        : undefined,
  });

  const [form, fields] = useFormBase({
    id: "exhibitor-situation",
    constraint: getZodConstraint(actionSchema),
    shouldValidate: "onBlur",
    lastResult:
      fetcher.data != null && "submissionResult" in fetcher.data
        ? fetcher.data.submissionResult
        : undefined,

    defaultValue: {
      isOrganizer: OnOff.fromBoolean(exhibitor.isOrganizer),
      isOrganizersFavorite: OnOff.fromBoolean(exhibitor.isOrganizersFavorite),
      isRisingStar: OnOff.fromBoolean(exhibitor.isRisingStar),
      isVisible: Visibility.fromBoolean(exhibitor.isVisible),
      locationNumber: exhibitor.locationNumber,
      standNumber: exhibitor.standNumber,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: actionSchema }),
  });

  return [form, fields, fetcher] as const;
}

type Form = ReturnType<typeof useFormRoot>[0];
type Fields = ReturnType<typeof useFormRoot>[1];

export const [FormProvider, useForm] = createStrictContext<{
  form: Form;
  fields: Fields;
}>();
