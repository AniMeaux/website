import { forwardRef } from "react";
import { cn } from "~/core/classNames";
import { RequiredStart } from "~/core/formElements/requiredStart";

type RadioInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "defaultChecked"
> & {
  label: React.ReactNode;

  // Allow null.
  defaultChecked?:
    | null
    | React.InputHTMLAttributes<HTMLInputElement>["defaultChecked"];
};

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  function RadioInput(
    { label, required = false, defaultChecked, className, ...rest },
    ref
  ) {
    return (
      <label
        className={cn(className, "flex items-center gap-0.5 cursor-pointer")}
      >
        <input
          {...rest}
          ref={ref}
          type="radio"
          required={required}
          defaultChecked={defaultChecked ?? undefined}
          className="appearance-none relative w-[14px] h-[14px] rounded-full border border-gray-200 bg-blue-500 inline-flex cursor-pointer focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-[12px] before:w-[12px] before:rounded-full before:scale-100 before:bg-white before:transition-transform before:duration-100 before:ease-in-out checked:border-blue-500 checked:before:scale-[.33]"
        />

        <span>
          {label} {required ? <RequiredStart /> : null}
        </span>
      </label>
    );
  }
);
