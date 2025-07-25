import { GENDER_ICON, GENDER_TRANSLATION } from "#animals/gender.js";
import { Action } from "#core/actions.js";
import { BaseLink } from "#core/base-link.js";
import { Empty } from "#core/data-display/empty.js";
import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown.js";
import { Card } from "#core/layout/card.js";
import { Separator } from "#core/layout/separator.js";
import { Routes } from "#core/navigation.js";
import { Icon } from "#generated/icon.js";
import { DogsConfigurationStatusIcon } from "#show/exhibitors/dogs-configuration/status.js";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { StatusHelper } from "#show/exhibitors/status-helper.js";
import { joinReactNodes } from "@animeaux/core";
import { Gender } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardDogsConfiguration() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Chiens sur stand</Card.Title>

        <Action variant="text" asChild>
          <BaseLink
            to={Routes.show.exhibitors
              .id(exhibitor.id)
              .edit.dogsConfiguration.toString()}
          >
            Modifier
          </BaseLink>
        </Action>
      </Card.Header>

      <Card.Content>
        <DogsConfigurationStatusHelper />

        {exhibitor.dogs.length > 0 ? (
          joinReactNodes(
            exhibitor.dogs.map((dog) => <DogItem key={dog.id} dog={dog} />),
            <Separator />,
          )
        ) : (
          <Empty.Root>
            <Empty.Content>
              <Empty.Message>Aucun chien sur stand prévu</Empty.Message>
            </Empty.Content>
          </Empty.Root>
        )}
      </Card.Content>
    </Card>
  );
}

function DogsConfigurationStatusHelper() {
  const { exhibitor } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <DogsConfigurationStatusIcon
            status={exhibitor.dogsConfigurationStatus}
          />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {ExhibitorStatus.translation[exhibitor.dogsConfigurationStatus]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {exhibitor.dogsConfigurationStatusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {exhibitor.dogsConfigurationStatusMessage}
          </Markdown>
        </StatusHelper.Content>
      ) : null}
    </StatusHelper.Root>
  );
}

function DogItem({
  dog,
}: {
  dog: {
    id: string;
    gender: Gender;
    idNumber: string;
    isCategorized: boolean;
    isSterilized: boolean;
  };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
      <ItemList>
        <ItemIdentification idNumber={dog.idNumber} />
        <ItemGender gender={dog.gender} />
      </ItemList>

      <ItemList>
        <ItemSterilisation
          isSterilized={dog.isSterilized}
          gender={dog.gender}
        />

        <ItemCategorization
          isCategorized={dog.isCategorized}
          gender={dog.gender}
        />
      </ItemList>
    </div>
  );
}

function ItemGender({ gender }: { gender: Gender }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href={GENDER_ICON[gender].light} />}>
      {gender === Gender.FEMALE ? "Est une" : "Est un"}{" "}
      <strong className="text-body-emphasis">
        {GENDER_TRANSLATION[gender]}
      </strong>
    </SimpleItem>
  );
}

function ItemIdentification({ idNumber }: { idNumber: string }) {
  return (
    <SimpleItem isLightIcon icon={<Icon href="icon-fingerprint-light" />}>
      Identification :{" "}
      <strong className="text-body-emphasis">{idNumber}</strong>
    </SimpleItem>
  );
}

function ItemSterilisation({
  isSterilized,
  gender,
}: {
  isSterilized: boolean;
  gender: Gender;
}) {
  return (
    <SimpleItem
      isLightIcon
      icon={
        <Icon
          href={
            isSterilized ? "icon-scissors-light" : "icon-scissors-slash-light"
          }
        />
      }
    >
      {isSterilized ? (
        <>
          Est{" "}
          <strong className="text-body-emphasis">
            {gender === Gender.FEMALE ? "stérilisée" : "castré"}
          </strong>
        </>
      ) : (
        <>
          N’est{" "}
          <strong className="text-body-emphasis">
            pas {gender === Gender.FEMALE ? "stérilisée" : "castré"}
          </strong>
        </>
      )}
    </SimpleItem>
  );
}

function ItemCategorization({
  isCategorized,
  gender,
}: {
  isCategorized: boolean;
  gender: Gender;
}) {
  return (
    <SimpleItem
      isLightIcon
      icon={
        <Icon
          href={
            isCategorized ? "icon-list-ol-light" : "icon-list-ol-slash-light"
          }
        />
      }
    >
      {isCategorized ? (
        <>
          Est{" "}
          <strong className="text-body-emphasis">
            {gender === Gender.FEMALE ? "catégorisée" : "catégorisé"}
          </strong>
        </>
      ) : (
        <>
          N’est{" "}
          <strong className="text-body-emphasis">
            pas {gender === Gender.FEMALE ? "catégorisée" : "catégorisé"}
          </strong>
        </>
      )}
    </SimpleItem>
  );
}
