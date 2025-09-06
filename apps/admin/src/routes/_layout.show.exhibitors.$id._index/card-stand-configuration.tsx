import { Action, ProseInlineAction } from "#core/actions";
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
import { InstallationDay } from "#show/exhibitors/stand-configuration/installation-day";
import { StandConfigurationStatusIcon } from "#show/exhibitors/stand-configuration/status";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { StatusHelper } from "#show/exhibitors/status-helper";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

export function CardStandConfiguration() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Configuration de stand</Card.Title>

        <Action variant="text" asChild>
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
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <StandConfigurationStatusIcon
            status={exhibitor.standConfigurationStatus}
          />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.standConfigurationStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.standConfigurationStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.standConfigurationStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

function ItemPeopleCount() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-people-group-light" />}>
      <strong className="text-body-emphasis">{exhibitor.peopleCount}</strong>{" "}
      personne
      {exhibitor.peopleCount > 1 ? "s" : null} sur le stand
      <br />
      Avec{" "}
      <strong className="text-body-emphasis">
        {exhibitor.chairCount}
      </strong>{" "}
      chaise{exhibitor.chairCount > 1 ? "s" : null}
    </SimpleItem>
  );
}

function ItemTable() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-table-picnic-light" />}>
      <strong className="text-body-emphasis">{exhibitor.tableCount}</strong>{" "}
      table{exhibitor.tableCount > 1 ? "s" : null}
      <br />
      <strong className="text-body-emphasis">
        {exhibitor.hasTablecloths ? "Avec" : "Sans"}
      </strong>{" "}
      nappage
    </SimpleItem>
  );
}

function ItemDivider() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fence-light" />}>
      {exhibitor.dividerType == null ? (
        <strong className="text-body-emphasis">Aucune cloison</strong>
      ) : (
        <>
          <strong className="text-body-emphasis">
            {exhibitor.dividerCount}
          </strong>{" "}
          cloison
          {exhibitor.dividerCount > 1 ? "s" : null} type{" "}
          <strong className="text-body-emphasis">
            {exhibitor.dividerType.label}
          </strong>
        </>
      )}
    </SimpleItem>
  );
}

function ItemStandInfo() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-store-light" />}>
      Stand de{" "}
      <ProseInlineAction asChild>
        <BaseLink to={Routes.show.standSizes.id(exhibitor.size.id).toString()}>
          {exhibitor.size.label}
        </BaseLink>
      </ProseInlineAction>
      <br />
      <strong className="text-body-emphasis">
        {exhibitor.hasElectricalConnection ? "Avec" : "Sans"}
      </strong>{" "}
      raccordement électrique
    </SimpleItem>
  );
}

function ItemInstallationDay() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.installationDay == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-calendar-day-light" />}>
      Installation le{" "}
      <strong className="text-body-emphasis">
        {InstallationDay.translation[exhibitor.installationDay]}
      </strong>
    </SimpleItem>
  );
}

function ItemComment() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.placementComment == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-comment-light" />}>
      <Markdown components={SENTENCE_COMPONENTS}>
        {exhibitor.placementComment}
      </Markdown>
    </SimpleItem>
  );
}
