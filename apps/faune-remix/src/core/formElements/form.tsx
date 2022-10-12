export const formClassNames = {
  root: () => "w-full py-1 grid grid-cols-1 gap-2",
  fields: {
    root: () => "grid grid-cols-1 gap-1",
    field: {
      root: () => "grid grid-cols-1",
      label: () => "text-caption-default text-gray-500",
      errorMessage: () => "text-caption-default text-red-500",
    },
  },
};
