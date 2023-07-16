import { User, UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LoaderArgs, SerializeFrom, json } from "@remix-run/node";
import {
  FetcherWithComponents,
  useFetcher,
  useNavigation,
} from "@remix-run/react";
import {
  UseComboboxState,
  UseComboboxStateChangeOptions,
  useCombobox,
} from "downshift";
import { createPath } from "history";
import { useEffect, useState } from "react";
import { z } from "zod";
import { fuzzySearchAnimals } from "~/animals/db.server";
import { AnimalSuggestionItem } from "~/animals/item";
import { getAnimalDisplayName } from "~/animals/profile/name";
import { AnimalSearchParams } from "~/animals/searchParams";
import { cn } from "~/core/classNames";
import { BaseTextInput } from "~/core/formElements/baseTextInput";
import { Input } from "~/core/formElements/input";
import {
  SuggestionItem,
  SuggestionList,
} from "~/core/formElements/resourceInput";
import { useNavigate } from "~/core/navigation";
import { Overlay } from "~/core/popovers/overlay";
import { ForbiddenResponse } from "~/core/response.server";
import { parseOrDefault } from "~/core/schemas";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { fuzzySearchFosterFamilies } from "~/fosterFamilies/db.server";
import { FosterFamilySuggestionItem } from "~/fosterFamilies/item";
import { FosterFamilySearchParams } from "~/fosterFamilies/searchParams";
import { Icon } from "~/generated/icon";

const SEARCH_COUNT = 6;

const TYPES = ["animal", "fosterFamily"] as const;
type Type = (typeof TYPES)[number];

export class GlobalSearchParams extends URLSearchParams {
  static readonly Keys = {
    TEXT: "q",
    TYPE: "type",
  };

  getText() {
    return this.get(GlobalSearchParams.Keys.TEXT)?.trim() || null;
  }

  getType() {
    return parseOrDefault(
      z.enum(TYPES).optional().nullable().default(null),
      this.get(GlobalSearchParams.Keys.TYPE)
    );
  }

  setType(type: null | Type) {
    const copy = new GlobalSearchParams(this);

    if (type != null) {
      copy.set(GlobalSearchParams.Keys.TYPE, type);
    } else if (copy.has(GlobalSearchParams.Keys.TYPE)) {
      copy.delete(GlobalSearchParams.Keys.TYPE);
    }

    return copy;
  }
}

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
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

  const possibleTypes = getTypesForCurrentUser(currentUser);
  const type = searchParams.getType() ?? possibleTypes[0];
  if (!possibleTypes.includes(type)) {
    throw new ForbiddenResponse();
  }

  const text = searchParams.getText();

  if (!text) {
    return json({ possibleTypes, items: [] });
  }

  if (type === "animal") {
    const animals = await fuzzySearchAnimals(text, SEARCH_COUNT);
    const items = animals.map((animal) => ({ type, ...animal }));
    return json({ possibleTypes, items });
  }

  const fosterFamilies = await fuzzySearchFosterFamilies(text, SEARCH_COUNT);
  const items = fosterFamilies.map((fosterFamily) => ({
    type,
    ...fosterFamily,
  }));
  return json({ possibleTypes, items });
}

function getTypesForCurrentUser(currentUser: Pick<User, "groups">) {
  let possibleTypes: Type[] = [];
  currentUser.groups.forEach((group) => {
    possibleTypes = possibleTypes.concat(ALLOWED_TYPES_PER_GROUP[group]);
  });
  return Array.from(new Set(possibleTypes));
}

// The types will be displayed in this order.
const ALLOWED_TYPES_PER_GROUP: Record<UserGroup, Type[]> = {
  [UserGroup.ADMIN]: ["animal", "fosterFamily"],
  [UserGroup.ANIMAL_MANAGER]: ["animal", "fosterFamily"],
  [UserGroup.BLOGGER]: [],
  [UserGroup.HEAD_OF_PARTNERSHIPS]: [],
  [UserGroup.VETERINARIAN]: ["animal"],
  [UserGroup.VOLUNTEER]: ["animal"],
};

const RESOURCE_PATHNAME = "/resources/global-search";

export function GlobalSearch() {
  const [isOpened, setIsOpened] = useState(false);
  const [type, setType] = useState<Type | null>(null);

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
  // We can't load during a navigation or it will cancel the navigation.
  const load = fetcher.load;
  useEffect(() => {
    if (!isOpened && !isNavigating) {
      load(
        createPath({
          pathname: RESOURCE_PATHNAME,
          search: new GlobalSearchParams().setType(type).toString(),
        })
      );
    }
  }, [load, isOpened, isNavigating, type]);

  // - Set the first possible type once we get it.
  // - Reset to the first possible type when the combobox is closed.
  const firstPossibleType = fetcher.data?.possibleTypes[0];
  useEffect(() => {
    if (firstPossibleType != null && (type == null || !isOpened)) {
      setType(firstPossibleType);
    }
  }, [firstPossibleType, type, isOpened]);

  return (
    <Dialog.Root
      open={isOpened}
      onOpenChange={(isOpened) => {
        // Only open the search if we have a type.
        setIsOpened(isOpened && type != null);
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
        <Overlay asChild>
          <Dialog.Overlay />
        </Overlay>

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col md:top-[10vh] md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:w-[550px] md:shadow-ambient md:bg-white md:rounded-1">
          {type != null ? (
            <Combobox
              type={type}
              setType={setType}
              fetcher={fetcher}
              onClose={() => setIsOpened(false)}
              onSelectedItemChange={(item) => {
                if (item.type === "animal") {
                  navigate(`/animals/${item.id}`);
                } else {
                  navigate(`/foster-families/${item.id}`);
                }
              }}
              onSelectSearch={(search) => {
                if (type === "animal") {
                  navigate(
                    createPath({
                      pathname: "/animals/search",
                      search: new AnimalSearchParams()
                        .setNameOrAlias(search)
                        .toString(),
                    })
                  );
                } else {
                  navigate(
                    createPath({
                      pathname: "/foster-families",
                      search: new FosterFamilySearchParams()
                        .setDisplayName(search)
                        .toString(),
                    })
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
  type,
  setType,
  fetcher,
  onSelectedItemChange,
  onSelectSearch,
  onClose,
}: {
  type: Type;
  setType: React.Dispatch<Type>;
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

      if (item.type === "animal") {
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
            hideFocusRing
            name={GlobalSearchParams.Keys.TEXT}
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

        <TypeInput
          type={type}
          setType={setType}
          possibleTypes={fetcher.data?.possibleTypes ?? []}
        />
      </header>

      <section
        className={cn("bg-white flex flex-col", {
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

            if (item.type === "animal") {
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

function TypeInput({
  type,
  setType,
  possibleTypes,
}: {
  type: Type;
  setType: React.Dispatch<Type>;
  possibleTypes: Type[];
}) {
  if (possibleTypes.length < 2) {
    return null;
  }

  return (
    <Tabs className="py-0.5">
      {possibleTypes.map((possibleType) => (
        <span
          key={possibleType}
          className="flex flex-col first:pl-safe-1 last:pr-safe-1 md:first:pl-1 md:last:pr-1"
        >
          <Tab>
            <TabInput
              type="radio"
              name={GlobalSearchParams.Keys.TYPE}
              value={possibleType}
              checked={possibleType === type}
              onChange={() => setType(possibleType)}
            />

            <TabLabel>{TYPE_TRANSLATION_FOR_TABS[possibleType]}</TabLabel>
          </Tab>
        </span>
      ))}
    </Tabs>
  );
}

const TYPE_TRANSLATION_FOR_TABS: Record<Type, string> = {
  animal: "Animaux",
  fosterFamily: "FA",
};

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
        "overflow-auto scrollbars-none grid grid-flow-col justify-start gap-0.5"
      )}
    >
      {children}
    </div>
  );
}

function Tab({ children }: { children?: React.ReactNode }) {
  return (
    <label className="group relative z-0 rounded-0.5 flex cursor-pointer focus-within:z-10">
      {children}
    </label>
  );
}

function TabInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="peer appearance-none absolute -z-10 top-0 left-0 w-full h-full rounded-0.5 cursor-pointer transition-colors duration-100 ease-in-out group-hover:bg-gray-100 checked:bg-blue-50 group-hover:checked:bg-blue-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    />
  );
}

function TabLabel({ children }: { children?: React.ReactNode }) {
  return (
    <span className="px-1 py-0.5 text-body-emphasis text-gray-500 peer-checked:text-blue-500">
      {children}
    </span>
  );
}
