import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { ACTIVITY_FIELD_TRANSLATION } from "#show/applications/activity-field";
import { ACTIVITY_TARGET_TRANSLATION } from "#show/applications/activity-target";
import { LEGAL_STATUS_TRANSLATION } from "#show/applications/legal-status";
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
            className="w-full rounded-2 border border-gray-200"
          />

          <ItemList>
            <SimpleItem icon={<Icon href="icon-house-building-solid" />}>
              {application.structureName}
            </SimpleItem>

            <SimpleItem icon={<Icon href="icon-location-dot-solid" />}>
              <Markdown components={SENTENCE_COMPONENTS}>
                {getCompleteLocation({
                  address: application.structureAddress,
                  zipCode: application.structureZipCode,
                  city: application.structureCity,
                  country: application.structureCountry,
                })}
              </Markdown>
            </SimpleItem>

            <SimpleItem icon={<Icon href="icon-envelope-open-dollar-solid" />}>
              <Markdown components={SENTENCE_COMPONENTS}>
                {getCompleteLocation({
                  address: application.billingAddress,
                  zipCode: application.billingZipCode,
                  city: application.billingCity,
                  country: application.billingCountry,
                })}
              </Markdown>
            </SimpleItem>

            <SimpleItem icon={<Icon href="icon-fingerprint-solid" />}>
              {application.structureLegalStatus == null
                ? application.structureOtherLegalStatus
                : LEGAL_STATUS_TRANSLATION[
                    application.structureLegalStatus
                  ]}{" "}
              • {application.structureSiret}
            </SimpleItem>

            <SimpleItem icon={<Icon href="icon-globe-solid" />}>
              {application.structureUrl}
            </SimpleItem>

            <SimpleItem icon={<Icon href="icon-bullseye-arrow-solid" />}>
              {application.structureActivityTargets
                .map((target) => ACTIVITY_TARGET_TRANSLATION[target])
                .join(", ")}
            </SimpleItem>

            <SimpleItem icon={<Icon href="icon-tags-solid" />}>
              {application.structureActivityFields
                .map((field) => ACTIVITY_FIELD_TRANSLATION[field])
                .join(", ")}
            </SimpleItem>
          </ItemList>
        </div>
      </Card.Content>
    </Card>
  );
}
