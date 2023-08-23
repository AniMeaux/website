import { PickUpLocationSearchParams } from "#animals/searchParams.ts";
import { toBooleanAttribute } from "#core/attributes.ts";
import { db } from "#core/db.server.ts";
import { BaseTextInput } from "#core/formElements/baseTextInput.tsx";
import { Input } from "#core/formElements/input.tsx";
import {
  NoSuggestion,
  ResourceComboboxLayout,
  ResourceInputLayout,
  SuggestionItem,
  SuggestionList,
} from "#core/formElements/resourceInput.tsx";
import { Routes } from "#core/navigation.ts";
import { assertCurrentUserHasGroups } from "#currentUser/groups.server.ts";
import { Icon } from "#generated/icon.tsx";
import { UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LoaderArgs, SerializeFrom, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useState } from "react";

const MAX_HIT_COUNT = 6;

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = PickUpLocationSearchParams.parse(
    new URL(request.url).searchParams
  );

  return json({
    pickUpLocations: await db.animal.fuzzySearchPickUpLocation({
      text: searchParams.text,
      maxHitCount: MAX_HIT_COUNT,
    }),
  });
}

type PickUpLocationInputProps = {
  name: string;
  defaultValue?: null | string;
  disabled?: boolean;
  hasError?: boolean;
};

export const PickUpLocationInput = forwardRef<
  React.ComponentRef<typeof InputTrigger>,
  PickUpLocationInputProps
>(function PickUpLocationInput(
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
      load(Routes.resources.pickUpLocation.toString());
    }
  }, [load, isOpened]);

  const [pickUpLocation, setPickUpLocation] = useState(defaultValue);

  return (
    <>
      {
        // Conditionally rendering the hidden input allows us to make it
        // optional in the enclosing form.
        pickUpLocation != null ? (
          <input type="hidden" name={name} value={pickUpLocation} />
        ) : null
      }

      <ResourceInputLayout
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        inputTrigger={(triggerElement) => (
          <InputTrigger
            ref={ref}
            pickUpLocation={pickUpLocation}
            disabled={disabled}
            hasError={hasError}
            triggerElement={triggerElement}
          />
        )}
        content={
          <Combobox
            pickUpLocation={pickUpLocation}
            pickUpLocations={fetcher.data?.pickUpLocations ?? []}
            onInputValueChange={(value) => {
              fetcher.load(
                createPath({
                  pathname: Routes.resources.pickUpLocation.toString(),
                  search: PickUpLocationSearchParams.stringify({
                    text: value,
                  }),
                })
              );
            }}
            onSelectedItem={(pickUpLocation) => {
              setPickUpLocation(pickUpLocation);
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
    pickUpLocation: null | string;
    hasError: boolean;
    triggerElement: React.ElementType<React.ComponentPropsWithoutRef<"button">>;
  }
>(function InputTrigger(
  { disabled, pickUpLocation, hasError, triggerElement: TriggerElement },
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
          {pickUpLocation}
        </TriggerElement>
      </BaseTextInput>

      <BaseTextInput.AdornmentContainer
        side="left"
        adornment={
          <BaseTextInput.Adornment>
            <Icon id="locationDot" />
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

type PickUpLocationHit = SerializeFrom<
  typeof loader
>["pickUpLocations"][number];

function Combobox({
  pickUpLocation: selectedPickUpLocation,
  pickUpLocations,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  pickUpLocation: null | string;
  pickUpLocations: PickUpLocationHit[];
  onInputValueChange: React.Dispatch<string>;
  onSelectedItem: React.Dispatch<null | string>;
  onClose: () => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const visiblePickUpLocation: (PickUpLocationHit & {
    isAdditional?: boolean;
  })[] = pickUpLocations.slice();

  const cleanedSearch = inputValue.trim();
  const normalizedSearch = cleanedSearch.toLowerCase();
  if (
    cleanedSearch !== "" &&
    pickUpLocations.every(
      (pickUpLocation) =>
        pickUpLocation.value.toLowerCase() !== normalizedSearch
    )
  ) {
    // Replace the last item by the additional one so we always have at most
    // SEARCH_COUNT items.
    if (visiblePickUpLocation.length === MAX_HIT_COUNT) {
      visiblePickUpLocation.splice(-1);
    }

    visiblePickUpLocation.push({
      value: cleanedSearch,
      highlightedValue: `Ajouter : **${cleanedSearch}**`,
      isAdditional: true,
    });
  }

  const combobox = useCombobox({
    isOpen: true,
    inputValue,
    items: visiblePickUpLocation,
    itemToString: (pickUpLocation) => pickUpLocation?.value ?? "",
    onSelectedItemChange: ({ selectedItem = null }) => {
      onSelectedItem(selectedItem?.value ?? null);
    },
    onInputValueChange: ({ inputValue = "" }) => {
      setInputValue(inputValue);
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
          Rechercher un lieu
        </VisuallyHidden.Root>
      }
      input={(leftAdornment) => (
        <Input
          hideFocusRing
          type="search"
          variant="transparent"
          placeholder="Rechercher un lieu"
          leftAdornment={leftAdornment}
          {...combobox.getInputProps()}
        />
      )}
      list={
        <SuggestionList {...combobox.getMenuProps()}>
          {visiblePickUpLocation.map((pickUpLocation, index) => (
            <SuggestionItem
              // For some reason, if `key` is not passed before
              // `...combobox.getItemProps`, the app crash with:
              // > Unexpected Server Error
              // > Error: Element type is invalid: expected a string (for
              // > built-in components) or a class/function (for composite
              // > components) but got: undefined. You likely forgot to export
              // > your component from the file it's defined in, or you might
              // > have mixed up default and named imports.
              key={pickUpLocation.value}
              {...combobox.getItemProps({ item: pickUpLocation, index })}
              isValue={selectedPickUpLocation === pickUpLocation.value}
              isAdditional={pickUpLocation.isAdditional}
              leftAdornment={<Icon id="locationDot" />}
              label={pickUpLocation.highlightedValue}
            />
          ))}

          {visiblePickUpLocation.length === 0 ? (
            <NoSuggestion>Aucun lieu trouvé</NoSuggestion>
          ) : null}
        </SuggestionList>
      }
    />
  );
}
