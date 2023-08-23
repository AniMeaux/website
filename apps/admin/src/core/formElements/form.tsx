import { cn } from "#core/classNames.ts";
import { ErrorsInlineHelper } from "#core/dataDisplay/errors.tsx";
import { Primitive } from "#core/primitives.tsx";

export function Form({
  className,
  hasHeader = false,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.form> & {
  hasHeader?: boolean;
}) {
  return (
    <Primitive.form
      {...rest}
      className={cn(
        "flex flex-col items-end gap-4",
        hasHeader ? "pt-1 md:pt-0" : undefined,
        className
      )}
    />
  );
}

Form.Action = function FormAction({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.button>) {
  return (
    <Primitive.button
      {...rest}
      type="submit"
      className={cn("w-full md:w-auto", className)}
    />
  );
};

Form.Fields = function FormFields({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.div>) {
  return (
    <Primitive.div
      {...rest}
      className={cn("w-full flex flex-col gap-2", className)}
    />
  );
};

Form.Row = function FormRow({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.div>) {
  return (
    <Primitive.div
      {...rest}
      className={cn("grid grid-cols-1 gap-2 md:grid-cols-2", className)}
    />
  );
};

Form.Field = function FormField({
  className,
  isInline = false,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.div> & {
  isInline?: boolean;
}) {
  return (
    <Primitive.div
      {...rest}
      className={cn(
        isInline
          ? "grid grid-cols-1 grid-flow-col items-center gap-1"
          : "flex flex-col",
        className
      )}
    />
  );
};

Form.Label = function FormLabel({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.label>) {
  return (
    <Primitive.label
      {...rest}
      className={cn(
        "text-caption-default text-gray-500 [label&]:cursor-pointer",
        className
      )}
    />
  );
};

Form.ErrorMessage = function FormErrorMessage({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.p>) {
  return (
    <Primitive.p
      {...rest}
      className={cn("text-caption-default text-red-500", className)}
    />
  );
};

Form.HelperMessage = function FormHelperMessage({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.p>) {
  return (
    <Primitive.p
      {...rest}
      className={cn("text-caption-default text-gray-500", className)}
    />
  );
};

Form.Errors = ErrorsInlineHelper;
