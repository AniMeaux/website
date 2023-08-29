import { cn } from "#core/classNames.ts";
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
        "appearance-none w-3 h-2 rounded-full bg-gray-500 inline-flex p-[2px] cursor-pointer transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white checked:bg-blue-500 after:w-[16px] after:h-[16px] after:rounded-full after:bg-white after:pointer-events-none after:transition-transform after:duration-100 after:ease-in-out checked:after:translate-x-1",
      )}
    />
  );
});
