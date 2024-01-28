import { useWidth } from "#core/hooks";
import { LineShapeHorizontal } from "#core/layout/lineShape";
import { cn } from "@animeaux/core";
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
        "relative flex px-3 py-2 transition-colors duration-150 ease-in-out text-body-emphasis",
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
            className={cn("absolute bottom-0 left-0 block h-1 w-full", {
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
