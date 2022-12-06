import { Breed, Species, UserGroup } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useCombobox } from "downshift";
import { createPath } from "history";
import { forwardRef, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { searchBreeds } from "~/breeds/db.server";
import { BreedSearchParams } from "~/breeds/searchParams";
import { asBooleanAttribute } from "~/core/attributes";
import { cn } from "~/core/classNames";
import { HIGHLIGHT_COMPONENTS, Markdown } from "~/core/dataDisplay/markdown";
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { Input } from "~/core/formElements/input";
import { inputClassName, InputWrapper } from "~/core/formElements/inputWrapper";
import { Card, CardContent } from "~/core/layout/card";
import { ScreenSizeValue, useScreenSizeCondition } from "~/core/screenSize";
import { getCurrentUser } from "~/currentUser/db.server";
import { assertCurrentUserHasGroups } from "~/currentUser/groups.server";
import { Icon } from "~/generated/icon";

export async function loader({ request }: LoaderArgs) {
  const currentUser = await getCurrentUser(request, {
    select: { id: true, groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
  ]);

  const breedSearchParams = new BreedSearchParams(
    new URL(request.url).searchParams
  );

  return json({ breeds: await searchBreeds(breedSearchParams) });
}

const RESOURCE_PATHNAME = "/resources/breeds";

type BreedInputProps = {
  name: string;
  defaultValue?: null | Pick<Breed, "id" | "name">;
  species?: Species;
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

    const isMedium = useScreenSizeCondition(
      (screenSize) => screenSize >= ScreenSizeValue.md
    );
    const Layout = isMedium ? MediumLayout : SmallLayout;

    const [isOpened, setIsOpened] = useState(false);
    const breedsFetcher = useFetcher<typeof loader>();

    // This effect does 2 things:
    // - Make sure we display breeds without delay when the combobox is opened.
    // - Make sure we clear any search when the combobox is closed.
    const loadBreeds = breedsFetcher.load;
    useEffect(() => {
      if (!isOpened) {
        loadBreeds(
          createPath({
            pathname: RESOURCE_PATHNAME,
            search: new BreedSearchParams().setSpecies(species).toString(),
          })
        );
      }
    }, [loadBreeds, isOpened, species]);

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

        <Layout
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
              isMedium={isMedium}
              breed={breed}
              breeds={breedsFetcher.data?.breeds ?? []}
              onInputValueChange={(value) => {
                breedsFetcher.load(
                  createPath({
                    pathname: RESOURCE_PATHNAME,
                    search: new BreedSearchParams()
                      .setSpecies(species)
                      .setText(value)
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
        data-invalid={asBooleanAttribute(hasError)}
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

type LayoutProps = {
  isOpened: boolean;
  setIsOpened: React.Dispatch<boolean>;
  inputTriggerRef: React.RefObject<HTMLButtonElement>;
  inputTrigger: (
    triggerElement: React.ElementType<
      React.ButtonHTMLAttributes<HTMLButtonElement>
    >
  ) => React.ReactNode;
  content: React.ReactNode;
};

function SmallLayout({
  isOpened,
  setIsOpened,
  inputTrigger,
  content,
}: LayoutProps) {
  return (
    <Dialog.Root open={isOpened} onOpenChange={setIsOpened}>
      {inputTrigger(Dialog.Trigger)}

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "top-0 right-0 bottom-0 left-0 z-30 overscroll-none bg-black/20"
          )}
        />

        <Dialog.Content className="fixed top-0 left-0 bottom-0 right-0 z-30 overflow-y-auto bg-gray-50 flex flex-col">
          <VisuallyHidden.Root>
            <Dialog.Title>Rechercher une race</Dialog.Title>
          </VisuallyHidden.Root>

          {content}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function MediumLayout({
  isOpened,
  setIsOpened,
  inputTriggerRef,
  inputTrigger,
  content,
}: LayoutProps) {
  return (
    <Popover.Root open={isOpened} onOpenChange={setIsOpened}>
      {inputTrigger(Popover.Trigger)}

      <Popover.Portal>
        <Popover.Content
          // Using a Ref callback is the only way to set the content width at
          // the right moment. Effect and layout effect don't run in sync with
          // the component mounting.
          ref={(element) => {
            if (element != null && inputTriggerRef.current != null) {
              element.style.width = `${inputTriggerRef.current.clientWidth}px`;
            }
          }}
          align="start"
          className="z-10 bg-white shadow-ambient rounded-b-1 flex flex-col"
        >
          {content}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Combobox({
  isMedium,
  breed: selectedBreed,
  breeds,
  onInputValueChange,
  onSelectedItem,
  onClose,
}: {
  isMedium: boolean;
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

  const Layout = isMedium ? MediumComboboxLayout : SmallComboboxLayout;

  return (
    <Layout
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
        <ul {...combobox.getMenuProps()} className="flex flex-col">
          {breeds.map((breed, index) => (
            <li
              key={breed.id}
              {...combobox.getItemProps({ item: breed, index })}
              data-is-value={asBooleanAttribute(selectedBreed?.id === breed.id)}
              className="group relative z-0 rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)_auto] items-start cursor-pointer aria-selected:bg-gray-50 data-[is-value=true]:bg-gray-100 data-[is-value=true]:aria-selected:bg-gray-100"
            >
              <span className="h-4 w-4 flex items-center justify-center text-gray-600 text-[20px]">
                <Icon id="dna" />
              </span>

              <span className="py-1 text-body-default group-data-[is-value=true]:text-body-emphasis">
                <Markdown components={HIGHLIGHT_COMPONENTS}>
                  {breed.highlightedName}
                </Markdown>
              </span>

              <span className="opacity-0 h-4 w-4 flex items-center justify-center text-green-600 transition-opacity duration-100 ease-in-out group-data-[is-value=true]:opacity-100">
                <Icon id="check" />
              </span>
            </li>
          ))}

          {breeds.length === 0 ? (
            <li className="h-4 flex flex-col justify-center">
              <p className="text-gray-500 text-center">Aucune race trouvée</p>
            </li>
          ) : null}
        </ul>
      }
    />
  );
}

type ComboboxLayoutProps = {
  label: React.ReactNode;
  input: (leftAdornment: React.ReactNode) => React.ReactNode;
  list: React.ReactNode;
};

function SmallComboboxLayout({ label, input, list }: ComboboxLayoutProps) {
  return (
    <div className="flex flex-col gap-1">
      <header className="sticky top-0 z-20 px-safe-1 pt-safe-0.5 pb-0.5 flex-none bg-white flex flex-col">
        {label}
        {input(
          <Dialog.Close asChild>
            <ActionAdornment>
              <Icon id="angleLeft" />
            </ActionAdornment>
          </Dialog.Close>
        )}
      </header>

      <Card>
        <CardContent>{list}</CardContent>
      </Card>
    </div>
  );
}

function MediumComboboxLayout({ label, input, list }: ComboboxLayoutProps) {
  return (
    <div className="flex flex-col">
      <header className="border-b border-gray-100 p-1 flex flex-col">
        {label}
        {input(
          <Popover.Close asChild>
            <ActionAdornment>
              <Icon id="angleLeft" />
            </ActionAdornment>
          </Popover.Close>
        )}
      </header>

      <section className="p-1 flex flex-col">{list}</section>
    </div>
  );
}
