import { Action, ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import {
  ApplicationStatusIcon,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#show/exhibitors/applications/status";
import { Payment, PaymentIcon } from "#show/exhibitors/payment";
import { PartnershipCategory } from "#show/partners/category";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { joinReactNodes } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react/jsx-runtime";
import type { loader } from "./route";

export function CardSituation() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.situation.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemVisibility />
          <ItemPayment />
          <ItemLocationNumber />
          <ItemApplication />
          <ItemPartnership />
          <ItemExhibitorSpace />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemApplication() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={<ApplicationStatusIcon status={application.status} />}
    >
      Candidature{" "}
      <ProseInlineAction asChild>
        <BaseLink to={Routes.show.applications.id(application.id).toString()}>
          {TRANSLATION_BY_APPLICATION_STATUS[application.status]}
        </BaseLink>
      </ProseInlineAction>
    </SimpleItem>
  );
}

function ItemExhibitorSpace() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={<Icon href="icon-arrow-up-right-from-square-light" />}
    >
      Voir son{" "}
      <ProseInlineAction asChild>
        <a
          href={`${CLIENT_ENV.SHOW_URL}/exposants/${exhibitor.token}`}
          target="_blank"
          rel="noreferrer"
        >
          espace exposant
        </a>
      </ProseInlineAction>
    </SimpleItem>
  );
}

function ItemLocationNumber() {
  const { exhibitor } = useLoaderData<typeof loader>();

  if (exhibitor.standNumber == null && exhibitor.locationNumber == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-expand-light" />}>
      {joinReactNodes(
        [
          exhibitor.standNumber != null ? (
            <Fragment key="stand-number">
              Stand nº
              <strong className="text-body-emphasis">
                {exhibitor.standNumber}
              </strong>
            </Fragment>
          ) : null,
          exhibitor.locationNumber != null ? (
            <Fragment key="location-number">
              Emplacement nº
              <strong className="text-body-emphasis">
                {exhibitor.locationNumber}
              </strong>
            </Fragment>
          ) : null,
        ].filter(Boolean),
        <br />,
      )}
    </SimpleItem>
  );
}

function ItemPartnership() {
  const { partner } = useLoaderData<typeof loader>();

  if (partner == null) {
    return null;
  }

  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-award-light" />}>
      Partenaire{" "}
      <ProseInlineAction asChild>
        <BaseLink to={Routes.show.partners.id(partner.id).toString()}>
          {PartnershipCategory.translation[partner.category]}
        </BaseLink>
      </ProseInlineAction>
    </SimpleItem>
  );
}

function ItemPayment() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={<PaymentIcon payment={Payment.fromBoolean(exhibitor.hasPaid)} />}
    >
      <strong className="text-body-emphasis">
        {Payment.translation[Payment.fromBoolean(exhibitor.hasPaid)]}
      </strong>
    </SimpleItem>
  );
}

function ItemVisibility() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      icon={
        <VisibilityIcon
          visibility={Visibility.fromBoolean(exhibitor.isVisible)}
        />
      }
    >
      {exhibitor.isVisible ? (
        <>
          <strong className="text-body-emphasis">Est visible</strong> sur le
          site
        </>
      ) : (
        <>
          <strong className="text-body-emphasis">N’est pas visible</strong> sur
          le site
        </>
      )}
    </SimpleItem>
  );
}
