import { Action } from "#core/actions/action";
import { HelperCard } from "#core/layout/helper-card";
import { HorizontalSeparator } from "#core/layout/separator";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { Link } from "@remix-run/react";
import { forwardRef } from "react";
import type { Except } from "type-fest";

export const FormLayout = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section>
  >(function FormLayoutRoot({ className, ...props }, ref) {
    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start lg:gap-8",
          className,
        )}
      />
    );
  }),

  Form: forwardRef<
    React.ComponentRef<typeof Primitive.form>,
    React.ComponentPropsWithoutRef<typeof Primitive.form>
  >(function FormLayoutForm({ className, ...props }, ref) {
    return (
      <Primitive.form
        {...props}
        ref={ref}
        className={cn("grid grid-cols-1 gap-4", className)}
      />
    );
  }),

  AsideHelper: {
    ...HelperCard,

    Root: forwardRef<
      React.ComponentRef<typeof Primitive.aside>,
      React.ComponentPropsWithoutRef<typeof Primitive.aside>
    >(function FormLayoutAsideHelperRoot({ className, ...props }, ref) {
      return (
        <HelperCard.Root color="alabaster" asChild>
          <Primitive.aside
            {...props}
            ref={ref}
            className={cn(
              "row-start-1 md:sticky md:top-4 md:col-start-2 md:w-[300px]",
              className,
            )}
          />
        </HelperCard.Root>
      );
    }),
  },

  Nav: forwardRef<
    React.ComponentRef<typeof Primitive.aside>,
    React.ComponentPropsWithoutRef<typeof Primitive.aside>
  >(function FormLayoutNav({ className, ...props }, ref) {
    return (
      <Primitive.aside
        {...props}
        ref={ref}
        className={cn(
          "sticky top-4 hidden grid-cols-1 rounded-1 bg-alabaster px-2 py-1 md:grid md:w-[248px]",
          className,
        )}
      />
    );
  }),

  NavItem: function FormLayoutNavItem({
    sectionId,
    isComplete,
    children,
  }: React.PropsWithChildren<{ sectionId: string; isComplete: boolean }>) {
    return (
      <Link
        to={{ hash: `#${sectionId}` }}
        replace
        className={cn(
          "grid grid-cols-fr-auto items-center gap-1 rounded-0.5 px-1 py-0.5 can-hover:focus-visible:focus-compact",
        )}
      >
        {children}

        <Icon
          id="check-solid"
          className={cn("icon-16", isComplete ? "opacity-100" : "opacity-0")}
        />
      </Link>
    );
  },

  Section: forwardRef<
    React.ComponentRef<typeof Primitive.section>,
    React.ComponentPropsWithoutRef<typeof Primitive.section>
  >(function FormLayoutSection({ className, ...props }, ref) {
    return (
      <Primitive.section
        {...props}
        ref={ref}
        className={cn("grid grid-cols-1 gap-2", className)}
      />
    );
  }),

  SectionSeparator: function FormLayoutSectionSeparator() {
    return <HorizontalSeparator color="alabaster" />;
  },

  FieldSeparator: function FormLayoutFieldSeparator() {
    return <hr className="border-t border-alabaster" />;
  },

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h2>,
    React.ComponentPropsWithoutRef<typeof Primitive.h2>
  >(function FormLayoutTitle({ className, ...props }, ref) {
    return (
      <Primitive.h2
        {...props}
        ref={ref}
        className={cn("text-mystic text-title-item", className)}
      />
    );
  }),

  Row: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div>
  >(function FormLayoutRow({ className, ...props }, ref) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn(
          "grid grid-cols-1 gap-2 md:auto-cols-fr md:grid-flow-col md:items-start",
          className,
        )}
      />
    );
  }),

  Field: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div> & {
      orientation?: "vertical" | "horizontal";
      disabled?: boolean;
    }
  >(function FormLayoutField(
    { orientation = "vertical", disabled = false, className, ...props },
    ref,
  ) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn(
          "grid",
          orientation === "vertical"
            ? "grid-cols-1"
            : "grid-cols-fr-auto items-start gap-2",
          disabled ? "opacity-disabled" : undefined,
          className,
        )}
      />
    );
  }),

  Label: forwardRef<
    React.ComponentRef<typeof Primitive.label>,
    React.ComponentPropsWithoutRef<typeof Primitive.label>
  >(function FormLayoutLabel({ htmlFor, className, ...props }, ref) {
    const Component = htmlFor == null ? Primitive.span : Primitive.label;

    return (
      <Component
        {...props}
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "text-caption-lowercase-default",
          htmlFor != null ? "cursor-pointer" : undefined,
          className,
        )}
      />
    );
  }),

  Helper: forwardRef<
    React.ComponentRef<typeof Primitive.p>,
    React.ComponentPropsWithoutRef<typeof Primitive.p> & {
      variant?: "default" | "error";
    }
  >(function FormLayoutHelper(
    { variant = "default", className, ...props },
    ref,
  ) {
    return (
      <Primitive.p
        {...props}
        ref={ref}
        className={cn(
          "text-caption-lowercase-default",
          variant === "error" ? "text-mystic" : undefined,
          className,
        )}
      />
    );
  }),

  Input: forwardRef<
    React.ComponentRef<typeof Primitive.input>,
    React.ComponentPropsWithoutRef<typeof Primitive.input>
  >(function FormLayoutInput({ className, ...props }, ref) {
    return (
      <Primitive.input
        {...props}
        ref={ref}
        className={cn(
          "rounded-0.5 bg-transparent px-1 py-0.5 ring-1 ring-inset ring-mystic-200 placeholder:text-prussianBlue/50 can-hover:focus-visible:focus-compact",
          className,
        )}
      />
    );
  }),

  SwitchInput: forwardRef<
    React.ComponentRef<"input">,
    Omit<React.ComponentPropsWithoutRef<"input">, "type">
  >(function FormLayoutSwitchInput({ className, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        type="checkbox"
        className={cn(
          "inline-flex h-2 w-3 appearance-none rounded-full p-[2px] transition-colors duration-normal enabled:cursor-pointer enabled:[&[readonly]]:cursor-default",

          // Background.
          "bg-transparent checked:bg-mystic active:bg-mystic-100 checked:active:bg-mystic-700 can-hover:hover:bg-mystic-50 checked:can-hover:hover:bg-mystic-600 active:can-hover:hover:bg-mystic-100 checked:active:can-hover:hover:bg-mystic-700",

          // Border.
          "border border-mystic-200 checked:border-mystic",

          // Focus outline.
          "can-hover:focus-visible:focus-compact checked:can-hover:focus-visible:focus-spaced",

          // Thumb.
          "after:pointer-events-none after:aspect-square after:w-[18px] after:rounded-full after:border after:border-mystic after:transition-[background-color,border-color,transform] after:duration-normal checked:border-white checked:after:translate-x-1 checked:after:bg-white",

          className,
        )}
      />
    );
  }),

  Textarea: forwardRef<
    React.ComponentRef<"textarea">,
    React.ComponentPropsWithoutRef<"textarea">
  >(function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={cn(
          "rounded-0.5 px-1 py-0.5 ring-1 ring-inset ring-mystic-200 can-hover:focus-visible:focus-compact",
          className,
        )}
      />
    );
  }),

  Output: forwardRef<
    React.ComponentRef<typeof Primitive.p>,
    React.ComponentPropsWithoutRef<typeof Primitive.p>
  >(function FormLayoutLabel({ className, ...props }, ref) {
    return (
      <Primitive.p
        {...props}
        ref={ref}
        className={cn("text-body-lowercase-emphasis", className)}
      />
    );
  }),

  InputList: {
    Root: forwardRef<
      React.ComponentRef<typeof Primitive.div>,
      React.ComponentPropsWithoutRef<typeof Primitive.div>
    >(function FormLayoutInputList({ className, ...props }, ref) {
      return (
        <Primitive.div
          {...props}
          ref={ref}
          className={cn("grid grid-cols-1 gap-0.5", className)}
        />
      );
    }),

    Row: forwardRef<
      React.ComponentRef<typeof Primitive.div>,
      React.ComponentPropsWithoutRef<typeof Primitive.div>
    >(function FormLayoutInputListRow({ className, ...props }, ref) {
      return (
        <Primitive.div
          {...props}
          ref={ref}
          className={cn(
            "grid grid-cols-fr-auto items-start gap-0.5",
            className,
          )}
        />
      );
    }),

    Action: forwardRef<
      React.ComponentRef<typeof Action>,
      Except<React.ComponentPropsWithoutRef<typeof Action>, "color">
    >(function FormLayoutInputListAction({ className, ...props }, ref) {
      return (
        <Action
          {...props}
          ref={ref}
          color="alabaster"
          className={cn("justify-self-center", className)}
        />
      );
    }),
  },

  Selectors: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div> & {
      columnMinWidth: string;
    }
  >(function FormLayoutSelectors(
    { columnMinWidth, className, style, ...props },
    ref,
  ) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn("grid gap-0.5", className)}
        style={{
          ...style,
          gridTemplateColumns: `repeat(auto-fit, minmax(${columnMinWidth}, 1fr))`,
        }}
      />
    );
  }),

  Selector: {
    Root: forwardRef<
      React.ComponentRef<typeof Primitive.label>,
      React.ComponentPropsWithoutRef<typeof Primitive.label>
    >(function FormLayoutSelectorRoot({ className, ...props }, ref) {
      return (
        <Primitive.label
          {...props}
          ref={ref}
          className={cn(
            "group/selector relative flex cursor-pointer items-start gap-1 rounded-0.5 px-1 py-0.5",
            className,
          )}
        />
      );
    }),

    Input: forwardRef<
      React.ComponentRef<"input">,
      React.ComponentPropsWithoutRef<"input">
    >(function FormLayoutSelectorInput({ className, ...props }, ref) {
      return (
        <input
          {...props}
          ref={ref}
          className={cn(
            "peer/input absolute inset-0 -z-just-above h-full w-full cursor-pointer appearance-none rounded-0.5 transition-colors duration-normal",

            // Background.
            "bg-transparent checked:bg-mystic active:bg-mystic-100 checked:active:bg-mystic-700 can-hover:hover:bg-mystic-50 checked:can-hover:hover:bg-mystic-600 active:can-hover:hover:bg-mystic-100 checked:active:can-hover:hover:bg-mystic-700",

            // Border.
            "border border-mystic-200 checked:border-mystic",

            // Focus outline.
            "can-hover:focus-visible:focus-compact checked:can-hover:focus-visible:focus-spaced",

            className,
          )}
        />
      );
    }),

    UncheckedIcon: forwardRef<
      React.ComponentRef<typeof Primitive.span>,
      React.ComponentPropsWithoutRef<typeof Primitive.span>
    >(function FormLayoutSelectorUncheckedIcon({ className, ...props }, ref) {
      return (
        <Primitive.span
          {...props}
          ref={ref}
          className={cn(
            "flex-none icon-24 peer-checked/input:hidden",
            className,
          )}
        />
      );
    }),

    CheckedIcon: forwardRef<
      React.ComponentRef<typeof Primitive.span>,
      React.ComponentPropsWithoutRef<typeof Primitive.span>
    >(function FormLayoutSelectorCheckedIcon({ className, ...props }, ref) {
      return (
        <Primitive.span
          {...props}
          ref={ref}
          className={cn(
            "hidden flex-none text-white icon-24 peer-checked/input:block",
            className,
          )}
        />
      );
    }),

    Label: forwardRef<
      React.ComponentRef<typeof Primitive.span>,
      React.ComponentPropsWithoutRef<typeof Primitive.span>
    >(function FormLayoutSelectorLabel({ className, ...props }, ref) {
      return (
        <Primitive.span
          {...props}
          ref={ref}
          className={cn(
            "min-w-0 flex-1 transition-colors duration-normal text-body-lowercase-default peer-checked/input:text-white peer-checked/input:text-body-lowercase-emphasis",
            className,
          )}
        />
      );
    }),

    CheckboxIcon: function FormLayoutSelectorCheckboxIcon() {
      return (
        <span className="mt-[4px] grid aspect-square w-[16px] items-center justify-center rounded-0.5 border border-mystic text-transparent transition-colors duration-normal peer-checked/input:border-white peer-checked/input:bg-white peer-checked/input:text-mystic">
          <Icon id="check-solid" className="icon-12" />
        </span>
      );
    },

    RadioIcon: function FormLayoutSelectorRadioIcon() {
      return (
        <span className="mt-[4px] grid aspect-square w-[16px] items-center justify-center rounded-full border border-mystic text-mystic transition-colors duration-normal after:flex after:aspect-square after:w-0.5 after:scale-0 after:rounded-full after:bg-mystic after:transition-transform after:duration-normal peer-checked/input:border-white peer-checked/input:bg-white peer-checked/input:after:scale-100" />
      );
    },
  },

  Action: forwardRef<
    React.ComponentRef<typeof Action>,
    Except<React.ComponentPropsWithoutRef<typeof Action>, "color" | "type"> & {
      isLoading: boolean;
    }
  >(function FormLayoutAction(
    { children, isLoading, className, ...props },
    ref,
  ) {
    return (
      <Action
        {...props}
        ref={ref}
        color="mystic"
        type="submit"
        className={cn("justify-self-center", className)}
      >
        {children}

        <Action.Loader isLoading={isLoading} />
      </Action>
    );
  }),
};
