import { cn } from "@animeaux/core";

export namespace Receipt {
  export function Root({ ...props }: React.PropsWithChildren) {
    return <div {...props} className="grid grid-cols-1 gap-2" />;
  }

  export function Items({ ...props }: React.PropsWithChildren) {
    return (
      <div
        {...props}
        className="grid grid-flow-col grid-cols-fr-2-auto gap-x-1"
      />
    );
  }

  export function Item({
    className,
    ...props
  }: React.PropsWithChildren<{ className?: string }>) {
    return (
      <div
        {...props}
        className={cn("col-span-full grid grid-cols-subgrid", className)}
      />
    );
  }

  export function ItemName({ ...props }: React.PropsWithChildren) {
    return <p {...props} />;
  }

  export function ItemCount({ count }: { count?: number }) {
    if (count == null) {
      return <p />;
    }

    return <p className="text-right">{count} ×</p>;
  }

  export function ItemPrice({ ...props }: React.PropsWithChildren) {
    return <p {...props} className="text-right" />;
  }

  export function Total({ ...props }: React.PropsWithChildren) {
    return (
      <Items>
        <Item {...props} className="text-body-lowercase-emphasis" />
      </Items>
    );
  }

  export const TotalName = ItemName;
  export const TotalPrice = ItemPrice;
}
