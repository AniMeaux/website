import { OnOff } from "#core/form-elements/field-on-off";
import { useBackIfPossible } from "#core/navigation";
import { createStrictContext } from "@animeaux/core";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { ActionSchema } from "./action";
import type { action, loader } from "./route";

export function useFormRoot() {
  const { exhbitor } = useLoaderData<typeof loader>();
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
      chairCount: exhbitor.chairCount,
      dividerCount: exhbitor.dividerCount,
      dividerType: exhbitor.dividerType,
      hasElectricalConnection: OnOff.fromBoolean(
        exhbitor.hasElectricalConnection,
      ),
      hasTablecloths: OnOff.fromBoolean(exhbitor.hasTablecloths),
      installationDay: exhbitor.installationDay,
      peopleCount: exhbitor.peopleCount,
      size: exhbitor.size,
      status: exhbitor.standConfigurationStatus,
      statusMessage: exhbitor.standConfigurationStatusMessage ?? "",
      tableCount: exhbitor.tableCount,
      zone: exhbitor.zone,
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
