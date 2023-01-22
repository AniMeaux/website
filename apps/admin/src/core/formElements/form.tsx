import { cn } from "~/core/classNames";

export const formClassNames = {
  root: ({ hasHeader = false }: { hasHeader?: boolean } = {}) =>
    cn("flex flex-col items-end gap-4", { "pt-1 md:pt-0": hasHeader }),
  actions: () => "w-full flex flex-col gap-1",
  fields: {
    root: () => "w-full flex flex-col gap-2",
    row: () => "grid grid-cols-1 gap-2 md:grid-cols-2",
    field: {
      root: () => "flex flex-col",
      label: () => "text-caption-default text-gray-500",
      errorMessage: () => "text-caption-default text-red-500",
      helperMessage: () => "text-caption-default text-gray-500",
    },
  },
};
