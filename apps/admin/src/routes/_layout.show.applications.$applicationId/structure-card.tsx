import { DynamicImage } from "#core/data-display/image.js";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { getCompleteLocation } from "#core/data-display/location";
import { Card } from "#core/layout/card";
import { Icon } from "#generated/icon";
import { ACTIVITY_FIELD_TRANSLATION } from "#show/applications/activity-field";
import { LEGAL_STATUS_TRANSLATION } from "#show/applications/legal-status";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function StructureCard() {
  const { application } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Structure</Card.Title>
      </Card.Header>

      <Card.Content>
        <ItemList>
          <SimpleItem icon={<Icon href="icon-house-building" />}>
            {application.structureName}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-location-dot" />}>
            {getCompleteLocation({
              address: application.structureAddress,
              zipCode: application.structureZipCode,
              city: application.structureCity,
              country: application.structureCountry,
            })}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-fingerprint" />}>
            {application.structureLegalStatus == null
              ? application.structureOtherLegalStatus
              : LEGAL_STATUS_TRANSLATION[application.structureLegalStatus]}{" "}
            • {application.structureSiret}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-globe" />}>
            {application.structureUrl}
          </SimpleItem>

          <SimpleItem icon={<Icon href="icon-tags" />}>
            {application.structureActivityFields
              .map((field) => ACTIVITY_FIELD_TRANSLATION[field])
              .join(", ")}
          </SimpleItem>
        </ItemList>

        <DynamicImage
          imageId={application.structureLogoPath}
          alt={application.structureName}
          sizeMapping={{ md: "200px", default: "160px" }}
          fallbackSize="512"
          className="w-full rounded-0.5"
        />
      </Card.Content>
    </Card>
  );
}
