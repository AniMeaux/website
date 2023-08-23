import { cn } from "#core/classNames.ts";
import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { forwardRef } from "react";

export const RadioInput = forwardRef<
  React.ComponentRef<"input">,
  Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
    label: React.ReactNode;
  }
>(function RadioInput({ label, required = false, className, ...rest }, ref) {
  return (
    <label
      className={cn(className, "flex items-center gap-0.5 cursor-pointer")}
    >
      <input
        {...rest}
        ref={ref}
        type="radio"
        required={required}
        className="appearance-none relative w-[14px] h-[14px] rounded-full border border-gray-200 bg-blue-500 inline-flex cursor-pointer focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-[12px] before:w-[12px] before:rounded-full before:scale-100 before:bg-white before:transition-transform before:duration-100 before:ease-in-out checked:border-blue-500 checked:before:scale-[.33]"
      />

      <span>
        {label} {required ? <RequiredStar /> : null}
      </span>
    </label>
  );
});

export function RadioInputList({ children }: { children?: React.ReactNode }) {
  return <div className="py-1 flex flex-wrap gap-2">{children}</div>;
}
