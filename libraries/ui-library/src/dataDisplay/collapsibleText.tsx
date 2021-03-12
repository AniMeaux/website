import cn from "classnames";
import * as React from "react";
import { ChildrenProp, StyleProps } from "../core";

type CollapsibleTextProps = ChildrenProp & StyleProps;

export function CollapsibleText({ children, ...rest }: CollapsibleTextProps) {
  const [shouldShowAll, setShouldShowAll] = React.useState(false);
  const [hasOverflow, setHasOverflow] = React.useState(false);
  const overflowContainer = React.useRef<HTMLDivElement>(null!);

  React.useLayoutEffect(() => {
    if (overflowContainer.current != null) {
      setHasOverflow(
        overflowContainer.current.scrollHeight >
          overflowContainer.current.offsetHeight
      );
    }
  }, [children]);

  return (
    <div {...rest}>
      <div
        ref={overflowContainer}
        className={cn({ "line-clamp-5": !shouldShowAll })}
      >
        {children}
      </div>

      {hasOverflow && (
        <button
          className="focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-50 active:text-black active:text-opacity-60 rounded flex items-center justify-center font-bold cursor-pointer"
          onClick={() => setShouldShowAll((s) => !s)}
        >
          {shouldShowAll ? "Afficher moins" : "Afficher plus"}
        </button>
      )}
    </div>
  );
}
