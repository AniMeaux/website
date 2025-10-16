import { Action } from "#core/actions/action";
import { InputActiveFilter } from "#core/form-elements/input-active-filter";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import { ActivityField } from "#exhibitors/activity-field/activity-field";
import {
  ACTIVITY_TARGET_ICON,
  ACTIVITY_TARGET_TRANSLATION,
} from "#exhibitors/activity-target/activity-target";
import { ExhibitorItem } from "#exhibitors/item";
import {
  ExhibitorSearchParams,
  useExhibitorSearchParams,
} from "#exhibitors/search-params";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";
import { ModalFilters } from "./modal-filters";
import { SearchParamsForm } from "./search-params-form";

export function SectionList() {
  const { exhibitors } = useLoaderData<typeof loader>();

  return (
    <ModalFilters.Root>
      <Section.Root columnCount={1}>
        <SearchParamsForm className="flex flex-wrap items-center gap-1">
          <ModalFilters.Trigger asChild>
            <Action type="button" color="alabaster" className="flex-none">
              Filtrer
            </Action>
          </ModalFilters.Trigger>

          <ActiveFilterSponsorshipAndLaureats />
          <ActiveFilterAnimations />
          <ActiveFilterFields />
          <ActiveFilterTargets />
        </SearchParamsForm>

        <ul className="grid grid-cols-1 items-start gap-4 xs:grid-cols-2 md:grid-cols-3">
          <BecomeExhibitorItem />

          {exhibitors.map((exhibitor, index) => (
            <ExhibitorItem
              key={exhibitor.id}
              exhibitor={{
                activityFields: exhibitor.activityFields,
                activityTargets: exhibitor.activityTargets,
                hasOnStageAnimation: exhibitor.hasOnStageAnimation,
                isSponsor: exhibitor.isSponsor,
                isOrganizer: exhibitor.isOrganizer,
                isOrganizersFavorite: exhibitor.isOrganizersFavorite,
                logoPath: exhibitor.logoPath,
                name: exhibitor.name,
                url: exhibitor.url,
                onStandAnimations: exhibitor.onStandAnimations || undefined,
              }}
              imageLoading={index < 5 ? "eager" : "lazy"}
              imageSizes={{
                default: "100vw",
                xs: "50vw",
                md: "30vw",
                lg: "310px",
              }}
            />
          ))}
        </ul>
      </Section.Root>

      <ModalFilters.Portal>
        <ModalFilters.Card />
      </ModalFilters.Portal>
    </ModalFilters.Root>
  );
}

function BecomeExhibitorItem() {
  return (
    <li className="grid grid-cols-1 gap-2">
      <LightBoardCard isSmall className="aspect-4/3">
        <Pictogram
          id="stand-mystic"
          height="42%"
          width={undefined}
          className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2"
        />
      </LightBoardCard>

      <Action asChild className="justify-self-center">
        <Link to={Routes.exhibitors.application.toString()}>
          Devenez exposant
        </Link>
      </Action>
    </li>
  );
}

function ActiveFilterAnimations() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return Array.from(exhibitorSearchParams.eventTypes).map((eventType) => (
    <InputActiveFilter.Root key={eventType}>
      <InputActiveFilter.Input
        name={ExhibitorSearchParams.io.keys.eventTypes}
        value={eventType}
      />

      <InputActiveFilter.Icon asChild>
        <Icon id={ExhibitorSearchParams.EventType.icon[eventType].solid} />
      </InputActiveFilter.Icon>

      <InputActiveFilter.Label>
        {ExhibitorSearchParams.EventType.translationLong[eventType]}
      </InputActiveFilter.Label>

      <InputActiveFilter.RemoveIcon />
    </InputActiveFilter.Root>
  ));
}

function ActiveFilterFields() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return Array.from(exhibitorSearchParams.fields).map((activityField) => (
    <InputActiveFilter.Root key={activityField}>
      <InputActiveFilter.Input
        name={ExhibitorSearchParams.io.keys.fields}
        value={activityField}
      />

      <InputActiveFilter.Icon asChild>
        <Icon id={ActivityField.icon[activityField].solid} />
      </InputActiveFilter.Icon>

      <InputActiveFilter.Label>
        {ActivityField.translation[activityField]}
      </InputActiveFilter.Label>

      <InputActiveFilter.RemoveIcon />
    </InputActiveFilter.Root>
  ));
}

function ActiveFilterSponsorshipAndLaureats() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  const filtersNodes: React.ReactNode[] = [];

  if (exhibitorSearchParams.isSponsor) {
    filtersNodes.push(
      <InputActiveFilter.Root key="sponsor">
        <InputActiveFilter.Input
          name={ExhibitorSearchParams.io.keys.isSponsor}
          value="on"
        />

        <InputActiveFilter.Icon asChild>
          <Icon id="award-solid" />
        </InputActiveFilter.Icon>

        <InputActiveFilter.Label>Sponsor</InputActiveFilter.Label>

        <InputActiveFilter.RemoveIcon />
      </InputActiveFilter.Root>,
    );
  }

  if (exhibitorSearchParams.isOrganizersFavorite) {
    filtersNodes.push(
      <InputActiveFilter.Root key="organizers-favorite">
        <InputActiveFilter.Input
          name={ExhibitorSearchParams.io.keys.isOrganizersFavorite}
          value="on"
        />

        <InputActiveFilter.Icon asChild>
          <Icon id="heart-solid" />
        </InputActiveFilter.Icon>

        <InputActiveFilter.Label>Coup de cœur</InputActiveFilter.Label>

        <InputActiveFilter.RemoveIcon />
      </InputActiveFilter.Root>,
    );
  }

  return filtersNodes;
}

function ActiveFilterTargets() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return Array.from(exhibitorSearchParams.targets).map((activityTarget) => (
    <InputActiveFilter.Root key={activityTarget}>
      <InputActiveFilter.Input
        name={ExhibitorSearchParams.io.keys.targets}
        value={activityTarget}
      />

      <InputActiveFilter.Icon asChild>
        <Icon id={ACTIVITY_TARGET_ICON[activityTarget].solid} />
      </InputActiveFilter.Icon>

      <InputActiveFilter.Label>
        {ACTIVITY_TARGET_TRANSLATION[activityTarget]}
      </InputActiveFilter.Label>

      <InputActiveFilter.RemoveIcon />
    </InputActiveFilter.Root>
  ));
}
