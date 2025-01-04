import { cn, createHookContext } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const ChipList = forwardRef<
  React.ComponentRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(function ChipList({ className, ...props }, ref) {
  return (
    <Primitive.div
      {...props}
      ref={ref}
      className={cn("flex flex-wrap gap-0.5", className)}
    />
  );
});

export const Chip = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span> & {
      isHighlighted?: boolean;
    }
  >(function ChipRoot({ isHighlighted, className, ...props }, ref) {
    return (
      <ContextProvider isHighlighted={isHighlighted}>
        <Primitive.span
          {...props}
          ref={ref}
          className={cn(
            "grid grid-cols-2-auto items-center gap-0.5 rounded-0.5 px-0.5 transition-colors duration-slow",
            isHighlighted
              ? "bg-mystic text-white"
              : "ring-1 ring-inset ring-alabaster",
            className,
          )}
        />
      </ContextProvider>
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function ChipIcon({ className, ...props }, ref) {
    const { isHighlighted } = useContext();

    if (isHighlighted) {
      return null;
    }

    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn("icon-16", className)}
      />
    );
  }),

  IconHighlighted: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function ChipIconHighlighted({ className, ...props }, ref) {
    const { isHighlighted } = useContext();

    if (!isHighlighted) {
      return null;
    }

    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn("icon-16", className)}
      />
    );
  }),

  Label: forwardRef<
    React.ComponentRef<typeof Primitive.span>,
    React.ComponentPropsWithoutRef<typeof Primitive.span>
  >(function ChipIcon({ className, ...props }, ref) {
    const { isHighlighted } = useContext();

    return (
      <Primitive.span
        {...props}
        ref={ref}
        className={cn(
          isHighlighted
            ? "text-caption-lowercase-emphasis"
            : "text-caption-lowercase-default",
          className,
        )}
      />
    );
  }),
};

const [ContextProvider, useContext] = createHookContext(
  ({ isHighlighted = false }: { isHighlighted?: boolean }) => ({
    isHighlighted,
  }),
);
