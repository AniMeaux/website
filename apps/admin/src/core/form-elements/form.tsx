import { ErrorsInlineHelper } from "#core/data-display/errors";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";

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
        className,
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
      className={cn("flex w-full flex-col gap-2", className)}
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
      className={cn("grid auto-cols-fr gap-2 md:grid-flow-col", className)}
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
          ? "grid grid-flow-col grid-cols-1 items-center gap-1"
          : "flex flex-col",
        className,
      )}
    />
  );
};

Form.Label = function FormLabel({
  htmlFor,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Primitive.label>) {
  const Component = htmlFor == null ? Primitive.span : Primitive.label;

  return (
    <Component
      {...props}
      htmlFor={htmlFor}
      className={cn(
        "text-gray-500 text-caption-default",
        htmlFor != null ? "cursor-pointer" : undefined,
        className,
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
      className={cn("text-red-500 text-caption-default", className)}
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
      className={cn("text-gray-500 text-caption-default", className)}
    />
  );
};

Form.Errors = ErrorsInlineHelper;
