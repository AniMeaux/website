import { ItemList, SimpleItem } from "#core/data-display/item";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  SENTENCE_COMPONENTS,
} from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { DIVIDER_TYPE_TRANSLATION } from "#show/exhibitors/stand-configuration/divider";
import { INSTALLATION_DAY_TRANSLATION } from "#show/exhibitors/stand-configuration/installation-day";
import { STAND_SIZE_TRANSLATION } from "#show/exhibitors/stand-configuration/stand-size";
import { STAND_ZONE_TRANSLATION } from "#show/exhibitors/stand-configuration/stand-zone";
import {
  STAND_CONFIGURATION_STATUS_TRANSLATION,
  StandConfigurationStatusIcon,
} from "#show/exhibitors/stand-configuration/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { joinReactNodes } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react";
import type { loader } from "./route";

export function CardStandConfiguration() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Configuration de stand</Card.Title>
      </Card.Header>

      <Card.Content>
        <StandConfigurationStatusHelper />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
          <ItemList>
            <ItemStandInfo />
            <ItemDivider />
            <ItemTable />
            <ItemPeopleCount />
          </ItemList>

          <ItemList>
            <ItemLocationNumber />
            <ItemInstallationDay />
            <ItemComment />
          </ItemList>
        </div>
      </Card.Content>
    </Card>
  );
}

function StandConfigurationStatusHelper() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <StandConfigurationStatusIcon status={standConfiguration.status} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {STAND_CONFIGURATION_STATUS_TRANSLATION[standConfiguration.status]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {standConfiguration.statusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {standConfiguration.statusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

function ItemPeopleCount() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-people-group-light" />}>
      <strong className="text-body-emphasis">
        {standConfiguration.peopleCount}
      </strong>{" "}
      personne
      {standConfiguration.peopleCount > 1 ? "s" : null} sur le stand
      <br />
      Avec{" "}
      <strong className="text-body-emphasis">
        {standConfiguration.chairCount}
      </strong>{" "}
      chaise{standConfiguration.chairCount > 1 ? "s" : null}
    </SimpleItem>
  );
}

function ItemTable() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-table-picnic-light" />}>
      <strong className="text-body-emphasis">
        {standConfiguration.tableCount}
      </strong>{" "}
      table{standConfiguration.tableCount > 1 ? "s" : null}
      <br />
      <strong className="text-body-emphasis">
        {standConfiguration.hasTablecloths ? "Avec" : "Sans"}
      </strong>{" "}
      nappage
    </SimpleItem>
  );
}

function ItemDivider() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fence-light" />}>
      <strong className="text-body-emphasis">
        {standConfiguration.dividerCount}
      </strong>{" "}
      cloison
      {standConfiguration.dividerCount > 1 ? "s" : null}
      {standConfiguration.dividerType != null ? (
        <>
          <br />
          En{" "}
          <strong className="text-body-emphasis">
            {DIVIDER_TYPE_TRANSLATION[standConfiguration.dividerType]}
          </strong>
        </>
      ) : null}
    </SimpleItem>
  );
}

function ItemStandInfo() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-store-light" />}>
      Stand de{" "}
      <strong className="text-body-emphasis">
        {STAND_SIZE_TRANSLATION[standConfiguration.size]}
      </strong>
      {standConfiguration.zone != null ? (
        <>
          <br />
          En{" "}
          <strong className="text-body-emphasis">
            {STAND_ZONE_TRANSLATION[standConfiguration.zone]}
          </strong>
        </>
      ) : null}
      <br />
      <strong className="text-body-emphasis">
        {standConfiguration.hasElectricalConnection ? "Avec" : "Sans"}
      </strong>{" "}
      raccordement électrique
    </SimpleItem>
  );
}

function ItemLocationNumber() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  if (
    standConfiguration.standNumber == null &&
    standConfiguration.locationNumber == null
  ) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-expand-light" />}>
      {joinReactNodes(
        [
          standConfiguration.standNumber != null ? (
            <Fragment key="stand-number">
              Stand nº
              <strong className="text-body-emphasis">
                {standConfiguration.standNumber}
              </strong>
            </Fragment>
          ) : null,
          standConfiguration.locationNumber != null ? (
            <Fragment key="location-number">
              Emplacement nº
              <strong className="text-body-emphasis">
                {standConfiguration.locationNumber}
              </strong>
            </Fragment>
          ) : null,
        ].filter(Boolean),
        <br />,
      )}
    </SimpleItem>
  );
}

function ItemInstallationDay() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  if (standConfiguration.installationDay == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-calendar-day-light" />}>
      Installation le{" "}
      <strong className="text-body-emphasis">
        {INSTALLATION_DAY_TRANSLATION[standConfiguration.installationDay]}
      </strong>
    </SimpleItem>
  );
}

function ItemComment() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  if (standConfiguration.placementComment == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-comment-light" />}>
      <Markdown components={SENTENCE_COMPONENTS}>
        {standConfiguration.placementComment}
      </Markdown>
    </SimpleItem>
  );
}
