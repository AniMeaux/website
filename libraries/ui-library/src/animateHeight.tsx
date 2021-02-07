import cn from "classnames";
import * as React from "react";
import { watchResize } from "react-behave";

type AnimateHeightProps = React.HTMLAttributes<HTMLElement> & {
  refProp?: React.MutableRefObject<HTMLDivElement>;
};

export function AnimateHeight({
  refProp,
  children,
  className,
  style,
  ...rest
}: AnimateHeightProps) {
  const childrenContainer = React.useRef<HTMLDivElement>(null!);
  const [childrenHeight, setChildrenHeight] = React.useState<number | null>(
    null
  );

  React.useLayoutEffect(() => {
    return watchResize(childrenContainer.current, () => {
      setChildrenHeight(childrenContainer.current.clientHeight);
    });
  }, []);

  return (
    <div
      {...rest}
      ref={refProp}
      className={cn(
        "overflow-auto transition-height ease-in-out duration-200",
        className
      )}
      style={{
        ...style,
        // Use the given height or fallback to the children's one.
        height: style?.height ?? childrenHeight ?? undefined,
      }}
    >
      <div ref={childrenContainer}>{children}</div>
    </div>
  );
}
