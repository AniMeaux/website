import { cn } from "@animeaux/core";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const Switch = forwardRef<
  React.ComponentRef<"input">,
  Except<React.ComponentPropsWithoutRef<"input">, "type">
>(function Switch({ className, ...props }, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      className={cn(
        "inline-flex h-2 w-3 cursor-pointer appearance-none rounded-full bg-gray-500 p-[2px] transition-colors duration-100 checked:bg-blue-500 focus-visible:focus-spaced-blue-400",

        // Thumb.
        "after:pointer-events-none after:aspect-square after:w-[16px] after:rounded-full after:bg-white after:transition-transform after:duration-100 checked:after:translate-x-1",
        className,
      )}
    />
  );
});
