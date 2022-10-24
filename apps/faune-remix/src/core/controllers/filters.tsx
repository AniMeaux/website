import { Children, createContext, useContext, useMemo, useState } from "react";
import { cn } from "~/core/classNames";
import { Chip } from "~/core/dataDisplay/chip";
import { joinReactNodes } from "~/core/joinReactNodes";
import { Separator } from "~/core/layout/separator";
import { Icon } from "~/generated/icon";

type FiltersContextValue = {
  openedFilter: string | null;
  setOpenedFilter: React.Dispatch<React.SetStateAction<string | null>>;
};

const FiltersContext = createContext<FiltersContextValue>({
  openedFilter: null,
  setOpenedFilter: () => {},
});

export function Filters({ children }: { children?: React.ReactNode }) {
  const [openedFilter, setOpenedFilter] = useState<string | null>(null);
  const childrenArray = Children.toArray(children);

  return (
    <FiltersContext.Provider
      value={useMemo<FiltersContextValue>(
        () => ({ openedFilter, setOpenedFilter }),
        [openedFilter, setOpenedFilter]
      )}
    >
      <div className="flex flex-col gap-0.5">
        {joinReactNodes(childrenArray, <Separator />)}
      </div>
    </FiltersContext.Provider>
  );
}

export function Filter({
  value,
  label,
  count = 0,
  children,
  hiddenContent,
}: {
  value: string;
  label: React.ReactNode;
  count?: number;
  children?: React.ReactNode;
  hiddenContent?: React.ReactNode;
}) {
  const { openedFilter, setOpenedFilter } = useContext(FiltersContext);
  const isOpened = openedFilter === value;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        id={`filter-${value}-trigger`}
        aria-controls={`filter-${value}-content`}
        data-state={isOpened ? "open" : "closed"}
        onClick={() =>
          setOpenedFilter((openedFilter) =>
            openedFilter === value ? null : value
          )
        }
        className="group w-full rounded-0.5 grid grid-cols-1 grid-flow-col items-start text-left focus:z-10 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <span
          className={cn(
            "py-1 text-body-emphasis transition-colors duration-100 ease-in-out",
            { "text-gray-500 group-hover:text-inherit": !isOpened }
          )}
        >
          {label}
        </span>

        {count > 0 && (
          <span className="h-4 flex items-center">
            <Chip>{count}</Chip>
          </span>
        )}

        <span
          className={cn(
            "w-4 h-4 flex items-center justify-center transition-[color,transform] duration-100 ease-in-out ",
            isOpened
              ? "text-gray-600 -rotate-90"
              : "text-gray-500 group-hover:text-gray-600"
          )}
        >
          <Icon id="angleRight" />
        </span>
      </button>

      {!isOpened && <div aria-hidden>{hiddenContent}</div>}

      <div
        aria-controls={`filter-${value}-content`}
        role="region"
        aria-labelledby={`filter-${value}-trigger`}
        data-state={isOpened ? "open" : "closed"}
        className={cn("flex flex-col", { "pb-1": isOpened })}
      >
        {isOpened ? children : null}
      </div>
    </div>
  );
}
