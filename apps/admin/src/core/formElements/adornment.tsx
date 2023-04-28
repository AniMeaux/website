import { Primitive } from "@radix-ui/react-primitive";
import { forwardRef } from "react";
import { cn } from "~/core/classNames";

export function Adornment({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.span>) {
  return (
    <Primitive.span
      {...rest}
      className={cn(
        "w-3 h-3 flex-none flex items-center justify-center text-gray-600",
        className
      )}
    />
  );
}

export const ActionAdornment = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function ActionAdornment({ ...props }, ref) {
  return (
    <Adornment asChild>
      <button
        {...props}
        ref={ref}
        type="button"
        className="rounded-full pointer-events-auto cursor-pointer transition-colors duration-100 ease-in-out hover:bg-gray-100 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400"
      />
    </Adornment>
  );
});

export function AdornmentContainer({
  side,
  children,
}: {
  side: "left" | "right";
  children?: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute top-0 p-0.5 flex items-center pointer-events-none",
        {
          "left-0": side === "left",
          "right-0": side === "right",
        }
      )}
    >
      {children}
    </span>
  );
}
