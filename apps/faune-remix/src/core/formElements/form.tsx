export const formClassNames = {
  root: () => "w-full py-1 grid grid-cols-1 auto-rows-auto gap-2",
  fields: {
    root: () => "grid grid-cols-1 auto-rows-auto gap-1",
    field: {
      root: () => "grid grid-cols-1 auto-rows-auto",
      label: () => "text-caption-default text-gray-500",
      errorMessage: () => "text-caption-default text-red-500",
    },
  },
};
