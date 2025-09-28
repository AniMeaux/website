import { OnOff } from "#core/form-elements/field-on-off";
import { useBackIfPossible } from "#core/navigation";
import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { ActionSchema, DividerType } from "./action.js";
import type { action } from "./action.server.js";
import type { loader } from "./loader.server.js";

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
    id: "exhibitor-stand-configuration",
    constraint: getZodConstraint(ActionSchema),
    shouldValidate: "onBlur",
    lastResult:
      fetcher.data != null && "submissionResult" in fetcher.data
        ? fetcher.data.submissionResult
        : undefined,

    defaultValue: {
      chairCount: exhibitor.chairCount,
      dividerCount: exhibitor.dividerCount,
      dividerType: exhibitor.dividerType?.id ?? DividerType.none,
      hasCorner: OnOff.fromBoolean(exhibitor.hasCorner),
      hasElectricalConnection: OnOff.fromBoolean(
        exhibitor.hasElectricalConnection,
      ),
      hasTableCloths: OnOff.fromBoolean(exhibitor.hasTableCloths),
      installationDay: exhibitor.installationDay,
      peopleCount: exhibitor.peopleCount,
      sizeId: exhibitor.size.id,
      status: exhibitor.standConfigurationStatus,
      statusMessage: exhibitor.standConfigurationStatusMessage ?? "",
      tableCount: exhibitor.tableCount,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: ActionSchema }),
  });

  return [form, fields, fetcher] as const;
}

type Form = ReturnType<typeof useFormRoot>[0];
type Fields = ReturnType<typeof useFormRoot>[1];

export const [FormProvider, useForm] = createStrictContext<{
  form: Form;
  fields: Fields;
}>();
