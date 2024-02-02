import { toBooleanAttribute } from "#core/attributes";
import { BaseTextInput } from "#core/form-elements/base-text-input";
import { Input } from "#core/form-elements/input";
import {
  ResourceComboboxLayout,
  ResourceInputLayout,
  SuggestionItem,
  SuggestionList,
} from "#core/form-elements/resource-input";
import { Routes, useNavigate } from "#core/navigation";
import { NextSearchParams } from "#core/search-params";
import { FosterFamilySuggestionItem } from "#foster-families/item";
import { FosterFamilySearchParams } from "#foster-families/search-params";
import { Icon } from "#generated/icon";
import type { loader } from "#routes/resources.foster-family/route";
import type { FosterFamily } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { SerializeFrom } from "@remix-run/node";
import { useFetcher, useLocation } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useState } from "react";

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
                }),
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
  ref,
) {
  const rightAdornments = [
    fosterFamily != null ? (
      <BaseTextInput.ActionAdornment
        key="remove"
        onClick={() => setFosterFamily(null)}
      >
        <Icon id="x-mark" />
      </BaseTextInput.ActionAdornment>
    ) : null,
    <BaseTextInput.Adornment key="caret">
      <Icon id="caret-down" />
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
          }),
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
