import { AnimalSuggestionItem } from "#animals/item.tsx";
import { getAnimalDisplayName } from "#animals/profile/name.tsx";
import { AnimalSearchParams } from "#animals/searchParams.ts";
import { cn } from "#core/classNames.ts";
import { db } from "#core/db.server.ts";
import { BaseTextInput } from "#core/formElements/baseTextInput.tsx";
import { Input } from "#core/formElements/input.tsx";
import {
  SuggestionItem,
  SuggestionList,
} from "#core/formElements/resourceInput.tsx";
import { Routes, useNavigate } from "#core/navigation.ts";
import { Overlay } from "#core/popovers/overlay.tsx";
import { ForbiddenResponse } from "#core/response.server.ts";
import { zsp } from "#core/schemas.tsx";
import { createSearchParams } from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { FosterFamilySuggestionItem } from "#fosterFamilies/item.tsx";
import { FosterFamilySearchParams } from "#fosterFamilies/searchParams.ts";
import { Icon } from "#generated/icon.tsx";
import type { User } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { FetcherWithComponents } from "@remix-run/react";
import { useFetcher, useNavigation } from "@remix-run/react";
import type {
  UseComboboxState,
  UseComboboxStateChangeOptions,
} from "downshift";
import { useCombobox } from "downshift";
import { createPath } from "history";
import orderBy from "lodash.orderby";
import { useEffect, useState } from "react";

const MAX_HIT_COUNT = 6;

enum Entity {
  ANIMAL = "ANIMAL",
  FOSTER_FAMILY = "FOSTER_FAMILY",
}

const ENTITY_TRANSLATION: Record<Entity, string> = {
  [Entity.ANIMAL]: "Animaux",
  [Entity.FOSTER_FAMILY]: "FA",
};

const SORTED_ENTITIES = orderBy(
  Object.values(Entity),
  (entity) => ENTITY_TRANSLATION[entity]
);

const GlobalSearchParams = createSearchParams({
  text: { key: "q", schema: zsp.text() },
  entity: zsp.optionalEnum(Entity),
});

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
    UserGroup.VOLUNTEER,
  ]);

  const searchParams = GlobalSearchParams.parse(
    new URL(request.url).searchParams
  );

  const possibleEntities = getPossibleEntitiesForCurrentUser(currentUser);
  const entity =
    searchParams.entity ??
    SORTED_ENTITIES.find((entity) => possibleEntities.has(entity));

  if (entity == null || !possibleEntities.has(entity)) {
    throw new ForbiddenResponse();
  }

  if (searchParams.text == null) {
    return json({
      possibleEntities: Array.from(possibleEntities),
      items: [],
    });
  }

  if (entity === Entity.ANIMAL) {
    const animals = await db.animal.fuzzySearch({
      nameOrAlias: searchParams.text,
      maxHitCount: MAX_HIT_COUNT,
    });
    const items = animals.map((animal) => ({
      type: Entity.ANIMAL as const,
      ...animal,
    }));
    return json({
      possibleEntities: Array.from(possibleEntities),
      items,
    });
  }

  const fosterFamilies = await db.fosterFamily.fuzzySearch({
    displayName: searchParams.text,
    maxHitCount: MAX_HIT_COUNT,
  });

  const items = fosterFamilies.map((fosterFamily) => ({
    type: Entity.FOSTER_FAMILY as const,
    ...fosterFamily,
  }));

  return json({
    possibleEntities: Array.from(possibleEntities),
    items,
  });
}

function getPossibleEntitiesForCurrentUser(currentUser: Pick<User, "groups">) {
  const possibleEntities = new Set<Entity>();
  currentUser.groups.forEach((group) => {
    ALLOWED_ENTITIES_PER_GROUP[group].forEach((entity) =>
      possibleEntities.add(entity)
    );
  });
  return possibleEntities;
}

const ALLOWED_ENTITIES_PER_GROUP: Record<UserGroup, Set<Entity>> = {
  [UserGroup.ADMIN]: new Set([Entity.ANIMAL, Entity.FOSTER_FAMILY]),
  [UserGroup.ANIMAL_MANAGER]: new Set([Entity.ANIMAL, Entity.FOSTER_FAMILY]),
  [UserGroup.BLOGGER]: new Set(),
  [UserGroup.HEAD_OF_PARTNERSHIPS]: new Set(),
  [UserGroup.VETERINARIAN]: new Set([Entity.ANIMAL]),
  [UserGroup.VOLUNTEER]: new Set([Entity.ANIMAL]),
};

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

    return undefined;
  }, [isOpened]);

  const fetcher = useFetcher<typeof loader>();
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
        })
      );
    }
  }, [load, isOpened, isNavigating, entity]);

  // - Set the first possible type once we get it.
  // - Reset to the first possible type when the combobox is closed.
  const firstPossibleEntity = SORTED_ENTITIES.find((entity) =>
    possibleEntities.has(entity)
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
        <Overlay asChild>
          <Dialog.Overlay />
        </Overlay>

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col md:top-[10vh] md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:w-[550px] md:shadow-ambient md:bg-white md:rounded-1">
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
                    })
                  );
                } else {
                  navigate(
                    createPath({
                      pathname: Routes.fosterFamilies.toString(),
                      search: FosterFamilySearchParams.stringify({
                        displayName: search,
                      }),
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

      <header className="sticky top-0 z-20 flex-none bg-white flex flex-col md:pb-0.5">
        <div className="px-safe-1 pt-safe-0.5 pb-0.5 flex flex-col md:px-1 md:pt-1 ">
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
        )
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
