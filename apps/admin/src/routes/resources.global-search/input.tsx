import { AnimalSuggestionItem } from "#animals/item.tsx";
import { getAnimalDisplayName } from "#animals/profile/name.tsx";
import { AnimalSearchParams } from "#animals/searchParams.ts";
import { BaseTextInput } from "#core/formElements/baseTextInput.tsx";
import { Input } from "#core/formElements/input.tsx";
import {
  SuggestionItem,
  SuggestionList,
} from "#core/formElements/resourceInput.tsx";
import { Routes, useNavigate } from "#core/navigation.ts";
import { Overlay } from "#core/popovers/overlay.tsx";
import { FosterFamilySuggestionItem } from "#fosterFamilies/item.tsx";
import { FosterFamilySearchParams } from "#fosterFamilies/searchParams.ts";
import { Icon } from "#generated/icon.tsx";
import type { loader } from "#routes/resources.global-search/route";
import {
  ENTITY_TRANSLATION,
  Entity,
  GlobalSearchParams,
  SORTED_ENTITIES,
} from "#routes/resources.global-search/shared";
import { cn } from "@animeaux/core";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { SerializeFrom } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useFetcher, useNavigation } from "@remix-run/react";
import type {
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from "downshift";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { useEffect, useState } from "react";

export function GlobalSearch() {
  const [isOpened, setIsOpened] = useState(false);
  const [entity, setEntity] = useState<undefined | Entity>();

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isNavigating =
    navigation.state === "loading" && navigation.formData == null;

  // We don't close the search (change state) at the same time as we navigate
  // (also change state) to ensure the states change in order.
  useEffect(() => {
    if (isOpened && isNavigating) {
      setIsOpened(false);
    }
  }, [isNavigating, isOpened]);

  useEffect(() => {
    if (!isOpened) {
      function handleKeyDown(event: KeyboardEvent) {
        if (
          !event.defaultPrevented &&
          !["input", "textarea"].includes(
            (event.target as HTMLElement).tagName.toLowerCase(),
          ) &&
          event.key === "/"
        ) {
          event.preventDefault();
          setIsOpened(true);
        }
      }

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }

    return undefined;
  }, [isOpened]);

  const fetcher = useFetcher<loader>();
  const possibleEntities = new Set(fetcher.data?.possibleEntities);

  // Make sure we clear any search when the combobox is closed.
  // We can't load during a navigation or it will cancel the navigation.
  const load = fetcher.load;
  useEffect(() => {
    if (!isOpened && !isNavigating) {
      load(
        createPath({
          pathname: Routes.resources.globalSearch.toString(),
          search: GlobalSearchParams.stringify({ entity }),
        }),
      );
    }
  }, [load, isOpened, isNavigating, entity]);

  // - Set the first possible type once we get it.
  // - Reset to the first possible type when the combobox is closed.
  const firstPossibleEntity = SORTED_ENTITIES.find((entity) =>
    possibleEntities.has(entity),
  );

  useEffect(() => {
    if (firstPossibleEntity != null && (entity == null || !isOpened)) {
      setEntity(firstPossibleEntity);
    }
  }, [firstPossibleEntity, entity, isOpened]);

  return (
    <Dialog.Root
      open={isOpened}
      onOpenChange={(isOpened) => {
        // Only open the search if we have a type.
        setIsOpened(isOpened && entity != null);
      }}
    >
      <BaseTextInput.Root>
        <BaseTextInput
          asChild
          leftAdornmentCount={1}
          rightAdornmentCount={0}
          variant="search"
        >
          <Dialog.Trigger>
            <span className="text-gray-500">
              Recherche globale{" "}
              <span className="hidden md:inline">(appuyer sur ”/”)</span>
            </span>
          </Dialog.Trigger>
        </BaseTextInput>

        <BaseTextInput.AdornmentContainer
          side="left"
          adornment={
            <BaseTextInput.Adornment>
              <Icon id="magnifyingGlass" />
            </BaseTextInput.Adornment>
          }
        />
      </BaseTextInput.Root>

      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Overlay className="opacity-0 md:opacity-100" />
        </Dialog.Overlay>

        <Dialog.Content className="fixed bottom-0 left-0 right-0 top-0 z-30 flex flex-col overflow-y-auto bg-gray-50 animation-opacity-0 animation-duration-100 md:bottom-auto md:left-1/2 md:right-auto md:top-[10vh] md:w-[550px] md:-translate-x-1/2 md:rounded-1 md:bg-white md:shadow-ambient md:bg-var-white md:data-[state=open]:animation-enter md:data-[state=closed]:animation-exit">
          {entity != null ? (
            <Combobox
              entity={entity}
              setEntity={setEntity}
              fetcher={fetcher}
              onClose={() => setIsOpened(false)}
              onSelectedItemChange={(item) => {
                if (item.type === Entity.ANIMAL) {
                  navigate(Routes.animals.id(item.id).toString());
                } else {
                  navigate(Routes.fosterFamilies.id(item.id).toString());
                }
              }}
              onSelectSearch={(search) => {
                if (entity === Entity.ANIMAL) {
                  navigate(
                    createPath({
                      pathname: Routes.animals.search.toString(),
                      search: AnimalSearchParams.stringify({
                        nameOrAlias: search,
                      }),
                    }),
                  );
                } else {
                  navigate(
                    createPath({
                      pathname: Routes.fosterFamilies.toString(),
                      search: FosterFamilySearchParams.stringify({
                        displayName: search,
                      }),
                    }),
                  );
                }
              }}
            />
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function stateReducer<TItem>(
  state: UseComboboxState<TItem>,
  actionAndChanges: UseComboboxStateChangeOptions<TItem>,
): Partial<UseComboboxState<TItem>> {
  // Don't select highlighted item on tab.
  if (
    actionAndChanges.type === useCombobox.stateChangeTypes.InputBlur &&
    actionAndChanges.selectItem
  ) {
    return state;
  }

  return actionAndChanges.changes;
}

function Combobox({
  entity,
  setEntity,
  fetcher,
  onSelectedItemChange,
  onSelectSearch,
  onClose,
}: {
  entity: Entity;
  setEntity: React.Dispatch<Entity>;
  fetcher: FetcherWithComponents<SerializeFrom<typeof loader>>;
  onSelectedItemChange: React.Dispatch<
    SerializeFrom<typeof loader>["items"][number]
  >;
  onSelectSearch: React.Dispatch<string>;
  onClose: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const cleanedInputValue = inputValue.trim();
  const items = fetcher.data?.items ?? [];

  let visibleItems: (
    | "search-item"
    | SerializeFrom<typeof loader>["items"][number]
  )[] = items;

  if (cleanedInputValue !== "") {
    visibleItems = ["search-item", ...items];
  }

  const combobox = useCombobox({
    isOpen: true,
    inputValue,
    items: visibleItems,
    stateReducer,
    itemToString: (item) => {
      if (item === null) {
        return "";
      }

      if (item === "search-item") {
        return item;
      }

      if (item.type === Entity.ANIMAL) {
        return getAnimalDisplayName(item);
      }

      return item.displayName;
    },
    onSelectedItemChange: ({ selectedItem = null }) => {
      if (selectedItem != null) {
        if (selectedItem === "search-item") {
          onSelectSearch(cleanedInputValue);
        } else {
          onSelectedItemChange(selectedItem);
        }
      }
    },
    onIsOpenChange: ({ type }) => {
      if (type === useCombobox.stateChangeTypes.InputKeyDownEscape) {
        onClose();
      }
    },
    onInputValueChange: ({ inputValue = "" }) => {
      setInputValue(inputValue);
    },
    onStateChange: ({ type, selectedItem }) => {
      if (
        type === useCombobox.stateChangeTypes.InputKeyDownEnter &&
        cleanedInputValue !== "" &&
        selectedItem == null
      ) {
        onSelectSearch(cleanedInputValue);
      }
    },
  });

  return (
    <fetcher.Form
      method="GET"
      action={Routes.resources.globalSearch.toString()}
      className="flex flex-col gap-1 md:gap-0"
      onChange={(event) => fetcher.submit(event.currentTarget)}
    >
      <VisuallyHidden.Root>
        <Dialog.Title {...combobox.getLabelProps()}>
          Recherche globale
        </Dialog.Title>
      </VisuallyHidden.Root>

      <header className="sticky top-0 z-20 flex flex-none flex-col bg-white bg-var-white md:pb-0.5">
        <div className="flex flex-col pb-0.5 pt-safe-0.5 px-safe-1 md:px-1 md:pt-1 ">
          <Input
            {...combobox.getInputProps()}
            hideFocusRing
            name={GlobalSearchParams.keys.text}
            type="search"
            variant="transparent"
            placeholder="Recherche globale"
            leftAdornment={
              <>
                <span className="flex md:hidden">
                  <Dialog.Close asChild>
                    <Input.ActionAdornment>
                      <Icon id="angleLeft" />
                    </Input.ActionAdornment>
                  </Dialog.Close>
                </span>

                <span className="hidden md:flex">
                  <Input.Adornment>
                    <Icon id="magnifyingGlass" />
                  </Input.Adornment>
                </span>
              </>
            }
          />
        </div>

        <EntityInput
          entity={entity}
          setEntity={setEntity}
          possibleEntities={new Set(fetcher.data?.possibleEntities)}
        />
      </header>

      <section
        className={cn("flex flex-col bg-white bg-var-white", {
          "p-1 md:border-t md:border-gray-100": visibleItems.length > 0,
        })}
      >
        <SuggestionList {...combobox.getMenuProps()}>
          {visibleItems.map((item, index) => {
            if (item === "search-item") {
              return (
                <SuggestionItem
                  key="search-item"
                  {...combobox.getItemProps({ item, index })}
                  leftAdornment={<Icon id="magnifyingGlass" />}
                  label={`Rechercher : **${cleanedInputValue}**`}
                />
              );
            }

            if (item.type === Entity.ANIMAL) {
              return (
                <AnimalSuggestionItem
                  key={item.id}
                  {...combobox.getItemProps({ item, index })}
                  animal={item}
                />
              );
            }

            return (
              <FosterFamilySuggestionItem
                key={item.id}
                {...combobox.getItemProps({ item, index })}
                fosterFamily={item}
              />
            );
          })}
        </SuggestionList>
      </section>
    </fetcher.Form>
  );
}

function EntityInput({
  entity,
  setEntity,
  possibleEntities,
}: {
  entity: Entity;
  setEntity: React.Dispatch<Entity>;
  possibleEntities: Set<Entity>;
}) {
  if (possibleEntities.size < 2) {
    return null;
  }

  return (
    <Tabs className="py-0.5">
      {SORTED_ENTITIES.filter((entity) => possibleEntities.has(entity)).map(
        (possibleEntity) => (
          <span
            key={possibleEntity}
            className="flex flex-col first:pl-safe-1 last:pr-safe-1 md:first:pl-1 md:last:pr-1"
          >
            <Tab>
              <TabInput
                type="radio"
                name={GlobalSearchParams.keys.entity}
                value={possibleEntity}
                checked={possibleEntity === entity}
                onChange={() => setEntity(possibleEntity)}
              />

              <TabLabel>{ENTITY_TRANSLATION[possibleEntity]}</TabLabel>
            </Tab>
          </span>
        ),
      )}
    </Tabs>
  );
}

function Tabs({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        className,
        "grid grid-flow-col justify-start gap-0.5 overflow-auto scrollbars-none",
      )}
    >
      {children}
    </div>
  );
}

function Tab({ children }: { children?: React.ReactNode }) {
  return (
    <label className="group relative z-0 flex cursor-pointer rounded-0.5 focus-within:z-10">
      {children}
    </label>
  );
}

function TabInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="peer absolute left-0 top-0 -z-10 h-full w-full cursor-pointer appearance-none rounded-0.5 transition-colors duration-100 ease-in-out checked:bg-blue-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-inheritBg group-hover:bg-gray-100 group-hover:checked:bg-blue-50"
    />
  );
}

function TabLabel({ children }: { children?: React.ReactNode }) {
  return (
    <span className="px-1 py-0.5 text-gray-500 text-body-emphasis peer-checked:text-blue-500">
      {children}
    </span>
  );
}
