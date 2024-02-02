import type { ActionProps } from "#core/actions";
import { Action } from "#core/actions";
import { toBooleanAttribute } from "#core/attributes";
import { DenseHelper } from "#core/data-display/helper";
import {
  DataUrlOrDynamicImage,
  isImageOverSize,
} from "#core/data-display/image";
import type { IconProps } from "#generated/icon";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

const ImageInputNative = forwardRef<
  React.ComponentRef<"input">,
  Omit<React.ComponentPropsWithoutRef<"input">, "accept" | "className" | "type">
>(function ImageInputNative(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="file"
      accept="image/*"
      className="invisible hidden"
    />
  );
});

function ImageInputTrigger({
  className,
  hasError = false,
  icon,
  label,
  ...rest
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type"> & {
  hasError?: boolean;
  icon: IconProps["id"];
  label: React.ReactNode;
}) {
  return (
    <button
      {...rest}
      type="button"
      data-invalid={toBooleanAttribute(hasError)}
      className={cn(
        className,
        "flex flex-col items-center justify-center gap-0.5 rounded-1 border border-dashed border-gray-300 text-blue-500 transition-colors duration-100 ease-in-out data-[invalid=true]:border-red-500 focus-visible:border-0 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-outset data-[invalid=true]:focus-visible:ring-red-500 hover:border-gray-500 data-[invalid=true]:hover:border-red-500",
      )}
    >
      <Icon id={icon} className="text-[30px]" />
      <span className="text-body-emphasis">{label}</span>
    </button>
  );
}

function ImageInputPreview({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.div>) {
  return (
    <Primitive.div
      {...rest}
      className={cn(className, "relative aspect-4/3 overflow-hidden rounded-1")}
    />
  );
}

function ImageInputPreviewImage({
  className,
  image,
  ...rest
}: Omit<
  React.ComponentPropsWithoutRef<typeof DataUrlOrDynamicImage>,
  "loading"
>) {
  const isOverSize = isImageOverSize(image);

  return (
    <DataUrlOrDynamicImage
      {...rest}
      image={image}
      loading="eager"
      data-is-over-size={String(isOverSize)}
      className={cn(
        className,
        "peer w-full data-[is-over-size=true]:opacity-50",
      )}
    />
  );
}

function ImageInputPreviewOverSizeHelper({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <DenseHelper
      variant="error"
      className="absolute left-0.5 top-0.5 w-[calc(100%-10px)] peer-data-[is-over-size=false]:hidden"
    >
      {children}
    </DenseHelper>
  );
}

function ImageInputPreviewAction({
  className,
  ...rest
}: Omit<ActionProps, "color" | "type" | "variant">) {
  return (
    <Action
      {...rest}
      type="button"
      variant="translucid"
      color="black"
      className={cn(className, "absolute bottom-0.5 right-0.5")}
    />
  );
}

export const ImageInput = {
  Native: ImageInputNative,
  Trigger: ImageInputTrigger,
  Preview: ImageInputPreview,
  PreviewImage: ImageInputPreviewImage,
  PreviewOverSizeHelper: ImageInputPreviewOverSizeHelper,
  PreviewAction: ImageInputPreviewAction,
};
