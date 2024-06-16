import { PickUpLocationSearchParams } from "#animals/search-params";
import { toBooleanAttribute } from "#core/attributes";
import { BaseTextInput } from "#core/form-elements/base-text-input";
import { Input } from "#core/form-elements/input";
import {
  NoSuggestion,
  ResourceComboboxLayout,
  ResourceInputLayout,
  SuggestionItem,
  SuggestionList,
} from "#core/form-elements/resource-input";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import type { loader } from "#routes/resources.pick-up-location/route";
import { MAX_HIT_COUNT } from "#routes/resources.pick-up-location/shared";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useState } from "react";

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
  ref,
) {
  const [isOpened, setIsOpened] = useState(false);
  const fetcher = useFetcher<loader>();

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
                  search: PickUpLocationSearchParams.format({
                    text: value,
                  }),
                }),
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
  ref,
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
            <Icon href="icon-location-dot" />
          </BaseTextInput.Adornment>
        }
      />

      <BaseTextInput.AdornmentContainer
        side="right"
        adornment={
          <BaseTextInput.Adornment>
            <Icon href="icon-caret-down" />
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
        pickUpLocation.value.toLowerCase() !== normalizedSearch,
    )
  ) {
    // Replace the last item by the additional one so we always have at most
    // SEARCH_COUNT items.
    if (visiblePickUpLocation.length === MAX_HIT_COUNT) {
      visiblePickUpLocation.splice(-1);
    }

    visiblePickUpLocation.push({
      id: cleanedSearch,
      value: cleanedSearch,
      isAdditional: true,
      _highlighted: {
        value: `Ajouter : **${cleanedSearch}**`,
      },
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
              leftAdornment={<Icon href="icon-location-dot" />}
              label={pickUpLocation._highlighted.value}
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
