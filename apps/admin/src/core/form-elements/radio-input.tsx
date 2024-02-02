import { RequiredStar } from "#core/form-elements/required-star";
import { cn } from "@animeaux/core";
import { forwardRef } from "react";

export const RadioInput = forwardRef<
  React.ComponentRef<"input">,
  Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
    label: React.ReactNode;
  }
>(function RadioInput({ label, required = false, className, ...rest }, ref) {
  return (
    <label
      className={cn(className, "flex cursor-pointer items-center gap-0.5")}
    >
      <input
        {...rest}
        ref={ref}
        type="radio"
        required={required}
        className="relative inline-flex h-[14px] w-[14px] cursor-pointer appearance-none rounded-full border border-gray-200 bg-blue-500 before:absolute before:left-1/2 before:top-1/2 before:h-[12px] before:w-[12px] before:-translate-x-1/2 before:-translate-y-1/2 before:scale-100 before:rounded-full before:bg-white before:transition-transform before:duration-100 before:ease-in-out checked:border-blue-500 checked:before:scale-[.33] focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
      />

      <span>
        {label} {required ? <RequiredStar /> : null}
      </span>
    </label>
  );
});

export function RadioInputList({ children }: { children?: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2 py-1">{children}</div>;
}
