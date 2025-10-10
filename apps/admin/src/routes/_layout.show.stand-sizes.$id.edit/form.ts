import { useBackIfPossible } from "#core/navigation";
import { Visibility } from "#show/visibility.js";
import { useForm as useFormBase } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { actionSchema } from "./action-schema";
import type { action } from "./action.server.js";
import type { loader } from "./loader.server.js";

export function useFormRoot() {
  const { standSize } = useLoaderData<typeof loader>();
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
      area: standSize.area,
      isVisible: Visibility.fromBoolean(standSize.isVisible),
      label: standSize.label,
      maxCount: standSize.maxCount,
      maxDividerCount: standSize.maxDividerCount,
      maxPeopleCountAdditional:
        standSize.maxBraceletCount - standSize.maxPeopleCount,
      maxPeopleCountIncluded: standSize.maxPeopleCount,
      maxTableCount: standSize.maxTableCount,
      priceForAssociations: standSize.priceForAssociations,
      priceForServices: standSize.priceForServices,
      priceForShops: standSize.priceForShops,
    },

    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: actionSchema }),
  });

  return [form, fields, fetcher] as const;
}
