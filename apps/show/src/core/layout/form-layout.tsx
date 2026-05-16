import { cn } from "@animeaux/core"
import { Primitive } from "@animeaux/react-primitives"
import { Link } from "@remix-run/react"
import { forwardRef } from "react"
import type { Except } from "type-fest"

import { Action, ActionIcon } from "#i/core/actions/action.js"
import { ActionInline } from "#i/core/actions/inline.js"
import { HelperCard } from "#i/core/layout/helper-card.js"
import { HorizontalSeparator } from "#i/core/layout/separator.js"
import { Icon } from "#i/generated/icon.js"

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
          "grid grid-cols-1 gap-4 md:grid-cols-fr-auto md:items-start lg:gap-8",
          className,
        )}
      />
    )
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
    )
  }),

  AsideHelper: {
    ...HelperCard,

    Root: forwardRef<
      React.ComponentRef<typeof Primitive.aside>,
      React.ComponentPropsWithoutRef<typeof Primitive.aside> & {
        hideOnSmallScreens?: boolean
      }
    >(function FormLayoutAsideHelperRoot(
      { hideOnSmallScreens = false, className, ...props },
      ref,
    ) {
      return (
        <HelperCard.Root color="alabaster" asChild>
          <Primitive.aside
            {...props}
            ref={ref}
            className={cn(
              "row-start-1 md:sticky md:top-4 md:col-start-2 md:w-25",
              hideOnSmallScreens ? "hidden md:grid" : undefined,
              className,
            )}
          />
        </HelperCard.Root>
      )
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
    )
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
          "grid grid-cols-fr-auto items-center gap-1 rounded-0.5 px-1 py-0.5 focus-visible:focus-ring",
        )}
      >
        {children}

        <Icon
          id="check-solid"
          className={cn("icon-16", isComplete ? "opacity-100" : "opacity-0")}
        />
      </Link>
    )
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
    )
  }),

  SectionSeparator: function FormLayoutSectionSeparator() {
    return <HorizontalSeparator color="alabaster" />
  },

  FieldSeparator: function FormLayoutFieldSeparator() {
    return <hr className="border-t border-alabaster" />
  },

  Header: forwardRef<
    React.ComponentRef<typeof Primitive.header>,
    React.ComponentPropsWithoutRef<typeof Primitive.header>
  >(function FormLayoutHeader({ className, ...props }, ref) {
    return (
      <Primitive.header
        {...props}
        ref={ref}
        className={cn(
          "grid auto-cols-auto grid-flow-col grid-cols-1 items-center gap-2",
          className,
        )}
      />
    )
  }),

  Title: forwardRef<
    React.ComponentRef<typeof Primitive.h2>,
    React.ComponentPropsWithoutRef<typeof Primitive.h2>
  >(function FormLayoutTitle({ className, ...props }, ref) {
    return (
      <Primitive.h2
        {...props}
        ref={ref}
        className={cn("text-item-title text-mystic", className)}
      />
    )
  }),

  HeaderAction: forwardRef<
    React.ComponentRef<typeof ActionIcon>,
    Except<
      React.ComponentPropsWithoutRef<typeof ActionIcon>,
      "variant" | "color"
    >
  >(function FormLayoutHeaderAction(props, ref) {
    return (
      <ActionInline>
        <ActionIcon {...props} ref={ref} variant="link" color="prussianBlue" />
      </ActionInline>
    )
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
    )
  }),

  RowFluid: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div> & {
      columnMinWidth: string
      repeatCount?: "auto-fit" | "auto-fill"
    }
  >(function FormLayoutRowFuild(
    { columnMinWidth, repeatCount = "auto-fit", className, style, ...props },
    ref,
  ) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn("grid gap-2", className)}
        style={{
          ...style,
          gridTemplateColumns: `repeat(${repeatCount}, minmax(${columnMinWidth}, 1fr))`,
        }}
      />
    )
  }),

  Field: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div> & {
      orientation?: "vertical" | "horizontal"
      disabled?: boolean
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
            : "grid-cols-fr-auto items-start gap-x-2",
          disabled ? "opacity-disabled" : undefined,
          className,
        )}
      />
    )
  }),

  Label: forwardRef<
    React.ComponentRef<typeof Primitive.label>,
    React.ComponentPropsWithoutRef<typeof Primitive.label>
  >(function FormLayoutLabel({ htmlFor, className, ...props }, ref) {
    const Component = htmlFor == null ? Primitive.span : Primitive.label

    return (
      <Component
        {...props}
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "text-caption",
          htmlFor != null ? "cursor-pointer" : undefined,
          className,
        )}
      />
    )
  }),

  Helper: forwardRef<
    React.ComponentRef<typeof Primitive.p>,
    React.ComponentPropsWithoutRef<typeof Primitive.p> & {
      variant?: "default" | "error"
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
          "col-span-full text-caption",
          variant === "error" ? "text-mystic" : undefined,
          className,
        )}
      />
    )
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
          "rounded-0.5 bg-transparent px-1 py-0.5 ring-1 ring-mystic-200 ring-inset placeholder:text-prussian-blue/50 focus-visible:focus-ring",
          className,
        )}
      />
    )
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
          "inline-flex h-2 w-3 appearance-none rounded-full p-[2px] transition-colors enabled:cursor-pointer enabled:[[readonly]]:cursor-default",

          // Background.
          "bg-transparent checked:bg-mystic hover:bg-mystic-50 checked:hover:bg-mystic-600 active:bg-mystic-100 checked:active:bg-mystic-700 active:hover:bg-mystic-100 checked:active:hover:bg-mystic-700",

          // Border.
          "border border-mystic-200 checked:border-mystic",

          // Focus outline.
          "focus-ring-spaced focus-visible:focus-ring checked:focus-visible:focus-ring",

          // Thumb.
          "after:pointer-events-none after:aspect-square after:w-1.5 after:rounded-full after:border after:border-mystic after:transition-[background-color,border-color,translate] checked:border-white checked:after:translate-x-1 checked:after:bg-white",

          className,
        )}
      />
    )
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
          "rounded-0.5 px-1 py-0.5 ring-1 ring-mystic-200 ring-inset placeholder:text-prussian-blue/50 focus-visible:focus-ring",
          className,
        )}
      />
    )
  }),

  Output: Primitive.p,

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
      )
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
      )
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
      )
    }),
  },

  Selectors: forwardRef<
    React.ComponentRef<typeof Primitive.div>,
    React.ComponentPropsWithoutRef<typeof Primitive.div> & {
      columnMinWidth: string
      repeatCount?: "auto-fit" | "auto-fill"
    }
  >(function FormLayoutSelectors(
    { columnMinWidth, repeatCount = "auto-fit", className, style, ...props },
    ref,
  ) {
    return (
      <Primitive.div
        {...props}
        ref={ref}
        className={cn("grid gap-0.5", className)}
        style={{
          ...style,
          gridTemplateColumns: `repeat(${repeatCount}, minmax(${columnMinWidth}, 1fr))`,
        }}
      />
    )
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
            "group/selector relative flex items-start gap-1 rounded-0.5 px-1 py-0.5 has-[input:disabled]:opacity-disabled has-[input:enabled]:cursor-pointer",
            className,
          )}
        />
      )
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
            "peer/input absolute inset-0 -z-just-above size-full appearance-none rounded-0.5 transition-colors",

            // Background.
            "bg-transparent enabled:checked:bg-mystic enabled:hover:bg-mystic-50 enabled:checked:hover:bg-mystic-600 enabled:active:bg-mystic-100 enabled:checked:active:bg-mystic-700 enabled:active:hover:bg-mystic-100 enabled:checked:active:hover:bg-mystic-700",

            // Border.
            "border border-mystic-200 checked:border-mystic",

            // Focus outline.
            "focus-ring-spaced focus-visible:focus-ring checked:focus-visible:focus-ring",

            className,
          )}
        />
      )
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
      )
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
            "hidden flex-none icon-24 text-white peer-checked/input:block",
            className,
          )}
        />
      )
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
            "min-w-0 flex-1 text-body transition-colors peer-checked/input:text-body-emphasis peer-checked/input:text-white",
            className,
          )}
        />
      )
    }),

    CheckboxIcon: function FormLayoutSelectorCheckboxIcon() {
      return (
        <span className="mt-[4px] grid aspect-square w-[16px] items-center justify-center rounded-0.5 border border-mystic text-transparent transition-colors peer-checked/input:border-white peer-checked/input:bg-white peer-checked/input:text-mystic">
          <Icon id="check-solid" className="icon-12" />
        </span>
      )
    },

    RadioIcon: function FormLayoutSelectorRadioIcon() {
      return (
        <span className="mt-[4px] grid aspect-square w-[16px] items-center justify-center rounded-full border border-mystic text-mystic transition-colors peer-checked/input:border-white peer-checked/input:bg-white after:flex after:aspect-square after:w-0.5 after:scale-0 after:rounded-full after:bg-mystic after:transition-transform peer-checked/input:after:scale-100" />
      )
    },
  },

  Action: forwardRef<
    React.ComponentRef<typeof Action>,
    Except<React.ComponentPropsWithoutRef<typeof Action>, "color" | "type"> & {
      isLoading: boolean
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
    )
  }),
}
