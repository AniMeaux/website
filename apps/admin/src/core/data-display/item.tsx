import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export function ItemList({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<typeof Primitive.ul>) {
  return <Primitive.ul {...rest} className={cn("flex flex-col", className)} />;
}

export const Item = {
  Root: forwardRef<
    React.ComponentRef<typeof Primitive.li>,
    React.ComponentPropsWithoutRef<typeof Primitive.li>
  >(function Item({ className, ...rest }, ref) {
    return (
      <Primitive.li
        {...rest}
        ref={ref}
        className={cn(
          "group grid w-full grid-flow-col grid-cols-[auto_minmax(0px,1fr)] rounded-0.5",
          className,
        )}
      />
    );
  }),

  Icon: function ItemIcon({
    className,
    ...rest
  }: React.ComponentPropsWithoutRef<typeof Primitive.span>) {
    return (
      <Primitive.span
        {...rest}
        className={cn(
          "flex h-4 w-4 items-center justify-center icon-20",
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
};

export function SimpleItem({
  icon,
  isLightIcon = false,
  children,
}: {
  icon: React.ReactNode;
  isLightIcon?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Item.Root>
      <Item.Icon className={isLightIcon ? undefined : "text-gray-600"}>
        {icon}
      </Item.Icon>
      <Item.Content>{children}</Item.Content>
    </Item.Root>
  );
}
