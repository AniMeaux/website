import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export function ItemList({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.ul>) {
  return <Primitive.ul {...rest} className={cn("flex flex-col", className)} />;
}

export const Item = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Primitive.li>,
    React.ComponentPropsWithoutRef<typeof Primitive.li>
  >(function Item({ className, ...rest }, ref) {
    return (
      <Primitive.li
        {...rest}
        ref={ref}
        className={cn(
          "group w-full rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)] grid-flow-col",
          className,
        )}
      />
    );
  }),
  {
    Icon: function ItemIcon({
      className,
      ...rest
    }: React.ComponentPropsWithoutRef<typeof Primitive.span>) {
      return (
        <Primitive.span
          {...rest}
          className={cn(
            "w-4 h-4 flex items-center justify-center text-gray-600 text-[20px]",
            className,
          )}
        />
      );
    },

    Content: function ItemContent({
      className,
      ...rest
    }: React.ComponentPropsWithoutRef<typeof Primitive.p>) {
      return (
        <Primitive.p
          {...rest}
          className={cn("py-1 first:pl-1 last:pr-1", className)}
        />
      );
    },
  },
);

export function SimpleItem({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Item>
      <Item.Icon>{icon}</Item.Icon>
      <Item.Content>{children}</Item.Content>
    </Item>
  );
}
