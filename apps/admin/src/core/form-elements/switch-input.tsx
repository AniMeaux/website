import { cn } from "@animeaux/core";
import { forwardRef } from "react";

export const SwitchInput = forwardRef<
  React.ComponentRef<"input">,
  Omit<React.ComponentPropsWithoutRef<"input">, "type">
>(function SwitchInput({ className, ...rest }, ref) {
  return (
    <input
      {...rest}
      ref={ref}
      type="checkbox"
      className={cn(
        className,
        "inline-flex h-2 w-3 cursor-pointer appearance-none rounded-full bg-gray-500 p-[2px] transition-colors duration-100 ease-in-out after:pointer-events-none after:h-[16px] after:w-[16px] after:rounded-full after:bg-white after:transition-transform after:duration-100 after:ease-in-out checked:bg-blue-500 checked:after:translate-x-1 focus-visible:focus-spaced-blue-400",
      )}
    />
  );
});
