import { Transition } from "react-transition-group";
import { BaseLink, BaseLinkProps } from "~/core/baseLink";
import { cn } from "~/core/classNames";
import { useWidth } from "~/core/hooks";
import { LineShapeHorizontal } from "~/layout/lineShape";

export function Tab({
  children,
  ...rest
}: Omit<BaseLinkProps, "className" | "isNavLink">) {
  const { ref, width } = useWidth<HTMLAnchorElement>();

  return (
    <BaseLink
      {...rest}
      ref={ref}
      isNavLink
      className="relative px-3 py-2 flex text-body-emphasis text-gray-600 transition-colors duration-150 ease-in-out hover:text-black aria-[current=page]:text-brandBlue hover:aria-[current=page]:text-brandBlue"
    >
      {({ isActive }) => (
        <>
          <span className="flex items-center gap-2">{children}</span>

          <Transition in={isActive} timeout={150}>
            {(transitionState) => (
              <LineShapeHorizontal
                className={cn("absolute bottom-0 left-0 w-full h-1 block", {
                  "transition-[stroke-dashoffset] duration-150 ease-in-out":
                    transitionState === "entering" ||
                    transitionState === "exiting",
                })}
                style={{
                  strokeDasharray: width,
                  strokeDashoffset:
                    transitionState === "entering" ||
                    transitionState === "entered"
                      ? 0
                      : width,
                }}
              />
            )}
          </Transition>
        </>
      )}
    </BaseLink>
  );
}
