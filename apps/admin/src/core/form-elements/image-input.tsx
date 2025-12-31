import type { ActionProps } from "#i/core/actions";
import { Action } from "#i/core/actions";
import { DenseHelper } from "#i/core/data-display/helper";
import {
  DataUrlOrDynamicImage,
  isImageOverSize,
} from "#i/core/data-display/image";
import type { IconName } from "#i/generated/icon";
import { Icon } from "#i/generated/icon";
import { cn, toBooleanAttribute } from "@animeaux/core";
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
  icon: IconName;
  label: React.ReactNode;
}) {
  return (
    <button
      {...rest}
      type="button"
      data-invalid={toBooleanAttribute(hasError)}
      className={cn(
        className,
        "flex flex-col items-center justify-center gap-0.5 rounded-1 border border-dashed border-gray-300 text-blue-500 transition-colors duration-100 ease-in-out data-[invalid=true]:border-red-500 focus-visible:border-0 focus-visible:focus-compact-blue-400 data-[invalid=true]:focus-visible:focus-compact-red-500 hover:border-gray-500 data-[invalid=true]:hover:border-red-500",
      )}
    >
      <Icon href={icon} className="text-[30px]" />
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
