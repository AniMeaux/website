import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

type SectionWidth = "full" | "narrow" | "normal";
type SectionHeight = "large" | "normal";

export const Section = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section> & {
      width?: SectionWidth;
      height?: SectionHeight;
      columnCount?: 1 | 2;
      isTitleOnly?: boolean;
    }
  >(function SectionRoot(
    {
      width = "normal",
      height = "normal",
      columnCount = 2,
      isTitleOnly = false,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1",
          SECTION_ROOT_WIDTH_CLASS_NAMES[width],
          isTitleOnly
            ? height === "normal"
              ? "pt-4"
              : "pt-8"
            : height === "normal"
              ? "py-4"
              : "py-8",
          columnCount === 2
            ? "gap-2 sm:gap-4 md:grid-cols-2 md:items-center lg:gap-8"
            : "gap-4",
          className,
        )}
      />
    );
  }),

  TextAside: forwardRef<
    React.ComponentRef<typeof Primitive.aside>,
    React.ComponentPropsWithoutRef<typeof Primitive.aside>
  >(function SectionTextAside({ className, ...props }, ref) {
    return (
      <Primitive.aside
        {...props}
        ref={ref}
        className={cn("grid grid-cols-1 gap-2", className)}
      />
    );
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h2>,
    React.ComponentPropsWithoutRef<typeof Primitive.h2>
  >(function SectionTitle({ className, ...props }, ref) {
    return (
      <Primitive.h2
        {...props}
        ref={ref}
        className={cn(
          "text-mystic text-title-small md:text-title-small",
          className,
        )}
      />
    );
  }),

  Action: forwardRef<
    React.ComponentRef<typeof Primitive.button>,
    React.ComponentPropsWithoutRef<typeof Primitive.button> & {
      isCentered?: boolean;
    }
  >(function SectionAction({ isCentered = false, className, ...props }, ref) {
    return (
      <Primitive.button
        {...props}
        ref={ref}
        className={cn(
          "justify-self-center",
          isCentered ? undefined : "md:justify-self-start",
          className,
        )}
      />
    );
  }),

  ImageAside: forwardRef<
    React.ComponentRef<typeof Primitive.aside>,
    React.ComponentPropsWithoutRef<typeof Primitive.aside>
  >(function SectionImageAside({ className, ...props }, ref) {
    return (
      <Primitive.aside
        {...props}
        ref={ref}
        className={cn(
          "relative grid w-full max-w-sm grid-cols-1 justify-self-center md:max-w-none md:justify-self-stretch",
          className,
        )}
      />
    );
  }),
};

const SECTION_ROOT_WIDTH_CLASS_NAMES: Record<SectionWidth, string> = {
  full: "",
  narrow: cn("px-safe-page-narrow"),
  normal: cn("px-safe-page-narrow md:px-safe-page-normal"),
};
