import { forwardRef } from "react";
import { cn } from "~/core/classNames";
import { RequiredStart } from "~/core/formElements/requiredStart";
import { Icon } from "~/generated/icon";

type CheckboxInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "defaultChecked"
> & {
  label: React.ReactNode;

  // Allow null.
  defaultChecked?:
    | null
    | React.InputHTMLAttributes<HTMLInputElement>["defaultChecked"];
};

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  function CheckboxInput(
    { label, required = false, defaultChecked, className, ...rest },
    ref
  ) {
    return (
      <label
        className={cn(className, "flex items-center gap-0.5 cursor-pointer")}
      >
        <span className="relative flex">
          <input
            {...rest}
            ref={ref}
            type="checkbox"
            required={required}
            defaultChecked={defaultChecked ?? undefined}
            className="appearance-none relative w-[14px] h-[14px] rounded-0.5 border border-gray-200 bg-white inline-flex cursor-pointer transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white checked:border-blue-500 checked:bg-blue-500"
          />

          <Icon
            id="check"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px]"
          />
        </span>

        <span>
          {label} {required ? <RequiredStart /> : null}
        </span>
      </label>
    );
  }
);
