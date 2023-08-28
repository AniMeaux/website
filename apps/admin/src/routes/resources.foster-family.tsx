import { toBooleanAttribute } from "#core/attributes.ts";
import { db } from "#core/db.server.ts";
import { BaseTextInput } from "#core/formElements/baseTextInput.tsx";
import { Input } from "#core/formElements/input.tsx";
import {
  ResourceComboboxLayout,
  ResourceInputLayout,
  SuggestionItem,
  SuggestionList,
} from "#core/formElements/resourceInput.tsx";
import { Routes, useNavigate } from "#core/navigation.ts";
import { NextSearchParams } from "#core/searchParams.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { FosterFamilySuggestionItem } from "#fosterFamilies/item.tsx";
import { FosterFamilySearchParams } from "#fosterFamilies/searchParams.ts";
import { Icon } from "#generated/icon.tsx";
import type { FosterFamily } from "@prisma/client";
import { UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLocation } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useState } from "react";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = FosterFamilySearchParams.parse(
    new URL(request.url).searchParams
  );

  return json({
    fosterFamilies: await db.fosterFamily.fuzzySearch({
      displayName: searchParams.displayName,
      // Use 5 instead of 6 to save space for the additional item.
      maxHitCount: 5,
    }),
  });
}

type FosterFamilyInputProps = {
  name: string;
  defaultValue?: null | Pick<FosterFamily, "id" | "displayName">;
  disabled?: boolean;
  hasError?: boolean;
};

export const FosterFamilyInput = forwardRef<
  React.ComponentRef<typeof InputTrigger>,
  FosterFamilyInputProps
>(function FosterFamilyInput(
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
      load(Routes.resources.fosterFamily.toString());
    }
  }, [load, isOpened]);

  const [fosterFamily, setFosterFamily] = useState(defaultValue);

  return (
    <>
      {
        // Conditionally rendering the hidden input allows us to make it
        // optional in the enclosing form.
        fosterFamily != null ? (
          <input type="hidden" name={name} value={fosterFamily.id} />
        ) : null
      }

      <ResourceInputLayout
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        inputTrigger={(triggerElement) => (
          <InputTrigger
            ref={ref}
            fosterFamily={fosterFamily}
            disabled={disabled}
            hasError={hasError}
            setFosterFamily={setFosterFamily}
            triggerElement={triggerElement}
          />
        )}
        content={
          <Combobox
            fosterFamily={fosterFamily}
            fosterFamilies={fetcher.data?.fosterFamilies ?? []}
            onInputValueChange={(value) => {
              fetcher.load(
                createPath({
                  pathname: Routes.resources.fosterFamily.toString(),
                  search: FosterFamilySearchParams.stringify({
                    displayName: value,
                  }),
                })
              );
            }}
            onSelectedItem={(fosterFamily) => {
              setFosterFamily(fosterFamily);
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
    fosterFamily: null | Pick<FosterFamily, "id" | "displayName">;
    setFosterFamily: React.Dispatch<null | Pick<
      FosterFamily,
      "id" | "displayName"
    >>;
    hasError: boolean;
    triggerElement: React.ElementType<React.ComponentPropsWithoutRef<"button">>;
  }
>(function InputTrigger(
  {
    disabled,
    fosterFamily,
    setFosterFamily,
    hasError,
    triggerElement: TriggerElement,
  },
  ref
) {
  const rightAdornments = [
    fosterFamily != null ? (
      <BaseTextInput.ActionAdornment
        key="remove"
        onClick={() => setFosterFamily(null)}
      >
        <Icon id="xMark" />
      </BaseTextInput.ActionAdornment>
    ) : null,
    <BaseTextInput.Adornment key="caret">
      <Icon id="caretDown" />
    </BaseTextInput.Adornment>,
  ].filter(Boolean);

  return (
    <BaseTextInput.Root aria-disabled={disabled}>
      <BaseTextInput
        asChild
        variant="outlined"
        leftAdornmentCount={1}
        rightAdornmentCount={rightAdornments.length}
      >
        <TriggerElement
          ref={ref}
          type="button"
          disabled={disabled}
          data-invalid={toBooleanAttribute(hasError)}
        >
          {fosterFamily?.displayName}
        </TriggerElement>
      </BaseTextInput>

      <BaseTextInput.AdornmentContainer
        side="left"
        adornment={
          <BaseTextInput.Adornment>
            <Icon id="house" />
          </BaseTextInput.Adornment>
        }
      />

      <BaseTextInput.AdornmentContainer
        side="right"
        adornment={rightAdornments}
      />
    </BaseTextInput.Root>
  );
});

type FosterFamilyHit = SerializeFrom<typeof loader>["fosterFamilies"][number];

function Combobox({
  fosterFamily: selectedFosterFamily,
  fosterFamilies,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  fosterFamily: null | Pick<FosterFamily, "id" | "displayName">;
  fosterFamilies: FosterFamilyHit[];
  onInputValueChange: React.Dispatch<string>;
  onSelectedItem: React.Dispatch<null | Pick<
    FosterFamily,
    "id" | "displayName"
  >>;
  onClose: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const visibleFosterFamilies: (
    | (FosterFamilyHit & { isAdditional?: undefined })
    | { isAdditional: true }
  )[] = [...fosterFamilies, { isAdditional: true }];

  const combobox = useCombobox({
    isOpen: true,
    items: visibleFosterFamilies,
    itemToString: (fosterFamily) =>
      fosterFamily?.isAdditional
        ? "additional"
        : fosterFamily?.displayName ?? "",
    onSelectedItemChange: ({ selectedItem = null }) => {
      if (selectedItem?.isAdditional) {
        navigate(
          createPath({
            pathname: Routes.fosterFamilies.new.toString(),
            search: NextSearchParams.stringify({ next: createPath(location) }),
          })
        );
      } else {
        onSelectedItem(selectedItem);
      }
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
          Rechercher une famille d’accueil
        </VisuallyHidden.Root>
      }
      input={(leftAdornment) => (
        <Input
          hideFocusRing
          type="search"
          variant="transparent"
          placeholder="Rechercher une famille d’accueil"
          leftAdornment={leftAdornment}
          {...combobox.getInputProps()}
        />
      )}
      list={
        <SuggestionList {...combobox.getMenuProps()}>
          {visibleFosterFamilies.map((fosterFamily, index) => {
            if (fosterFamily.isAdditional) {
              return (
                <SuggestionItem
                  // For some reason, if `key` is not passed before
                  // `...combobox.getItemProps`, the app crash with:
                  // > Unexpected Server Error
                  // > Error: Element type is invalid: expected a string (for
                  // > built-in components) or a class/function (for composite
                  // > components) but got: undefined. You likely forgot to export
                  // > your component from the file it's defined in, or you might
                  // > have mixed up default and named imports.
                  key="additional"
                  {...combobox.getItemProps({ item: fosterFamily, index })}
                  isAdditional
                  label={`Créer une **famille d’accueil**`}
                />
              );
            }

            return (
              <FosterFamilySuggestionItem
                // For some reason, if `key` is not passed before
                // `...combobox.getItemProps`, the app crash with:
                // > Unexpected Server Error
                // > Error: Element type is invalid: expected a string (for
                // > built-in components) or a class/function (for composite
                // > components) but got: undefined. You likely forgot to export
                // > your component from the file it's defined in, or you might
                // > have mixed up default and named imports.
                key={fosterFamily.id}
                {...combobox.getItemProps({ item: fosterFamily, index })}
                isValue={selectedFosterFamily?.id === fosterFamily.id}
                fosterFamily={fosterFamily}
              />
            );
          })}
        </SuggestionList>
      }
    />
  );
}
