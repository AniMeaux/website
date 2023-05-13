import { Color, UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { fuzzySearchColors } from "~/colors/db.server";
import { ColorSearchParams } from "~/colors/searchParams";
import { asBooleanAttribute } from "~/core/attributes";
import { cn } from "~/core/classNames";
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { Input } from "~/core/formElements/input";
import { inputClassName, InputWrapper } from "~/core/formElements/inputWrapper";
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

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = new ColorSearchParams(new URL(request.url).searchParams);

  return json({
    colors: await fuzzySearchColors({ name: searchParams.getName() }),
  });
}

const RESOURCE_PATHNAME = "/resources/color";

type ColorInputProps = {
  name: string;
  defaultValue?: null | Pick<Color, "id" | "name">;
  disabled?: boolean;
  hasError?: boolean;
};

export const ColorInput = forwardRef<HTMLButtonElement, ColorInputProps>(
  function ColorInput(
    { name, defaultValue = null, disabled = false, hasError = false },
    propRef
  ) {
    invariant(typeof propRef !== "function", "Only object ref are supported.");
    const localRef = useRef<HTMLButtonElement>(null);
    const ref = propRef ?? localRef;

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
            search: new ColorSearchParams().toString(),
          })
        );
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
          inputTriggerRef={ref}
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
                    search: new ColorSearchParams().setName(value).toString(),
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
  }
);

const InputTrigger = forwardRef<
  HTMLButtonElement,
  {
    disabled: boolean;
    color: null | Pick<Color, "id" | "name">;
    setColor: React.Dispatch<null | Pick<Color, "id" | "name">>;
    hasError: boolean;
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >;
  }
>(function InputTrigger(
  { disabled, color, setColor, hasError, triggerElement: TriggerElement },
  ref
) {
  const rightAdornments = [
    <Adornment>
      <Icon id="caretDown" />
    </Adornment>,
  ];
  if (color != null) {
    rightAdornments.unshift(
      <ActionAdornment onClick={() => setColor(null)}>
        <Icon id="xMark" />
      </ActionAdornment>
    );
  }

  return (
    <InputWrapper
      isDisabled={disabled}
      leftAdornment={
        <Adornment>
          <Icon id="palette" />
        </Adornment>
      }
      rightAdornment={rightAdornments}
    >
      <TriggerElement
        ref={ref}
        type="button"
        disabled={disabled}
        data-invalid={asBooleanAttribute(hasError)}
        className={cn(
          inputClassName({
            leftAdornmentCount: 1,
            rightAdornmentCount: rightAdornments.length,
          })
        )}
      >
        {color?.name}
      </TriggerElement>
    </InputWrapper>
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
          variant="search"
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
