import { GENDER_ICON, GENDER_TRANSLATION } from "#animals/gender.js";
import { Empty } from "#core/data-display/empty.js";
import { ItemList, SimpleItem } from "#core/data-display/item.js";
import { ARTICLE_COMPONENTS, Markdown } from "#core/data-display/markdown.js";
import { Card } from "#core/layout/card.js";
import { Separator } from "#core/layout/separator.js";
import { Icon } from "#generated/icon.js";
import {
  DogsConfigurationStatus,
  DogsConfigurationStatusIcon,
} from "#show/exhibitors/dogs-configuration/status.js";
import { StatusHelper } from "#show/exhibitors/status-helper.js";
import { joinReactNodes } from "@animeaux/core";
import { Gender } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "./route";

export function CardDogsConfiguration() {
  const { dogsConfiguration } = useLoaderData<typeof loader>();

  return (
    <Card>
      <Card.Header>
        <Card.Title>Chiens sur stand</Card.Title>
      </Card.Header>

      <Card.Content>
        <DogsConfigurationStatusHelper />

        {dogsConfiguration.dogs.length > 0 ? (
          joinReactNodes(
            dogsConfiguration.dogs.map((dog) => (
              <DogItem key={dog.id} dog={dog} />
            )),
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
  const { dogsConfiguration } = useLoaderData<typeof loader>();

  return (
    <StatusHelper.Root>
      <StatusHelper.Header>
        <StatusHelper.Icon asChild>
          <DogsConfigurationStatusIcon status={dogsConfiguration.status} />
        </StatusHelper.Icon>

        <StatusHelper.Title>
          {DogsConfigurationStatus.translation[dogsConfiguration.status]}
        </StatusHelper.Title>
      </StatusHelper.Header>

      {dogsConfiguration.statusMessage != null ? (
        <StatusHelper.Content>
          <Markdown components={ARTICLE_COMPONENTS}>
            {dogsConfiguration.statusMessage}
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
            {gender === Gender.FEMALE ? "stérilisée" : "stérilisé"}
          </strong>
        </>
      ) : (
        <>
          N’est{" "}
          <strong className="text-body-emphasis">
            pas {gender === Gender.FEMALE ? "stérilisée" : "stérilisé"}
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
