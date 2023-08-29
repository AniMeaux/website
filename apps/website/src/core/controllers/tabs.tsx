import { cn } from "#core/classNames.ts";
import { useWidth } from "#core/hooks.ts";
import { LineShapeHorizontal } from "#core/layout/lineShape.tsx";
import { Transition } from "react-transition-group";

export function Tab({
  onSelect,
  isActive,
  children,
}: {
  onSelect: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) {
  const { ref, width } = useWidth<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      className={cn(
        "relative px-3 py-2 flex text-body-emphasis transition-colors duration-150 ease-in-out",
        {
          "text-brandBlue": isActive,
          "text-gray-600 hover:text-black": !isActive,
        },
      )}
    >
      <span className="flex items-center gap-2">{children}</span>

      <Transition in={isActive} timeout={150}>
        {(transitionState) => (
          <LineShapeHorizontal
            className={cn("absolute bottom-0 left-0 w-full h-1 block", {
              "transition-[stroke-dashoffset] duration-150 ease-in-out":
                transitionState === "entering" || transitionState === "exiting",
            })}
            style={{
              strokeDasharray: width,
              strokeDashoffset:
                transitionState === "entering" || transitionState === "entered"
                  ? 0
                  : width,
            }}
          />
        )}
      </Transition>
    </button>
  );
}
