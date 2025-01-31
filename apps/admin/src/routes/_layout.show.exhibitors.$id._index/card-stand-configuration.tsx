import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import {
  ARTICLE_COMPONENTS,
  Markdown,
  SENTENCE_COMPONENTS,
} from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import { DividerType } from "#show/exhibitors/stand-configuration/divider";
import { InstallationDay } from "#show/exhibitors/stand-configuration/installation-day";
import { StandSize } from "#show/exhibitors/stand-configuration/stand-size";
import { StandZone } from "#show/exhibitors/stand-configuration/stand-zone";
import {
  StandConfigurationStatus,
  StandConfigurationStatusIcon,
} from "#show/exhibitors/stand-configuration/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardStandConfiguration() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Configuration de stand</Card.Title>

        <Action asChild variant="text">
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.standConfiguration.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
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
          {StandConfigurationStatus.translation[standConfiguration.status]}
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
            {DividerType.translation[standConfiguration.dividerType]}
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
        {StandSize.translation[standConfiguration.size]}
      </strong>
      {standConfiguration.zone != null ? (
        <>
          <br />
          En{" "}
          <strong className="text-body-emphasis">
            {StandZone.translation[standConfiguration.zone]}
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

function ItemInstallationDay() {
  const { standConfiguration } = useLoaderData<typeof loader>();

  if (standConfiguration.installationDay == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-calendar-day-light" />}>
      Installation le{" "}
      <strong className="text-body-emphasis">
        {InstallationDay.translation[standConfiguration.installationDay]}
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
