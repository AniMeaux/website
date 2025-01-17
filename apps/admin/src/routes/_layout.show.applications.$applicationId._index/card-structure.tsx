import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { TRANSLATION_BY_ACTIVITY_FIELD } from "#show/exhibitors/activity-field/translation";
import { TRANSLATION_BY_ACTIVITY_TARGET } from "#show/exhibitors/activity-target/translation";
import { LEGAL_STATUS_TRANSLATION } from "#show/exhibitors/applications/legal-status";
import { ImageUrl, getCompleteLocation } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardStructure() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Structure</Card.Title>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-2">
          <DynamicImage
            imageId={ImageUrl.parse(application.structureLogoPath).id}
            alt={application.structureName}
            sizeMapping={{ sm: "100vw", md: "33vw", default: "160px" }}
            fallbackSize="512"
            background="none"
            className="w-full rounded-2 border border-gray-200"
          />

          <ItemList>
            <SimpleItem
              isLightIcon
              icon={<Icon href="icon-house-building-light" />}
            >
              {application.structureName}
            </SimpleItem>

            <SimpleItem
              isLightIcon
              icon={<Icon href="icon-location-dot-light" />}
            >
              <Markdown components={SENTENCE_COMPONENTS}>
                {getCompleteLocation({
                  address: application.structureAddress,
                  zipCode: application.structureZipCode,
                  city: application.structureCity,
                  country: application.structureCountry,
                })}
              </Markdown>
            </SimpleItem>

            <SimpleItem
              isLightIcon
              icon={<Icon href="icon-envelope-open-dollar-light" />}
            >
              <Markdown components={SENTENCE_COMPONENTS}>
                {getCompleteLocation({
                  address: application.billingAddress,
                  zipCode: application.billingZipCode,
                  city: application.billingCity,
                  country: application.billingCountry,
                })}
              </Markdown>
            </SimpleItem>

            <SimpleItem
              isLightIcon
              icon={<Icon href="icon-fingerprint-light" />}
            >
              {application.structureLegalStatus == null
                ? application.structureOtherLegalStatus
                : LEGAL_STATUS_TRANSLATION[
                    application.structureLegalStatus
                  ]}{" "}
              • {application.structureSiret}
            </SimpleItem>

            <SimpleItem isLightIcon icon={<Icon href="icon-globe-light" />}>
              {application.structureUrl}
            </SimpleItem>

            <SimpleItem
              isLightIcon
              icon={<Icon href="icon-bullseye-arrow-light" />}
            >
              {application.structureActivityTargets
                .map((target) => TRANSLATION_BY_ACTIVITY_TARGET[target])
                .join(", ")}
            </SimpleItem>

            <SimpleItem isLightIcon icon={<Icon href="icon-tags-light" />}>
              {application.structureActivityFields
                .map((field) => TRANSLATION_BY_ACTIVITY_FIELD[field])
                .join(", ")}
            </SimpleItem>
          </ItemList>
        </div>
      </Card.Content>
    </Card>
  );
}
