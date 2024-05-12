import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import { Primitive } from "@animeaux/react-primitives";
import { forwardRef } from "react";

export const ItemList = {
  List: forwardRef<
    React.ComponentRef<typeof Primitive.ul>,
    React.ComponentPropsWithoutRef<typeof Primitive.ul>
  >(function ItemListList({ className, ...props }, ref) {
    return (
      <Primitive.ul
        {...props}
        ref={ref}
        className={cn("grid grid-cols-1 gap-2", className)}
      />
    );
  }),

  Item: forwardRef<
    React.ComponentRef<typeof Primitive.li>,
    React.ComponentPropsWithoutRef<typeof Primitive.li>
  >(function ItemListItem({ className, ...props }, ref) {
    return (
      <Primitive.li
        {...props}
        ref={ref}
        className={cn("flex items-start gap-1", className)}
      />
    );
  }),

  Icon: forwardRef<
    React.ComponentRef<typeof Icon>,
    React.ComponentPropsWithoutRef<typeof Icon>
  >(function ItemListIcon({ className, ...props }, ref) {
    return (
      <Icon
        {...props}
        ref={ref}
        className={cn("text-gray-600 icon-20", className)}
      />
    );
  }),

  Label: forwardRef<
    React.ComponentRef<typeof Primitive.p>,
    React.ComponentPropsWithoutRef<typeof Primitive.p>
  >(function ItemListLabel({ className, ...props }, ref) {
    return (
      <Primitive.p
        {...props}
        ref={ref}
        className={cn("text-gray-800", className)}
      />
    );
  }),
};
