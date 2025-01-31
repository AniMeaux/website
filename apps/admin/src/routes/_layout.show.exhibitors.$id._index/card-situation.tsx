import { ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { Icon } from "#generated/icon";
import {
  ApplicationStatusIcon,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#show/exhibitors/applications/status";
import {
  PAYMENT_TRANSLATIONS,
  PaymentIcon,
  paymentFromBoolean,
} from "#show/exhibitors/payment";
import { VisibilityIcon, visibilityFromBoolean } from "#show/visibility";
import { joinReactNodes } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import { Fragment } from "react/jsx-runtime";
import type { loader } from "./route";

export function CardSituation() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <ItemVisibility />
          <ItemPayment />
          <ItemApplication />
          <ItemLocationNumber />
          <ItemExhibitorSpace />
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function ItemVisibility() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      icon={
        <VisibilityIcon
          visibility={visibilityFromBoolean(exhibitor.isVisible)}
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

function ItemPayment() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <SimpleItem
      isLightIcon
      icon={<PaymentIcon payment={paymentFromBoolean(exhibitor.hasPaid)} />}
    >
      <strong className="text-body-emphasis">
        {PAYMENT_TRANSLATIONS[paymentFromBoolean(exhibitor.hasPaid)]}
      </strong>
    </SimpleItem>
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
