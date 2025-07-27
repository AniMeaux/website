import { DynamicImage } from "#core/data-display/image";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { Markdown, SENTENCE_COMPONENTS } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { LegalStatus } from "#show/exhibitors/applications/legal-status";
import { ImageUrl, getCompleteLocation } from "@animeaux/core";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./loader.server";

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
            sizeMapping={{ default: "160px", sm: "100vw", md: "33vw" }}
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
              icon={<Icon href="icon-fingerprint-light" />}
            >
              {LegalStatus.getVisibleValue({
                legalStatus: application.structureLegalStatus,
                legalStatusOther: application.structureLegalStatusOther,
              })}{" "}
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
                .map((target) => ActivityTarget.translation[target])
                .join(", ")}
            </SimpleItem>

            <SimpleItem isLightIcon icon={<Icon href="icon-tags-light" />}>
              {application.structureActivityFields
                .map((field) => ActivityField.translation[field])
                .join(", ")}
            </SimpleItem>
          </ItemList>
        </div>
      </Card.Content>
    </Card>
  );
}
