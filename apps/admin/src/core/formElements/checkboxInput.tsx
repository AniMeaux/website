import { RequiredStar } from "#core/formElements/requiredStar.tsx";
import { Icon } from "#generated/icon.tsx";
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
      className={cn(className, "flex items-center gap-0.5 cursor-pointer")}
    >
      <span className="relative flex">
        <input
          {...rest}
          ref={ref}
          type="checkbox"
          required={required}
          className="appearance-none relative w-[14px] h-[14px] rounded-0.5 border border-gray-200 bg-white inline-flex cursor-pointer transition-colors duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg checked:border-blue-500 checked:bg-blue-500"
        />

        <Icon
          id="check"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[10px]"
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
  return <div className="py-1 flex flex-wrap gap-2">{children}</div>;
}
