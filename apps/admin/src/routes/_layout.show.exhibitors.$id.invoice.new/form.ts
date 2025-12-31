import { useBackIfPossible } from "#i/core/navigation";
import { InvoiceStatus } from "#i/show/invoice/status.js";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import { actionSchema } from "./action";
import type { action } from "./route";

export function useFormRoot() {
  const fetcher = useFetcher<typeof action>();

  useBackIfPossible({
    fallbackRedirectTo:
      fetcher.data != null && "redirectTo" in fetcher.data
        ? fetcher.data.redirectTo
        : undefined,
  });

  const [form, fields] = useFormBase({
    id: "exhibitor-new-invoice",
    constraint: getZodConstraint(actionSchema),
    shouldValidate: "onBlur",
    lastResult:
      fetcher.data != null && "submissionResult" in fetcher.data
        ? fetcher.data.submissionResult
        : undefined,

    defaultValue: {
      status: InvoiceStatus.Enum.TO_PAY,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: actionSchema }),
  });

  return [form, fields, fetcher] as const;
}
