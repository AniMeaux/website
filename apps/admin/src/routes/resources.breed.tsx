import { BreedSearchParams } from "#breeds/searchParams.ts";
import { toBooleanAttribute } from "#core/attributes.ts";
import { ensureArray } from "#core/collections.ts";
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
import { Breed, Species, UserGroup } from "@prisma/client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { LoaderArgs, SerializeFrom, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
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

  const searchParams = BreedSearchParams.parse(
    new URL(request.url).searchParams
  );

  return json({
    breeds: await db.breed.fuzzySearch({
      name: searchParams.name,
      species: searchParams.species,
      maxHitCount: 6,
    }),
  });
}

type BreedInputProps = {
  name: string;
  defaultValue?: null | Pick<Breed, "id" | "name">;
  species?: null | Species;
  disabled?: boolean;
  hasError?: boolean;
};

export const BreedInput = forwardRef<
  React.ComponentRef<typeof InputTrigger>,
  BreedInputProps
>(function BreedInput(
  {
    name,
    defaultValue = null,
    species = null,
    disabled = false,
    hasError = false,
  },
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
          pathname: Routes.resources.breed.toString(),
          search: BreedSearchParams.stringify({
            species: new Set(ensureArray(species)),
          }),
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
                  pathname: Routes.resources.breed.toString(),
                  search: BreedSearchParams.stringify({
                    species: new Set(ensureArray(species)),
                    name: value,
                  }),
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
});

const InputTrigger = forwardRef<
  React.ComponentRef<"button">,
  {
    disabled: boolean;
    breed: null | Pick<Breed, "id" | "name">;
    setBreed: React.Dispatch<null | Pick<Breed, "id" | "name">>;
    hasError: boolean;
    triggerElement: React.ElementType<React.ComponentPropsWithoutRef<"button">>;
  }
>(function InputTrigger(
  { disabled, breed, setBreed, hasError, triggerElement: TriggerElement },
  ref
) {
  const rightAdornments = [
    <BaseTextInput.Adornment>
      <Icon id="caretDown" />
    </BaseTextInput.Adornment>,
  ];
  if (breed != null) {
    rightAdornments.unshift(
      <BaseTextInput.ActionAdornment onClick={() => setBreed(null)}>
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
          {breed?.name}
        </TriggerElement>
      </BaseTextInput>

      <BaseTextInput.AdornmentContainer
        side="left"
        adornment={
          <BaseTextInput.Adornment>
            <Icon id="dna" />
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
          hideFocusRing
          type="search"
          variant="transparent"
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
