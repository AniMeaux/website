import { callFactory, cn } from "@animeaux/core"
import { Primitive } from "@animeaux/react-primitives"
import { NavLink } from "@remix-run/react"
import { forwardRef } from "react"

export const Tabs = forwardRef<
  React.ComponentRef<typeof Primitive.div>,
  React.ComponentPropsWithoutRef<typeof Primitive.div>
>(function Tabs({ className, ...props }, ref) {
  return (
    <Primitive.div
      {...props}
      ref={ref}
      className={cn("grid grid-flow-col justify-start gap-0.5", className)}
    />
  )
})

export function Tab({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof NavLink>) {
  return (
    <NavLink
      preventScrollReset
      prefetch="intent"
      {...props}
      className={(props) =>
        cn(
          "rounded-0.5 px-1 py-0.5 transition-colors",
          props.isActive
            ? "bg-alabaster text-body-emphasis focus-ring-spaced focus-visible:focus-ring"
            : "text-body hover:bg-alabaster-50 focus-visible:focus-ring",
          callFactory(className, () => props),
        )
      }
    >
      {children}
    </NavLink>
  )
}
