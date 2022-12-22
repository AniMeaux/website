import { AnimalAvatar } from "#/animals/avatar";
import { getAnimalDisplayName } from "#/animals/profile/name";
import { getSpeciesLabels } from "#/animals/species";
import { cn } from "#/core/classNames";
import { Avatar, inferAvatarColor } from "#/core/dataDisplay/avatar";
import { ActionAdornment } from "#/core/formElements/adornment";
import { Input } from "#/core/formElements/input";
import {
  SuggestionItem,
  SuggestionList,
} from "#/core/formElements/resourceInput";
import { ForbiddenResponse } from "#/core/response.server";
import { visit } from "#/core/visitor";
import { getCurrentUser } from "#/currentUser/db.server";
import { FosterFamilyAvatar } from "#/fosterFamilies/avatar";
import { getShortLocation } from "#/fosterFamilies/location";
import { Icon } from "#/generated/icon";
import { searchResources } from "#/searchableResources/db.server";
import { SearchableResourceSearchParams } from "#/searchableResources/searchParams";
import { SearchableResourceType } from "#/searchableResources/type";
import { UserAvatar } from "#/users/avatar";
import { formatDateRange } from "@animeaux/shared";
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

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  const searchParams = new SearchableResourceSearchParams(
    new URL(request.url).searchParams
  );

  const possibleTypes = getCurrentUserSearchableResourceTypes(currentUser);

  const type = searchParams.getType();
  if (type != null && !possibleTypes.includes(type)) {
    throw new ForbiddenResponse();
  }

  return json({
    possibleTypes,
    resources: await searchResources(searchParams, possibleTypes),
  });
}

function getCurrentUserSearchableResourceTypes(currentUser: {
  id: string;
  groups: UserGroup[];
}) {
  let possibleTypes: SearchableResourceType[] = [];
  currentUser.groups.forEach((group) => {
    possibleTypes = possibleTypes.concat(ALLOWED_TYPES_PER_GROUP[group]);
  });
  return Array.from(new Set(possibleTypes));
}

const ALLOWED_TYPES_PER_GROUP: Record<UserGroup, SearchableResourceType[]> = {
  [UserGroup.ADMIN]: [
    SearchableResourceType.ANIMAL,
    SearchableResourceType.EVENT,
    SearchableResourceType.FOSTER_FAMILY,
    SearchableResourceType.USER,
  ],
  [UserGroup.ANIMAL_MANAGER]: [
    SearchableResourceType.ANIMAL,
    SearchableResourceType.FOSTER_FAMILY,
  ],
  [UserGroup.BLOGGER]: [],
  [UserGroup.HEAD_OF_PARTNERSHIPS]: [],
  [UserGroup.VETERINARIAN]: [SearchableResourceType.ANIMAL],
};

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

  const resourcesFetcher = useFetcher<typeof loader>();

  // This effect does 2 things:
  // - Make sure we display possible types without delay when the combobox is
  //   opened.
  // - Make sure we clear any search when the combobox is closed.
  const loadResources = resourcesFetcher.load;
  useEffect(() => {
    if (!isOpened) {
      loadResources(
        createPath({
          pathname: RESOURCE_PATHNAME,
          search: new SearchableResourceSearchParams().toString(),
        })
      );
    }
  }, [loadResources, isOpened]);

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
            fetcher={resourcesFetcher}
            onClose={() => setIsOpened(false)}
            onSelectedItemChange={(resource) => {
              setIsOpened(false);

              const pathname = visit(resource, {
                [SearchableResourceType.ANIMAL]: (resource) =>
                  `/animals/${resource.id}`,
                [SearchableResourceType.EVENT]: (resource) =>
                  `/events/${resource.id}`,
                [SearchableResourceType.FOSTER_FAMILY]: (resource) =>
                  `/foster-families/${resource.id}`,
                [SearchableResourceType.USER]: (resource) =>
                  `/users/${resource.id}`,
              });

              navigate(pathname);
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
  onClose,
}: {
  fetcher: FetcherWithComponents<SerializeFrom<typeof loader>>;
  onSelectedItemChange: React.Dispatch<
    SerializeFrom<typeof loader>["resources"][number]
  >;
  onClose: () => void;
}) {
  const resources = fetcher.data?.resources ?? [];

  const combobox = useCombobox({
    isOpen: true,
    items: resources,
    stateReducer,
    itemToString: (resource) => {
      if (resource === null) {
        return "";
      }

      return visit(resource, {
        [SearchableResourceType.ANIMAL]: (resource) =>
          getAnimalDisplayName(resource.data),
        [SearchableResourceType.EVENT]: (resource) => resource.data.title,
        [SearchableResourceType.FOSTER_FAMILY]: (resource) =>
          resource.data.displayName,
        [SearchableResourceType.USER]: (resource) => resource.data.displayName,
      });
    },
    onSelectedItemChange: ({ selectedItem = null }) => {
      if (selectedItem != null) {
        onSelectedItemChange(selectedItem);
      }
    },
    onIsOpenChange: ({ type }) => {
      if (type === useCombobox.stateChangeTypes.InputKeyDownEscape) {
        onClose();
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
            name={SearchableResourceSearchParams.Keys.TEXT}
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

        <TypeInput possibleTypes={fetcher.data?.possibleTypes ?? []} />
      </header>

      <section
        className={cn("bg-white flex flex-col", {
          "p-1 md:border-t md:border-gray-100": resources.length > 0,
        })}
      >
        <SuggestionList {...combobox.getMenuProps()}>
          {resources.map((resource, index) => {
            const leftAdornment = visit(resource, {
              [SearchableResourceType.ANIMAL]: (resource) => (
                <AnimalAvatar animal={resource.data} loading="eager" />
              ),

              [SearchableResourceType.EVENT]: (resource) => (
                <Avatar
                  icon="calendarDays"
                  color={inferAvatarColor(resource.id)}
                />
              ),

              [SearchableResourceType.FOSTER_FAMILY]: (resource) => (
                <FosterFamilyAvatar fosterFamily={resource} />
              ),

              [SearchableResourceType.USER]: (resource) => (
                <UserAvatar
                  user={{
                    id: resource.id,
                    displayName: resource.data.displayName,
                  }}
                />
              ),
            });

            const displayedValue = visit(resource, {
              [SearchableResourceType.ANIMAL]: (resource) => {
                const displayName = getAnimalDisplayName({
                  name: resource.highlightedData.name,
                  alias: resource.highlightedData.alias,
                });
                const speciesLabels = getSpeciesLabels(resource.data);

                return `${displayName} - ${speciesLabels}`;
              },

              [SearchableResourceType.EVENT]: (resource) => {
                const title = resource.highlightedData.title;
                const date = formatDateRange(
                  resource.data.startDate,
                  resource.data.endDate,
                  { showTime: !resource.data.isFullDay }
                );

                return `${title} - ${date}`;
              },

              [SearchableResourceType.FOSTER_FAMILY]: (resource) => {
                const displayName = resource.highlightedData.displayName;
                const location = getShortLocation(resource.data);
                return `${displayName} - ${location}`;
              },

              [SearchableResourceType.USER]: (resource) => {
                const displayName = resource.highlightedData.displayName;
                const email = resource.data.email;
                return `${displayName} - ${email}`;
              },
            });

            return (
              <SuggestionItem
                key={resource.id}
                {...combobox.getItemProps({ item: resource, index })}
                leftAdornment={leftAdornment}
              >
                {displayedValue}
              </SuggestionItem>
            );
          })}
        </SuggestionList>
      </section>
    </fetcher.Form>
  );
}

function TypeInput({
  possibleTypes,
}: {
  possibleTypes: SearchableResourceType[];
}) {
  if (possibleTypes.length < 2) {
    return null;
  }

  return (
    <Tabs className="py-0.5">
      <span className="pl-1 flex flex-col">
        <Tab>
          <TabInput
            type="radio"
            name={SearchableResourceSearchParams.Keys.TYPE}
            value={SearchableResourceSearchParams.Type.ALL}
            defaultChecked
          />

          <TabLabel>Tout</TabLabel>
        </Tab>
      </span>

      {possibleTypes.map((type) => (
        <span key={type} className="flex flex-col last:pr-1">
          <Tab>
            <TabInput
              type="radio"
              name={SearchableResourceSearchParams.Keys.TYPE}
              value={type}
            />

            <TabLabel>{TYPE_TRANSLATION_FOR_TABS[type]}</TabLabel>
          </Tab>
        </span>
      ))}
    </Tabs>
  );
}

const TYPE_TRANSLATION_FOR_TABS: Record<SearchableResourceType, string> = {
  [SearchableResourceType.ANIMAL]: "Animaux",
  [SearchableResourceType.EVENT]: "Événements",
  [SearchableResourceType.FOSTER_FAMILY]: "FA",
  [SearchableResourceType.USER]: "Utilisateurs",
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
