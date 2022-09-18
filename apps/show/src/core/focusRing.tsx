import { cn } from "~/core/classNames";

export const focusRingClassNames = () =>
  cn(
    "transition-shadow duration-100 ease-in-out",
    "ring-transparent ring-2 ring-offset-gray-50",
    "hover:ring-gray-300 hover:ring-offset-12",
    "focus:outline-none focus-visible:ring-brandBlue focus-visible:ring-offset-12"
  );
