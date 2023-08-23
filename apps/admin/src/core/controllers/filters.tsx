import { cn } from "#core/classNames.ts";
import { Chip } from "#core/dataDisplay/chip.tsx";
import { joinReactNodes } from "#core/joinReactNodes.tsx";
import { Separator } from "#core/layout/separator.tsx";
import { Icon } from "#generated/icon.tsx";
import { Form, useSubmit } from "@remix-run/react";
import { Children, createContext, useContext, useMemo, useState } from "react";

export function Filters({ children }: { children?: React.ReactNode }) {
  const submit = useSubmit();

  return (
    <Form
      replace
      method="GET"
      onChange={(event) => submit(event.currentTarget, { replace: true })}
      className="flex flex-col gap-2"
    >
      {children}
    </Form>
  );
}

Filters.Actions = function FiltersActions({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div className="flex flex-col gap-1">{children}</div>;
};

type FiltersContentContextValue = {
  openedFilter: string | null;
  setOpenedFilter: React.Dispatch<React.SetStateAction<string | null>>;
};

const FiltersContentContext = createContext<FiltersContentContextValue>({
  openedFilter: null,
  setOpenedFilter: () => {},
});

Filters.Content = function FiltersContent({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [openedFilter, setOpenedFilter] = useState<string | null>(null);
  const childrenArray = Children.toArray(children);

  return (
    <FiltersContentContext.Provider
      value={useMemo<FiltersContentContextValue>(
        () => ({ openedFilter, setOpenedFilter }),
        [openedFilter, setOpenedFilter]
      )}
    >
      <div className="flex flex-col gap-0.5">
        {joinReactNodes(childrenArray, <Separator />)}
      </div>
    </FiltersContentContext.Provider>
  );
};

Filters.Filter = function Filter({
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
  const { openedFilter, setOpenedFilter } = useContext(FiltersContentContext);
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
            {
              "text-gray-500 group-hover:text-inherit":
                !isOpened && count === 0,
            }
          )}
        >
          {label}
        </span>

        {count > 0 ? (
          <span className="h-4 flex items-center">
            <Chip color="gray">{count}</Chip>
          </span>
        ) : null}

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

      {!isOpened ? <div aria-hidden>{hiddenContent}</div> : null}

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
};
