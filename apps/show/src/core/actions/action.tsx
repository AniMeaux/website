import { cn } from "@animeaux/core"
import { Primitive } from "@animeaux/react-primitives"
import { forwardRef } from "react"

import { Spinner } from "#i/core/loaders/spinner.js"

export const Action = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Primitive.button>,
    React.ComponentPropsWithoutRef<typeof Primitive.button> & {
      variant?: Variant
      color?: Color
    }
  >(function Action(
    { variant = "button", color = "mystic", className, ...props },
    ref,
  ) {
    return (
      <Primitive.button
        {...props}
        ref={ref}
        className={cn(
          "relative flex flex-none rounded-0.5 px-2 py-0.5 text-body-emphasis transition-colors focus-ring-spaced focus-visible:focus-ring disabled:opacity-disabled",
          CLASS_NAMES_BY_COLOR[variant][color],
          className,
        )}
      />
    )
  }),
  {
    Loader: function ActionLoader({ isLoading }: { isLoading: boolean }) {
      return (
        <span
          className={cn(
            "absolute inset-0 grid grid-cols-1 items-center justify-items-center rounded-inherit bg-inherit transition-opacity",
            isLoading ? "opacity-100" : "opacity-0",
          )}
        >
          <Spinner />
        </span>
      )
    },
  },
)

export const ActionIcon = forwardRef<
  React.ComponentRef<typeof Primitive.button>,
  React.ComponentPropsWithoutRef<typeof Primitive.button> & {
    variant?: Variant
    color?: Color
  }
>(function ActionIcon(
  { variant = "button", color = "mystic", className, ...props },
  ref,
) {
  return (
    <Primitive.button
      {...props}
      ref={ref}
      className={cn(
        "flex flex-none rounded-0.5 px-1 py-0.5 icon-24 transition-colors focus-ring-spaced focus-visible:focus-ring disabled:opacity-disabled",
        CLASS_NAMES_BY_COLOR[variant][color],
        className,
      )}
    />
  )
})

type Variant = "button" | "link"
type Color = "alabaster" | "mystic" | "prussianBlue"

// `enabled` doesn't work on `<a/>`.
// To avoid having `<a/>` styles applied to `<button/>`, we use `is-link`.
const CLASS_NAMES_BY_COLOR: Record<Variant, Record<Color, string>> = {
  button: {
    alabaster: cn(
      "bg-alabaster text-prussian-blue",

      // <button/>
      "hover:enabled:bg-alabaster-200 active:enabled:bg-alabaster-300 active:hover:enabled:bg-alabaster-300",

      // <a/>
      "is-link:hover:bg-alabaster-200 is-link:active:bg-alabaster-300 is-link:active:hover:bg-alabaster-300",
    ),

    mystic: cn(
      "bg-mystic text-white",

      // <button/>
      "hover:enabled:bg-mystic-600 active:enabled:bg-mystic-700 active:hover:enabled:bg-mystic-700",

      // <a/>
      "is-link:hover:bg-mystic-600 is-link:active:bg-mystic-700 is-link:active:hover:bg-mystic-700",
    ),

    prussianBlue: cn(
      "bg-prussian-blue text-white",

      // <button/>
      "hover:enabled:bg-prussian-blue-900 active:enabled:bg-prussian-blue-800 active:hover:enabled:bg-prussian-blue-800",

      // <a/>
      "is-link:hover:bg-prussian-blue-900 is-link:active:bg-prussian-blue-800 is-link:active:hover:bg-prussian-blue-800",
    ),
  },

  link: {
    alabaster: cn(
      "bg-transparent text-prussian-blue",

      // <button/>
      "hover:enabled:bg-alabaster active:enabled:bg-alabaster-200 active:hover:enabled:bg-alabaster-200",

      // <a/>
      "is-link:hover:bg-alabaster is-link:active:bg-alabaster-200 is-link:active:hover:bg-alabaster-200",
    ),

    mystic: cn(
      "bg-transparent text-mystic",

      // <button/>
      "hover:enabled:bg-mystic-50 active:enabled:bg-mystic-100 active:hover:enabled:bg-mystic-100",

      // <a/>
      "is-link:hover:bg-mystic-50 is-link:active:bg-mystic-100 is-link:active:hover:bg-mystic-100",
    ),

    prussianBlue: cn(
      "bg-transparent text-prussian-blue",

      // <button/>
      "hover:enabled:bg-prussian-blue-50 active:enabled:bg-prussian-blue-100 active:hover:enabled:bg-prussian-blue-100",

      // <a/>
      "is-link:hover:bg-prussian-blue-50 is-link:active:bg-prussian-blue-100 is-link:active:hover:bg-prussian-blue-100",
    ),
  },
}
