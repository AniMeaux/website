import { Action } from "#core/actions/action";
import { FormLayout } from "#core/layout/form-layout";
import { ActivityField } from "#exhibitors/activity-field/activity-field";
import {
  ACTIVITY_TARGET_ICON,
  ACTIVITY_TARGET_TRANSLATION,
  SORTED_ACTIVITY_TARGETS,
} from "#exhibitors/activity-target/activity-target";
import {
  ExhibitorSearchParams,
  useExhibitorSearchParams,
} from "#exhibitors/search-params";
import { Icon } from "#generated/icon";
import { cn } from "@animeaux/core";
import * as Dialog from "@radix-ui/react-dialog";
import { useLoaderData } from "@remix-run/react";
import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import type { loader } from "./loader.server";
import { SearchParamsForm } from "./search-params-form";

export const ModalFilters = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Portal: Dialog.Portal,

  Card: forwardRef<React.ComponentRef<typeof Dialog.Overlay>, {}>(
    function ModalFiltersCard(props, ref) {
      const { exhibitors } = useLoaderData<typeof loader>();

      const { elementRef, isStickyBottom, isStickyTop } =
        useScrollState<React.ComponentRef<"div">>();

      return (
        <Dialog.Overlay
          {...props}
          ref={ref}
          className={cn(
            // Use absolute instead of fixed to avoid performances issues when
            // mobile browser's height change due to scroll.
            "absolute",
            "inset-0 z-modal overscroll-none bg-white/50",
          )}
        >
          <Dialog.Content asChild>
            <section
              className={cn(
                "fixed bottom-0 left-0 right-0 top-0 z-modal flex min-h-0 w-full flex-col bg-white md:bottom-auto md:left-1/2 md:right-auto md:top-[10vh] md:max-h-[80vh] md:max-w-[640px] md:-translate-x-1/2 md:rounded-1 md:shadow-modal",
              )}
            >
              <header
                className={cn(
                  "grid flex-none grid-cols-fr-auto items-center gap-2 border-b pb-2 pt-safe-2 px-safe-page-narrow md:gap-4 md:px-2",
                  isStickyTop ? "border-alabaster" : "border-transparent",
                )}
              >
                <Dialog.Title asChild>
                  <FormLayout.Title>Filtrer</FormLayout.Title>
                </Dialog.Title>

                <Dialog.Close
                  title="Fermer"
                  className="grid aspect-square w-2 grid-cols-1-auto rounded-0.5 text-mystic transition-transform duration-normal icon-24 active:text-mystic-700 can-hover:hover:text-mystic-600 can-hover:focus-visible:focus-compact active:can-hover:hover:text-mystic-700"
                >
                  <Icon id="x-mark-light" />
                </Dialog.Close>
              </header>

              <div
                ref={elementRef}
                className="flex min-h-0 flex-col overflow-y-auto overscroll-contain scrollbars-custom"
              >
                <FormLayout.Section
                  className="py-2 px-safe-page-narrow md:px-2"
                  asChild
                >
                  <SearchParamsForm>
                    <FieldSponsorshipAndLaureats />
                    <FieldAnimations />
                    <FieldTargets />
                    <FieldFields />
                  </SearchParamsForm>
                </FormLayout.Section>
              </div>

              <footer
                className={cn(
                  "grid flex-none grid-cols-1-auto justify-center border-t pt-2 pb-safe-2 px-safe-page-narrow md:justify-end md:px-2 md:pb-2",
                  isStickyBottom ? "border-alabaster" : "border-transparent",
                )}
              >
                <Dialog.Close asChild>
                  <Action color="mystic">
                    Voir les exposants ({exhibitors.length})
                  </Action>
                </Dialog.Close>
              </footer>
            </section>
          </Dialog.Content>
        </Dialog.Overlay>
      );
    },
  ),
};

function useScrollState<TELement extends HTMLElement>() {
  const elementRef = useRef<TELement>(null);
  const [isStickyTop, setIsStickyTop] = useState(false);
  const [isStickyBottom, setIsStickyBottom] = useState(false);

  useLayoutEffect(() => {
    invariant(elementRef.current != null, "elementRef.current must be defined");
    const sectionElement = elementRef.current;

    function checkStickyState() {
      setIsStickyTop(sectionElement.scrollTop > 0);

      setIsStickyBottom(
        // Use `Math.ceil` because of decimal values.
        Math.ceil(sectionElement.scrollTop + sectionElement.clientHeight) <
          sectionElement.scrollHeight,
      );
    }

    checkStickyState();

    sectionElement.addEventListener("scroll", checkStickyState);

    return () => {
      sectionElement.removeEventListener("scroll", checkStickyState);
    };
  }, [elementRef]);

  return { elementRef, isStickyTop, isStickyBottom };
}

function FieldAnimations() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  let values: ExhibitorSearchParams.EventType.Enum[] = [];

  if (CLIENT_ENV.FEATURE_FLAG_SHOW_PROGRAM === "true") {
    values.push(ExhibitorSearchParams.EventType.Enum.ON_STAGE);
  }

  if (CLIENT_ENV.FEATURE_FLAG_SHOW_ON_STAND_ANIMATIONS === "true") {
    values.push(ExhibitorSearchParams.EventType.Enum.ON_STAND);
  }

  if (values.length === 0) {
    return null;
  }

  return (
    <FormLayout.Field>
      <FormLayout.Label>Animations</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px" repeatCount="auto-fill">
        {values.map((eventType) => (
          <FormLayout.Selector.Root key={eventType}>
            <FormLayout.Selector.Input
              name={ExhibitorSearchParams.io.keys.eventTypes}
              type="checkbox"
              value={eventType}
              checked={exhibitorSearchParams.eventTypes.has(eventType)}
              onChange={() => {}}
            />

            <FormLayout.Selector.CheckedIcon asChild>
              <Icon
                id={ExhibitorSearchParams.EventType.icon[eventType].solid}
              />
            </FormLayout.Selector.CheckedIcon>

            <FormLayout.Selector.UncheckedIcon asChild>
              <Icon
                id={ExhibitorSearchParams.EventType.icon[eventType].light}
              />
            </FormLayout.Selector.UncheckedIcon>

            <FormLayout.Selector.Label>
              {ExhibitorSearchParams.EventType.translation[eventType]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.CheckboxIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>
    </FormLayout.Field>
  );
}

function FieldFields() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return (
    <FormLayout.Field>
      <FormLayout.Label>Domaines d’activités</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px" repeatCount="auto-fill">
        {ActivityField.values.map((activityField) => (
          <FormLayout.Selector.Root key={activityField}>
            <FormLayout.Selector.Input
              name={ExhibitorSearchParams.io.keys.fields}
              type="checkbox"
              value={activityField}
              checked={exhibitorSearchParams.fields.has(activityField)}
              onChange={() => {}}
            />

            <FormLayout.Selector.CheckedIcon asChild>
              <Icon id={ActivityField.icon[activityField].solid} />
            </FormLayout.Selector.CheckedIcon>

            <FormLayout.Selector.UncheckedIcon asChild>
              <Icon id={ActivityField.icon[activityField].light} />
            </FormLayout.Selector.UncheckedIcon>

            <FormLayout.Selector.Label>
              {ActivityField.translation[activityField]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.CheckboxIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>
    </FormLayout.Field>
  );
}

function FieldSponsorshipAndLaureats() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return (
    <FormLayout.Field>
      <FormLayout.Selectors columnMinWidth="250px" repeatCount="auto-fill">
        {CLIENT_ENV.FEATURE_FLAG_SHOW_SPONSORS === "true" ? (
          <FormLayout.Selector.Root>
            <FormLayout.Selector.Input
              name={ExhibitorSearchParams.io.keys.isSponsor}
              type="checkbox"
              value="on"
              checked={exhibitorSearchParams.isSponsor}
              onChange={() => {}}
            />

            <FormLayout.Selector.CheckedIcon asChild>
              <Icon id="award-solid" />
            </FormLayout.Selector.CheckedIcon>

            <FormLayout.Selector.UncheckedIcon asChild>
              <Icon id="award-light" />
            </FormLayout.Selector.UncheckedIcon>

            <FormLayout.Selector.Label>Sponsor</FormLayout.Selector.Label>

            <FormLayout.Selector.CheckboxIcon />
          </FormLayout.Selector.Root>
        ) : null}

        <FormLayout.Selector.Root>
          <FormLayout.Selector.Input
            name={ExhibitorSearchParams.io.keys.isOrganizersFavorite}
            type="checkbox"
            value="on"
            checked={exhibitorSearchParams.isOrganizersFavorite}
            onChange={() => {}}
          />

          <FormLayout.Selector.CheckedIcon asChild>
            <Icon id="heart-solid" />
          </FormLayout.Selector.CheckedIcon>

          <FormLayout.Selector.UncheckedIcon asChild>
            <Icon id="heart-light" />
          </FormLayout.Selector.UncheckedIcon>

          <FormLayout.Selector.Label>Coup de cœur</FormLayout.Selector.Label>

          <FormLayout.Selector.CheckboxIcon />
        </FormLayout.Selector.Root>
      </FormLayout.Selectors>
    </FormLayout.Field>
  );
}

function FieldTargets() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return (
    <FormLayout.Field>
      <FormLayout.Label>Cibles</FormLayout.Label>

      <FormLayout.Selectors columnMinWidth="250px" repeatCount="auto-fill">
        {SORTED_ACTIVITY_TARGETS.map((activityTarget) => (
          <FormLayout.Selector.Root key={activityTarget}>
            <FormLayout.Selector.Input
              name={ExhibitorSearchParams.io.keys.targets}
              type="checkbox"
              value={activityTarget}
              checked={exhibitorSearchParams.targets.has(activityTarget)}
              onChange={() => {}}
            />

            <FormLayout.Selector.CheckedIcon asChild>
              <Icon id={ACTIVITY_TARGET_ICON[activityTarget].solid} />
            </FormLayout.Selector.CheckedIcon>

            <FormLayout.Selector.UncheckedIcon asChild>
              <Icon id={ACTIVITY_TARGET_ICON[activityTarget].light} />
            </FormLayout.Selector.UncheckedIcon>

            <FormLayout.Selector.Label>
              {ACTIVITY_TARGET_TRANSLATION[activityTarget]}
            </FormLayout.Selector.Label>

            <FormLayout.Selector.CheckboxIcon />
          </FormLayout.Selector.Root>
        ))}
      </FormLayout.Selectors>
    </FormLayout.Field>
  );
}
