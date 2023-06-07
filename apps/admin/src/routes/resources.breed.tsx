import { Breed, Species, UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { fuzzySearchBreeds } from "~/breeds/db.server";
import { BreedSearchParams } from "~/breeds/searchParams";
import { toBooleanAttribute } from "~/core/attributes";
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

  const searchParams = new BreedSearchParams(new URL(request.url).searchParams);

  return json({
    breeds: await fuzzySearchBreeds({
      name: searchParams.getName(),
      species: searchParams.getSpecies(),
    }),
  });
}

const RESOURCE_PATHNAME = "/resources/breed";

type BreedInputProps = {
  name: string;
  defaultValue?: null | Pick<Breed, "id" | "name">;
  species?: null | Species;
  disabled?: boolean;
  hasError?: boolean;
};

export const BreedInput = forwardRef<HTMLButtonElement, BreedInputProps>(
  function BreedInput(
    {
      name,
      defaultValue = null,
      species = null,
      disabled = false,
      hasError = false,
    },
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
            search: new BreedSearchParams().setSpecies(species).toString(),
          })
        );
      }
    }, [load, isOpened, species]);

    const [breed, setBreed] = useState(defaultValue);

    return (
      <>
        {
          // Conditionally rendering the hidden input allows us to make it
          // optional in the enclosing form.
          breed != null ? (
            <input type="hidden" name={name} value={breed.id} />
          ) : null
        }

        <ResourceInputLayout
          isOpened={isOpened}
          setIsOpened={setIsOpened}
          inputTriggerRef={ref}
          inputTrigger={(triggerElement) => (
            <InputTrigger
              ref={ref}
              breed={breed}
              disabled={disabled}
              hasError={hasError}
              setBreed={setBreed}
              triggerElement={triggerElement}
            />
          )}
          content={
            <Combobox
              breed={breed}
              breeds={fetcher.data?.breeds ?? []}
              onInputValueChange={(value) => {
                fetcher.load(
                  createPath({
                    pathname: RESOURCE_PATHNAME,
                    search: new BreedSearchParams()
                      .setSpecies(species)
                      .setName(value)
                      .toString(),
                  })
                );
              }}
              onSelectedItem={(breed) => {
                setBreed(breed);
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
    breed: null | Pick<Breed, "id" | "name">;
    setBreed: React.Dispatch<null | Pick<Breed, "id" | "name">>;
    hasError: boolean;
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >;
  }
>(function InputTrigger(
  { disabled, breed, setBreed, hasError, triggerElement: TriggerElement },
  ref
) {
  const rightAdornments = [
    <Adornment>
      <Icon id="caretDown" />
    </Adornment>,
  ];
  if (breed != null) {
    rightAdornments.unshift(
      <ActionAdornment onClick={() => setBreed(null)}>
        <Icon id="xMark" />
      </ActionAdornment>
    );
  }

  return (
    <InputWrapper
      isDisabled={disabled}
      leftAdornment={
        <Adornment>
          <Icon id="dna" />
        </Adornment>
      }
      rightAdornment={rightAdornments}
    >
      <TriggerElement
        ref={ref}
        type="button"
        disabled={disabled}
        data-invalid={toBooleanAttribute(hasError)}
        className={cn(
          inputClassName({
            leftAdornmentCount: 1,
            rightAdornmentCount: rightAdornments.length,
          })
        )}
      >
        {breed?.name}
      </TriggerElement>
    </InputWrapper>
  );
});

function Combobox({
  breed: selectedBreed,
  breeds,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  breed: null | Pick<Breed, "id" | "name">;
  breeds: SerializeFrom<typeof loader>["breeds"];
  onInputValueChange: React.Dispatch<string>;
  onSelectedItem: React.Dispatch<null | Pick<Breed, "id" | "name">>;
  onClose: () => void;
}) {
  const combobox = useCombobox({
    isOpen: true,
    items: breeds,
    itemToString: (breed) => breed?.name ?? "",
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
          Rechercher une race
        </VisuallyHidden.Root>
      }
      input={(leftAdornment) => (
        <Input
          variant="search"
          placeholder="Rechercher une race"
          leftAdornment={leftAdornment}
          {...combobox.getInputProps()}
        />
      )}
      list={
        <SuggestionList {...combobox.getMenuProps()}>
          {breeds.map((breed, index) => (
            <SuggestionItem
              // For some reason, if `key` is not passed before
              // `...combobox.getItemProps`, the app crash with:
              // > Unexpected Server Error
              // > Error: Element type is invalid: expected a string (for
              // > built-in components) or a class/function (for composite
              // > components) but got: undefined. You likely forgot to export
              // > your component from the file it's defined in, or you might
              // > have mixed up default and named imports.
              key={breed.id}
              {...combobox.getItemProps({ item: breed, index })}
              isValue={selectedBreed?.id === breed.id}
              leftAdornment={<Icon id="dna" />}
              label={breed.highlightedName}
            />
          ))}

          {breeds.length === 0 ? (
            <NoSuggestion>Aucune race trouvée</NoSuggestion>
          ) : null}
        </SuggestionList>
      }
    />
  );
}
