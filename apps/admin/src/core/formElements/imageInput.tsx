import { Primitive } from "@radix-ui/react-primitive";
import { forwardRef } from "react";
import { Action, ActionProps } from "~/core/actions";
import { toBooleanAttribute } from "~/core/attributes";
import { cn } from "~/core/classNames";
import { DenseHelper } from "~/core/dataDisplay/helper";
import {
  DataUrlOrDynamicImage,
  DataUrlOrDynamicImageProps,
  isImageOverSize,
} from "~/core/dataDisplay/image";
import { Icon, IconProps } from "~/generated/icon";

const ImageInputNative = forwardRef<
  HTMLInputElement,
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "accept" | "className" | "type"
  >
>(function ImageInputNative(props, ref) {
  return (
    <input
      {...props}
      ref={ref}
      type="file"
      accept="image/*"
      className="hidden invisible"
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
        "rounded-1 border border-gray-300 border-dashed flex flex-col items-center justify-center gap-0.5 text-blue-500 transition-colors duration-100 ease-in-out hover:border-gray-500 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-outset focus-visible:ring focus-visible:ring-blue-400 data-[invalid=true]:border-red-500 data-[invalid=true]:hover:border-red-500 data-[invalid=true]:focus-visible:ring-red-500"
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
      className={cn(className, "relative overflow-hidden rounded-1 aspect-4/3")}
    />
  );
}

function ImageInputPreviewImage({
  className,
  image,
  ...rest
}: Omit<DataUrlOrDynamicImageProps, "loading">) {
  const isOverSize = isImageOverSize(image);

  return (
    <DataUrlOrDynamicImage
      {...rest}
      image={image}
      loading="eager"
      data-is-over-size={String(isOverSize)}
      className={cn(
        className,
        "peer w-full data-[is-over-size=true]:opacity-50"
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
      className="absolute top-0.5 left-0.5 w-[calc(100%-10px)] peer-data-[is-over-size=false]:hidden"
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
