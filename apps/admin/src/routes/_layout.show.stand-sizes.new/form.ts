import { useBackIfPossible } from "#core/navigation";
import { actionSchema } from "#show/stand-size/action-schema";
import { Visibility } from "#show/visibility.js";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher } from "@remix-run/react";
import type { action } from "./action.server.js";

export function useFormRoot() {
  const fetcher = useFetcher<typeof action>();

  useBackIfPossible({
    fallbackRedirectTo:
      fetcher.data != null && "redirectTo" in fetcher.data
        ? fetcher.data.redirectTo
        : undefined,
  });

  const [form, fields] = useFormBase({
    id: "stand-size-edit",
    constraint: getZodConstraint(actionSchema),
    shouldValidate: "onBlur",
    lastResult:
      fetcher.data != null && "submissionResult" in fetcher.data
        ? fetcher.data.submissionResult
        : undefined,

    defaultValue: {
      isVisible: Visibility.Enum.HIDDEN,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: actionSchema }),
  });

  return [form, fields, fetcher] as const;
}
