import type { IconName } from "#i/generated/icon";
import { Icon } from "#i/generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const FileItem = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div>
  >(function FileItemRoot({ className, ...props }, ref) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn(
          "group/item relative grid aspect-3/4 grid-cols-1 rounded-2 border border-gray-200",
          className,
        )}
      />
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Icon>,
    Except<
      React.ComponentPropsWithoutRef<typeof Icon>,
      "href" | "width" | "height"
    > & {
      href?: IconName;
      mimeType?: string;
    }
  >(function FileItemIcon(
    { mimeType, href = getMimeTypeIcon(mimeType), className, ...props },
    ref,
  ) {
    return (
      <div
        className={cn(
          "col-start-1 row-start-1 grid grid-cols-1 content-center justify-items-center rounded-[inherit]",
          className,
        )}
      >
        <Icon
          {...props}
          ref={ref}
          href={href}
          width="42%"
          height={undefined}
          className="aspect-square"
        />
      </div>
    );
  }),

  Thumbnail: forwardRef<
    React.ComponentRef<"img">,
    React.ComponentPropsWithoutRef<"img">
  >(function FileItemThumbnail({ src, alt, className, ...props }, ref) {
    if (src == null) {
      return null;
    }

    return (
      <div className="col-start-1 row-start-1 grid w-full grid-cols-1 overflow-hidden rounded-[inherit]">
        <img
          {...props}
          ref={ref}
          src={src}
          alt={alt}
          className={cn("aspect-3/4 w-full object-cover", className)}
        />
      </div>
    );
  }),

  Filename: forwardRef<
    React.ComponentRef<"p">,
    React.ComponentPropsWithRef<"p">
  >(function FileItemFilename({ children, className, ...props }, ref) {
    if (children == null) {
      return null;
    }

    return (
      <p
        {...props}
        ref={ref}
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-b-[inherit] border-t border-[inherit] bg-white p-1 text-center text-caption-default",
          className,
        )}
      >
        {children}
      </p>
    );
  }),
};

function getMimeTypeIcon(mimeType?: string): IconName {
  if (mimeType == null) {
    return "icon-empty-set-light";
  }

  if (mimeType === "application/pdf") {
    return "icon-file-pdf-light";
  }

  if (mimeType.startsWith("image/")) {
    return "icon-file-image-light";
  }

  return "icon-file-image-light";
}
