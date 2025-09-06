import { cn } from "@animeaux/core";

export namespace Receipt {
  export function Root({ ...props }: React.PropsWithChildren) {
    return <div {...props} className="grid grid-cols-1 gap-2" />;
  }

  export function Items({ ...props }: React.PropsWithChildren) {
    return <div {...props} className="grid grid-cols-1" />;
  }

  export function Item({
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <div
        {...props}
        className={cn("grid grid-cols-2-auto justify-between gap-2", className)}
      />
    );
  }

  export function ItemName({ ...props }: React.PropsWithChildren) {
    return <p {...props} />;
  }

  export function ItemPrice({ ...props }: React.PropsWithChildren) {
    return <p {...props} />;
  }

  export function Total({ ...props }: React.PropsWithChildren) {
    return <Item {...props} className="text-body-lowercase-emphasis" />;
  }

  export const TotalName = ItemName;
  export const TotalPrice = ItemPrice;
}
