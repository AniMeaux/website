import { Action } from "#i/core/actions/action";
import { cn, useRefOrProp } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef, useEffect } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import type { Except } from "type-fest";

export const HelperCard = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section> & {
      color: Color;
      shouldScrollIntoView?: boolean;
    }
  >(function HelperCardRoot(
    { color, shouldScrollIntoView = false, className, ...props },
    propRef,
  ) {
    const ref = useRefOrProp(propRef);

    useEffect(() => {
      if (shouldScrollIntoView) {
        // For some reason, the call needs to be in a timeout for the scroll to
        // be done.
        setTimeout(() => {
          if (ref.current != null) {
            scrollIntoView(ref.current, {
              scrollMode: "if-needed",
              behavior: "smooth",
            });
          }
        }, 0);
      }
    }, [ref, shouldScrollIntoView]);

    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-2 rounded-1 px-2 py-1",
          CLASS_NAME_BY_COLOR[color],
          className,
        )}
      />
    );
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h3>,
    React.ComponentPropsWithoutRef<typeof Primitive.h3>
  >(function HelperCardTitle({ className, ...props }, ref) {
    return (
      <Primitive.h3
        {...props}
        ref={ref}
        className={cn("text-body-lowercase-emphasis", className)}
      />
    );
  }),

  Action: forwardRef<
    React.ComponentRef<typeof Action>,
    Except<React.ComponentPropsWithoutRef<typeof Action>, "color">
  >(function HelperCardTitle({ className, ...props }, ref) {
    return (
      <Action
        {...props}
        ref={ref}
        color="mystic"
        className={cn("justify-self-start", className)}
      />
    );
  }),
};

type Color = "alabaster" | "paleBlue";

const CLASS_NAME_BY_COLOR: Record<Color, string> = {
  alabaster: cn("bg-alabaster"),
  paleBlue: cn("bg-paleBlue"),
};
