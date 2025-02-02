import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const Checkbox = forwardRef<
  React.ComponentRef<"input">,
  Except<React.ComponentPropsWithoutRef<"input">, "type">
>(function Checkbox({ className, ...props }, ref) {
  return (
    <span className={cn("relative flex", className)}>
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className="relative inline-flex h-[14px] w-[14px] cursor-pointer appearance-none rounded-0.5 border border-gray-200 bg-white transition-colors duration-100 checked:border-blue-500 checked:bg-blue-500 focus-visible:focus-spaced-blue-400"
      />

      <Icon
        href="icon-check-solid"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white icon-10"
      />
    </span>
  );
});
