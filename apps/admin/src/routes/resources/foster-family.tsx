import { FosterFamily, UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
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
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { fuzzySearchFosterFamilies } from "~/fosterFamilies/db.server";
import { getShortLocation } from "~/fosterFamilies/location";
import { FosterFamilySearchParams } from "~/fosterFamilies/searchParams";
import { Icon } from "~/generated/icon";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const searchParams = new FosterFamilySearchParams(
    new URL(request.url).searchParams
  );

  return json({
    fosterFamilies: await fuzzySearchFosterFamilies(searchParams.getName()),
  });
}

const RESOURCE_PATHNAME = "/resources/foster-family";

type FosterFamilyInputProps = {
  name: string;
  defaultValue?: null | Pick<FosterFamily, "id" | "displayName">;
  disabled?: boolean;
  hasError?: boolean;
};

export const FosterFamilyInput = forwardRef<
  HTMLButtonElement,
  FosterFamilyInputProps
>(function FosterFamilyInput(
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
          search: new FosterFamilySearchParams().toString(),
        })
      );
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
        inputTriggerRef={ref}
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
                  pathname: RESOURCE_PATHNAME,
                  search: new FosterFamilySearchParams()
                    .setName(value)
                    .toString(),
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
  HTMLButtonElement,
  {
    disabled: boolean;
    fosterFamily: null | Pick<FosterFamily, "id" | "displayName">;
    setFosterFamily: React.Dispatch<null | Pick<
      FosterFamily,
      "id" | "displayName"
    >>;
    hasError: boolean;
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >;
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
    <Adornment>
      <Icon id="caretDown" />
    </Adornment>,
  ];
  if (fosterFamily != null) {
    rightAdornments.unshift(
      <ActionAdornment onClick={() => setFosterFamily(null)}>
        <Icon id="xMark" />
      </ActionAdornment>
    );
  }

  return (
    <InputWrapper
      isDisabled={disabled}
      leftAdornment={
        <Adornment>
          <Icon id="house" />
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
        {fosterFamily?.displayName}
      </TriggerElement>
    </InputWrapper>
  );
});

function Combobox({
  fosterFamily: selectedFosterFamily,
  fosterFamilies,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  fosterFamily: null | Pick<FosterFamily, "id" | "displayName">;
  fosterFamilies: SerializeFrom<typeof loader>["fosterFamilies"];
  onInputValueChange: React.Dispatch<string>;
  onSelectedItem: React.Dispatch<null | Pick<
    FosterFamily,
    "id" | "displayName"
  >>;
  onClose: () => void;
}) {
  const combobox = useCombobox({
    isOpen: true,
    items: fosterFamilies,
    itemToString: (fosterFamily) => fosterFamily?.displayName ?? "",
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
          Rechercher une famille d’accueil
        </VisuallyHidden.Root>
      }
      input={(leftAdornment) => (
        <Input
          variant="search"
          placeholder="Rechercher une famille d’accueil"
          leftAdornment={leftAdornment}
          {...combobox.getInputProps()}
        />
      )}
      list={
        <SuggestionList {...combobox.getMenuProps()}>
          {fosterFamilies.map((fosterFamily, index) => (
            <SuggestionItem
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
              leftAdornment={<FosterFamilyAvatar fosterFamily={fosterFamily} />}
              label={fosterFamily.highlightedDisplayName}
              secondaryLabel={getShortLocation(fosterFamily)}
            />
          ))}

          {fosterFamilies.length === 0 ? (
            <NoSuggestion>Aucune famille d’accueil trouvée</NoSuggestion>
          ) : null}
        </SuggestionList>
      }
    />
  );
}
