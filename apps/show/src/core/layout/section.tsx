import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

type SectionWidth = "full" | "narrow" | "normal";

export const Section = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section> & {
      width?: SectionWidth;
      columnCount?: 1 | 2;
      isTitleOnly?: boolean;
    }
  >(function Section(
    {
      width = "normal",
      columnCount = 2,
      isTitleOnly = false,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Primitive.section
        {...rest}
        ref={ref}
        className={cn(
          "grid grid-cols-1",
          SECTION_WIDTH_CLASS_NAMES[width],
          isTitleOnly ? "pt-8" : "py-8",
          columnCount === 2
            ? "gap-2 sm:gap-4 md:grid-cols-2 md:items-center lg:gap-8"
            : "gap-4",
          className,
        )}
      />
    );
  }),
  {
    TextAside: forwardRef<
      React.ComponentRef<typeof Primitive.aside>,
      React.ComponentPropsWithoutRef<typeof Primitive.aside>
    >(function SectionTextAside({ className, ...rest }, ref) {
      return (
        <Primitive.aside
          {...rest}
          ref={ref}
          className={cn("grid grid-cols-1 gap-2", className)}
        />
      );
    }),

    Title: function SectionTitle({
      className,
      ...rest
    }: React.ComponentPropsWithoutRef<typeof Primitive.h2>) {
      return (
        <Primitive.h2
          {...rest}
          className={cn(
            "text-mystic text-title-small md:text-title-small",
            className,
          )}
        />
      );
    },

    Action: function SectionAction({
      isCentered = false,
      className,
      ...rest
    }: React.ComponentPropsWithoutRef<typeof Primitive.button> & {
      isCentered?: boolean;
    }) {
      return (
        <Primitive.button
          {...rest}
          className={cn(
            "justify-self-center",
            isCentered ? undefined : "md:justify-self-start",
            className,
          )}
        />
      );
    },

    ImageAside: forwardRef<
      React.ComponentRef<typeof Primitive.aside>,
      React.ComponentPropsWithoutRef<typeof Primitive.aside>
    >(function SectionImageAside({ className, ...rest }, ref) {
      return (
        <Primitive.aside
          {...rest}
          ref={ref}
          className={cn(
            "relative grid w-full max-w-sm grid-cols-1 justify-self-center md:max-w-none md:justify-self-stretch",
            className,
          )}
        />
      );
    }),
  },
);

const SECTION_WIDTH_CLASS_NAMES: Record<SectionWidth, string> = {
  full: "",
  narrow: cn("px-safe-page-narrow"),
  normal: cn("px-safe-page-narrow md:px-safe-page-normal"),
};
