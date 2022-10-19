export const formClassNames = {
  root: () => "pt-1 pb-2 flex flex-col gap-2 md:py-1",
  fields: {
    root: () => "flex flex-col gap-1",
    field: {
      root: () => "flex flex-col",
      label: () => "text-caption-default text-gray-500",
      errorMessage: () => "text-caption-default text-red-500",
    },
  },
};
