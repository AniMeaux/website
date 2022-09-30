export const formClassNames = {
  root: () => "w-full flex flex-col gap-4",
  fields: {
    root: () => "flex flex-col gap-2",
    field: {
      root: () => "flex flex-col",
      label: () => "text-caption-default text-gray-500",
      errorMessage: () => "text-caption-default text-red-500",
    },
  },
};
