import { Color, UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LoaderArgs, SerializeFrom, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useState } from "react";
import { ColorSearchParams } from "~/colors/searchParams";
import { toBooleanAttribute } from "~/core/attributes";
import { db } from "~/core/db.server";
import { BaseTextInput } from "~/core/formElements/baseTextInput";
import { Input } from "~/core/formElements/input";
import {
  NoSuggestion,
  ResourceComboboxLayout,
  ResourceInputLayout,
  SuggestionItem,
  SuggestionList,
} from "~/core/formElements/resourceInput";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = ColorSearchParams.parse(
    new URL(request.url).searchParams
  );

  return json({
    colors: await db.color.fuzzySearch({
      name: searchParams.name,
      maxHitCount: 6,
    }),
  });
}

const RESOURCE_PATHNAME = "/resources/color";

type ColorInputProps = {
  name: string;
  defaultValue?: null | Pick<Color, "id" | "name">;
  disabled?: boolean;
  hasError?: boolean;
};

export const ColorInput = forwardRef<
  React.ComponentRef<typeof InputTrigger>,
  ColorInputProps
>(function ColorInput(
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
      load(RESOURCE_PATHNAME);
    }
  }, [load, isOpened]);

  const [color, setColor] = useState(defaultValue);

  return (
    <>
      {
        // Conditionally rendering the hidden input allows us to make it
        // optional in the enclosing form.
        color != null ? (
          <input type="hidden" name={name} value={color.id} />
        ) : null
      }

      <ResourceInputLayout
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        inputTrigger={(triggerElement) => (
          <InputTrigger
            ref={ref}
            color={color}
            disabled={disabled}
            hasError={hasError}
            setColor={setColor}
            triggerElement={triggerElement}
          />
        )}
        content={
          <Combobox
            color={color}
            colors={fetcher.data?.colors ?? []}
            onInputValueChange={(value) => {
              fetcher.load(
                createPath({
                  pathname: RESOURCE_PATHNAME,
                  search: ColorSearchParams.stringify({ name: value }),
                })
              );
            }}
            onSelectedItem={(color) => {
              setColor(color);
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
    color: null | Pick<Color, "id" | "name">;
    setColor: React.Dispatch<null | Pick<Color, "id" | "name">>;
    hasError: boolean;
    triggerElement: React.ElementType<React.ComponentPropsWithoutRef<"button">>;
  }
>(function InputTrigger(
  { disabled, color, setColor, hasError, triggerElement: TriggerElement },
  ref
) {
  const rightAdornments = [
    <BaseTextInput.Adornment>
      <Icon id="caretDown" />
    </BaseTextInput.Adornment>,
  ];
  if (color != null) {
    rightAdornments.unshift(
      <BaseTextInput.ActionAdornment onClick={() => setColor(null)}>
        <Icon id="xMark" />
      </BaseTextInput.ActionAdornment>
    );
  }

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
          {color?.name}
        </TriggerElement>
      </BaseTextInput>

      <BaseTextInput.AdornmentContainer
        side="left"
        adornment={
          <BaseTextInput.Adornment>
            <Icon id="palette" />
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

function Combobox({
  color: selectedColor,
  colors,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  color: null | Pick<Color, "id" | "name">;
  colors: SerializeFrom<typeof loader>["colors"];
  onInputValueChange: React.Dispatch<string>;
  onSelectedItem: React.Dispatch<null | Pick<Color, "id" | "name">>;
  onClose: () => void;
}) {
  const combobox = useCombobox({
    isOpen: true,
    items: colors,
    itemToString: (color) => color?.name ?? "",
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
          Rechercher une couleur
        </VisuallyHidden.Root>
      }
      input={(leftAdornment) => (
        <Input
          hideFocusRing
          type="search"
          variant="transparent"
          placeholder="Rechercher une couleur"
          leftAdornment={leftAdornment}
          {...combobox.getInputProps()}
        />
      )}
      list={
        <SuggestionList {...combobox.getMenuProps()}>
          {colors.map((color, index) => (
            <SuggestionItem
              // For some reason, if `key` is not passed before
              // `...combobox.getItemProps`, the app crash with:
              // > Unexpected Server Error
              // > Error: Element type is invalid: expected a string (for
              // > built-in components) or a class/function (for composite
              // > components) but got: undefined. You likely forgot to export
              // > your component from the file it's defined in, or you might
              // > have mixed up default and named imports.
              key={color.id}
              {...combobox.getItemProps({ item: color, index })}
              isValue={selectedColor?.id === color.id}
              leftAdornment={<Icon id="palette" />}
              label={color.highlightedName}
            />
          ))}

          {colors.length === 0 ? (
            <NoSuggestion>Aucune couleur trouvée</NoSuggestion>
          ) : null}
        </SuggestionList>
      }
    />
  );
}
