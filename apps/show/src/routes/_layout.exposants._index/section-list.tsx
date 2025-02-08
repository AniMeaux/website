import { Action } from "#core/actions/action";
import { InputActiveFilter } from "#core/form-elements/input-active-filter";
import { LightBoardCard } from "#core/layout/light-board-card";
import { Section } from "#core/layout/section";
import { Routes } from "#core/navigation";
import {
  ACTIVITY_FIELD_ICON,
  ACTIVITY_FIELD_TRANSLATION,
} from "#exhibitors/activity-field/activity-field";
import {
  ACTIVITY_TARGET_ICON,
  ACTIVITY_TARGET_TRANSLATION,
} from "#exhibitors/activity-target/activity-target";
import { ExhibitorItem } from "#exhibitors/item";
import {
  ExhibitorSearchParams,
  ExhibitorSearchParamsN,
  useExhibitorSearchParams,
} from "#exhibitors/search-params";
import { Icon } from "#generated/icon";
import { Pictogram } from "#generated/pictogram";
import { Link, useLoaderData } from "@remix-run/react";
import { ModalFilters } from "./modal-filters";
import type { loader } from "./route";
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

          <ActiveFilterPartnership />
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
                activityFields: exhibitor.profile.activityFields,
                activityTargets: exhibitor.profile.activityTargets,
                hasOnStageAnimation: exhibitor.hasOnStageAnimation,
                isPartner: exhibitor.isPartner,
                isOrganizer: exhibitor.isOrganizer,
                logoPath: exhibitor.profile.logoPath,
                name: exhibitor.profile.name,
                url: exhibitor.profile.url,
                onStandAnimations:
                  exhibitor.profile.onStandAnimations || undefined,
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
        name={ExhibitorSearchParams.keys.eventTypes}
        value={eventType}
      />

      <InputActiveFilter.Icon asChild>
        <Icon id={ExhibitorSearchParamsN.EventType.icon[eventType].solid} />
      </InputActiveFilter.Icon>

      <InputActiveFilter.Label>
        {ExhibitorSearchParamsN.EventType.translationLong[eventType]}
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
        name={ExhibitorSearchParams.keys.fields}
        value={activityField}
      />

      <InputActiveFilter.Icon asChild>
        <Icon id={ACTIVITY_FIELD_ICON[activityField].solid} />
      </InputActiveFilter.Icon>

      <InputActiveFilter.Label>
        {ACTIVITY_FIELD_TRANSLATION[activityField]}
      </InputActiveFilter.Label>

      <InputActiveFilter.RemoveIcon />
    </InputActiveFilter.Root>
  ));
}

function ActiveFilterPartnership() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  if (!exhibitorSearchParams.isPartner) {
    return null;
  }

  return (
    <InputActiveFilter.Root>
      <InputActiveFilter.Input
        name={ExhibitorSearchParams.keys.isPartner}
        value="on"
      />

      <InputActiveFilter.Icon asChild>
        <Icon id="award-solid" />
      </InputActiveFilter.Icon>

      <InputActiveFilter.Label>Partenaire du Salon</InputActiveFilter.Label>

      <InputActiveFilter.RemoveIcon />
    </InputActiveFilter.Root>
  );
}

function ActiveFilterTargets() {
  const { exhibitorSearchParams } = useExhibitorSearchParams();

  return Array.from(exhibitorSearchParams.targets).map((activityTarget) => (
    <InputActiveFilter.Root key={activityTarget}>
      <InputActiveFilter.Input
        name={ExhibitorSearchParams.keys.targets}
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
