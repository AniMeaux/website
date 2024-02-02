import { RequiredStar } from "#core/form-elements/required-star";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { forwardRef } from "react";

type CheckboxInputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type"
> & {
  label: React.ReactNode;
};

export const CheckboxInput = forwardRef<
  React.ComponentRef<"input">,
  CheckboxInputProps
>(function CheckboxInput({ label, required = false, className, ...rest }, ref) {
  return (
    <label
      className={cn(className, "flex cursor-pointer items-center gap-0.5")}
    >
      <span className="relative flex">
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          required={required}
          className="relative inline-flex h-[14px] w-[14px] cursor-pointer appearance-none rounded-0.5 border border-gray-200 bg-white transition-colors duration-100 ease-in-out checked:border-blue-500 checked:bg-blue-500 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg"
        />

        <Icon
          id="check"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white"
        />
      </span>

      <span>
        {label} {required ? <RequiredStar /> : null}
      </span>
    </label>
  );
});

export function CheckboxInputList({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex flex-wrap gap-2 py-1">{children}</div>;
}
