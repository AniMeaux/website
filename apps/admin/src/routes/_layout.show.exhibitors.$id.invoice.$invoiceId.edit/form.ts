import { toIsoDateValue } from "#core/dates.js";
import { useBackIfPossible } from "#core/navigation";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { actionSchema } from "./action";
import type { action } from "./action.server.js";
import type { loader } from "./loader.server.js";

export function useFormRoot() {
  const { invoice } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  useBackIfPossible({
    fallbackRedirectTo:
      fetcher.data != null && "redirectTo" in fetcher.data
        ? fetcher.data.redirectTo
        : undefined,
  });

  const [form, fields] = useFormBase({
    id: "exhibitor-invoice",
    constraint: getZodConstraint(actionSchema),
    shouldValidate: "onBlur",
    lastResult:
      fetcher.data != null && "submissionResult" in fetcher.data
        ? fetcher.data.submissionResult
        : undefined,

    defaultValue: {
      amount: invoice.amount,
      dueDate: toIsoDateValue(invoice.dueDate),
      number: invoice.number,
      status: invoice.status,
      url: invoice.url,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: actionSchema }),
  });

  return [form, fields, fetcher] as const;
}
