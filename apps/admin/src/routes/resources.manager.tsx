import { User, UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useState } from "react";
import { toBooleanAttribute } from "~/core/attributes";
import { BaseTextInput } from "~/core/formElements/baseTextInput";
import { Input } from "~/core/formElements/input";
import {
  NoSuggestion,
  ResourceComboboxLayout,
  ResourceInputLayout,
  SuggestionItem,
  SuggestionList,
} from "~/core/formElements/resourceInput";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { fuzzySearchUsers } from "~/users/db.server";
import { UserSearchParams } from "~/users/searchParams";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = new UserSearchParams(new URL(request.url).searchParams);

  return json({
    managers: await fuzzySearchUsers({
      displayName: searchParams.getDisplayName(),
      groups: [UserGroup.ANIMAL_MANAGER],
      isDisabled: false,
    }),
  });
}

const RESOURCE_PATHNAME = "/resources/manager";

type ManagerInputProps = {
  name: string;
  defaultValue?: null | Pick<User, "id" | "displayName">;
  disabled?: boolean;
  hasError?: boolean;
};

export const ManagerInput = forwardRef<
  React.ComponentRef<typeof InputTrigger>,
  ManagerInputProps
>(function ManagerInput(
  { name, defaultValue = null, disabled = false, hasError = false },
  ref
) {
  const [isOpened, setIsOpened] = useState(false);
  const fetcher = useFetcher<typeof loader>();

  // This effect does 2 things:
  // - Make sure we display suggestions without delay when the combobox is
  //   opened.
  // - Make sure we clear any search when the combobox is closed.
  const load = fetcher.load;
  useEffect(() => {
    if (!isOpened) {
      load(
        createPath({
          pathname: RESOURCE_PATHNAME,
          search: new UserSearchParams().toString(),
        })
      );
    }
  }, [load, isOpened]);

  const [manager, setManager] = useState(defaultValue);

  return (
    <>
      {
        // Conditionally rendering the hidden input allows us to make it
        // optional in the enclosing form.
        manager != null ? (
          <input type="hidden" name={name} value={manager.id} />
        ) : null
      }

      <ResourceInputLayout
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        inputTrigger={(triggerElement) => (
          <InputTrigger
            ref={ref}
            manager={manager}
            disabled={disabled}
            hasError={hasError}
            triggerElement={triggerElement}
          />
        )}
        content={
          <Combobox
            manager={manager}
            managers={fetcher.data?.managers ?? []}
            onInputValueChange={(value) => {
              fetcher.load(
                createPath({
                  pathname: RESOURCE_PATHNAME,
                  search: new UserSearchParams()
                    .setDisplayName(value)
                    .toString(),
                })
              );
            }}
            onSelectedItem={(manager) => {
              setManager(manager);
              setIsOpened(false);
            }}
            onClose={() => setIsOpened(false)}
          />
        }
      />
    </>
  );
});

const InputTrigger = forwardRef<
  React.ComponentRef<"button">,
  {
    disabled: boolean;
    manager: null | Pick<User, "id" | "displayName">;
    hasError: boolean;
    triggerElement: React.ElementType<React.ComponentPropsWithoutRef<"button">>;
  }
>(function InputTrigger(
  { disabled, manager, hasError, triggerElement: TriggerElement },
  ref
) {
  return (
    <BaseTextInput.Root aria-disabled={disabled}>
      <BaseTextInput
        asChild
        variant="outlined"
        leftAdornmentCount={1}
        rightAdornmentCount={1}
      >
        <TriggerElement
          ref={ref}
          type="button"
          disabled={disabled}
          data-invalid={toBooleanAttribute(hasError)}
        >
          {manager?.displayName}
        </TriggerElement>
      </BaseTextInput>

      <BaseTextInput.AdornmentContainer
        side="left"
        adornment={
          <BaseTextInput.Adornment>
            <Icon id="user" />
          </BaseTextInput.Adornment>
        }
      />

      <BaseTextInput.AdornmentContainer
        side="right"
        adornment={
          <BaseTextInput.Adornment>
            <Icon id="caretDown" />
          </BaseTextInput.Adornment>
        }
      />
    </BaseTextInput.Root>
  );
});

function Combobox({
  manager: selectedManager,
  managers,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  manager: null | Pick<User, "id" | "displayName">;
  managers: SerializeFrom<typeof loader>["managers"];
  onInputValueChange: React.Dispatch<string>;
  onSelectedItem: React.Dispatch<null | Pick<User, "id" | "displayName">>;
  onClose: () => void;
}) {
  const combobox = useCombobox({
    isOpen: true,
    items: managers,
    itemToString: (manager) => manager?.displayName ?? "",
    onSelectedItemChange: ({ selectedItem = null }) => {
      onSelectedItem(selectedItem);
    },
    onInputValueChange: ({ inputValue = "" }) => {
      onInputValueChange(inputValue);
    },
    onIsOpenChange: ({ type }) => {
      if (type === useCombobox.stateChangeTypes.InputKeyDownEscape) {
        onClose();
      }
    },
  });

  return (
    <ResourceComboboxLayout
      label={
        <VisuallyHidden.Root {...combobox.getLabelProps()}>
          Rechercher un responsable
        </VisuallyHidden.Root>
      }
      input={(leftAdornment) => (
        <Input
          hideFocusRing
          type="search"
          variant="transparent"
          placeholder="Rechercher un responsable"
          leftAdornment={leftAdornment}
          {...combobox.getInputProps()}
        />
      )}
      list={
        <SuggestionList {...combobox.getMenuProps()}>
          {managers.map((manager, index) => (
            <SuggestionItem
              // For some reason, if `key` is not passed before
              // `...combobox.getItemProps`, the app crash with:
              // > Unexpected Server Error
              // > Error: Element type is invalid: expected a string (for
              // > built-in components) or a class/function (for composite
              // > components) but got: undefined. You likely forgot to export
              // > your component from the file it's defined in, or you might
              // > have mixed up default and named imports.
              key={manager.id}
              {...combobox.getItemProps({ item: manager, index })}
              isValue={selectedManager?.id === manager.id}
              leftAdornment={<UserAvatar user={manager} />}
              label={manager.highlightedDisplayName}
            />
          ))}

          {managers.length === 0 ? (
            <NoSuggestion>Aucun responsable trouvé</NoSuggestion>
          ) : null}
        </SuggestionList>
      }
    />
  );
}
