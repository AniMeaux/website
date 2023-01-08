import { UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import {
  FetcherWithComponents,
  useFetcher,
  useNavigate,
} from "@remix-run/react";
import {
  useCombobox,
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from "downshift";
import { createPath } from "history";
import { useEffect, useState } from "react";
import { fuzzySearchAnimals } from "~/animals/db.server";
import { AnimalSuggestionItem } from "~/animals/item";
import { getAnimalDisplayName } from "~/animals/profile/name";
import { AnimalSearchParams } from "~/animals/searchParams";
import { cn } from "~/core/classNames";
import { ActionAdornment } from "~/core/formElements/adornment";
import { Input } from "~/core/formElements/input";
import {
  SuggestionItem,
  SuggestionList,
} from "~/core/formElements/resourceInput";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";

export class GlobalSearchParams extends URLSearchParams {
  static readonly Keys = {
    TEXT: "q",
  };

  getText() {
    return this.get(GlobalSearchParams.Keys.TEXT)?.trim() || null;
  }
}

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const searchParams = new GlobalSearchParams(
    new URL(request.url).searchParams
  );

  const text = searchParams.getText();

  return json({ animals: text ? await fuzzySearchAnimals(text) : [] });
}

const RESOURCE_PATHNAME = "/resources/global-search";

export function GlobalSearch() {
  const [isOpened, setIsOpened] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpened) {
      function handleKeyDown(event: KeyboardEvent) {
        if (
          !event.defaultPrevented &&
          !["input", "textarea"].includes(
            (event.target as HTMLElement).tagName.toLowerCase()
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
  }, [isOpened]);

  const fetcher = useFetcher<typeof loader>();

  // Make sure we clear any search when the combobox is closed.
  const load = fetcher.load;
  useEffect(() => {
    if (!isOpened) {
      load(
        createPath({
          pathname: RESOURCE_PATHNAME,
          search: new GlobalSearchParams().toString(),
        })
      );
    }
  }, [load, isOpened]);

  return (
    <Dialog.Root open={isOpened} onOpenChange={setIsOpened}>
      <Dialog.Trigger className="rounded-0.5 bg-gray-100 pr-1 inline-grid grid-cols-[auto_minmax(0px,1fr)] text-left hover:bg-gray-200 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 md:text-body-default">
        <span className="p-0.5 flex">
          <span className="w-3 h-3 flex items-center justify-center text-gray-600">
            <Icon id="magnifyingGlass" />
          </span>
        </span>

        <span className="py-1 text-gray-500">
          Recherche globale{" "}
          <span className="hidden md:inline">(appuyer sur ”/”)</span>
        </span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20"
          )}
        />

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col md:top-[10vh] md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:w-[550px] md:shadow-ambient md:bg-white md:rounded-1">
          <Combobox
            fetcher={fetcher}
            onClose={() => setIsOpened(false)}
            onSelectedItemChange={(animal) => {
              setIsOpened(false);
              navigate(`/animals/${animal.id}`);
            }}
            onSelectSearch={(search) => {
              setIsOpened(false);

              navigate(
                createPath({
                  pathname: "/animals",
                  search: new AnimalSearchParams()
                    .setNameOrAlias(search)
                    .toString(),
                })
              );
            }}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function stateReducer<TItem>(
  state: UseComboboxState<TItem>,
  actionAndChanges: UseComboboxStateChangeOptions<TItem>
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
  fetcher,
  onSelectedItemChange,
  onSelectSearch,
  onClose,
}: {
  fetcher: FetcherWithComponents<SerializeFrom<typeof loader>>;
  onSelectedItemChange: React.Dispatch<
    SerializeFrom<typeof loader>["animals"][number]
  >;
  onSelectSearch: React.Dispatch<string>;
  onClose: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const cleanedInputValue = inputValue.trim();
  const animals = fetcher.data?.animals ?? [];

  let items: (
    | "search-item"
    | SerializeFrom<typeof loader>["animals"][number]
  )[] = animals;

  if (cleanedInputValue !== "") {
    items = ["search-item", ...animals];
  }

  const combobox = useCombobox({
    isOpen: true,
    inputValue,
    items,
    stateReducer,
    itemToString: (item) => {
      if (item === null) {
        return "";
      }

      if (item === "search-item") {
        return item;
      }

      return getAnimalDisplayName(item);
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
      method="get"
      action={RESOURCE_PATHNAME}
      className="flex flex-col gap-1 md:gap-0"
      onChange={(event) => fetcher.submit(event.currentTarget)}
    >
      <VisuallyHidden.Root>
        <Dialog.Title {...combobox.getLabelProps()}>
          Recherche globale
        </Dialog.Title>
      </VisuallyHidden.Root>

      <header className="sticky top-0 z-20 flex-none bg-white flex flex-col md:pb-0.5">
        <div className="px-safe-1 pt-safe-0.5 pb-0.5 flex flex-col md:px-1 md:pt-1 ">
          <Input
            {...combobox.getInputProps()}
            name={GlobalSearchParams.Keys.TEXT}
            variant="search"
            placeholder="Recherche globale"
            leftAdornment={
              <Dialog.Close asChild>
                <ActionAdornment>
                  <Icon id="angleLeft" />
                </ActionAdornment>
              </Dialog.Close>
            }
          />
        </div>
      </header>

      <section
        className={cn("bg-white flex flex-col", {
          "p-1 md:border-t md:border-gray-100": items.length > 0,
        })}
      >
        <SuggestionList {...combobox.getMenuProps()}>
          {items.map((item, index) => {
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

            return (
              <AnimalSuggestionItem
                key={item.id}
                {...combobox.getItemProps({ item, index })}
                animal={item}
              />
            );
          })}
        </SuggestionList>
      </section>
    </fetcher.Form>
  );
}
