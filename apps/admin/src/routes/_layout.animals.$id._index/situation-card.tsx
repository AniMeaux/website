import { ADOPTION_OPTION_TRANSLATION } from "#animals/adoption";
import { PICK_UP_REASON_TRANSLATION } from "#animals/pick-up";
import {
  SCREENING_RESULT_ICON,
  SCREENING_RESULT_TRANSLATION,
} from "#animals/screening";
import {
  formatNextVaccinationDate,
  getNextVaccinationState,
  hasUpCommingSterilisation,
} from "#animals/situation/health";
import { STATUS_TRANSLATION, StatusIcon } from "#animals/status";
import { Action, ProseInlineAction } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { InlineHelper } from "#core/data-display/helper";
import { ItemList, SimpleItem } from "#core/data-display/item";
import { HIGHLIGHT_COMPONENTS, Markdown } from "#core/data-display/markdown";
import { Card } from "#core/layout/card";
import { Routes } from "#core/navigation";
import { DropdownSheet } from "#core/popovers/dropdown-sheet";
import { FosterFamilyAvatar } from "#foster-families/avatar";
import { getLongLocation } from "#foster-families/location";
import { Icon } from "#generated/icon";
import { theme } from "#generated/theme";
import { UserAvatar } from "#users/avatar";
import {
  AdoptionOption,
  Diagnosis,
  Gender,
  ScreeningResult,
  Species,
  Status,
} from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import type { loader } from "./route";

export function SituationCard() {
  const { canEdit, animal, canSeeFosterFamilyDetails, canSeeManagerDetails } =
    useLoaderData<loader>();

  let vaccinationHelper: React.ReactNode;

  if (animal.nextVaccinationDate != null) {
    const state = getNextVaccinationState(
      animal.nextVaccinationDate,
      animal.status,
    );

    switch (state) {
      case "past": {
        vaccinationHelper = (
          <InlineHelper variant="error" icon="icon-syringe">
            Une vaccination était prévue{" "}
            {formatNextVaccinationDate(animal.nextVaccinationDate)}.
            <br />
            Pensez à mettre à jour la prochaine date.
          </InlineHelper>
        );

        break;
      }

      case "up-comming": {
        vaccinationHelper = (
          <InlineHelper variant="warning" icon="icon-syringe">
            Prochaine vaccination{" "}
            {formatNextVaccinationDate(animal.nextVaccinationDate)}.
          </InlineHelper>
        );
        break;
      }
    }
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Situation</Card.Title>

        {canEdit ? (
          <Action asChild variant="text">
            <BaseLink
              to={Routes.animals.id(animal.id).edit.situation.toString()}
            >
              Modifier
            </BaseLink>
          </Action>
        ) : null}
      </Card.Header>

      <Card.Content>
        {vaccinationHelper}

        {hasUpCommingSterilisation(animal) ? (
          <InlineHelper variant="warning" icon="icon-scissors">
            Stérilisation à prévoir.
          </InlineHelper>
        ) : null}

        <ItemList>
          {animal.manager != null ? (
            <SimpleItem icon={<UserAvatar user={animal.manager} size="sm" />}>
              Est géré par{" "}
              {canSeeManagerDetails ? (
                <ProseInlineAction asChild>
                  <BaseLink to={Routes.users.id(animal.manager.id).toString()}>
                    {animal.manager.displayName}
                  </BaseLink>
                </ProseInlineAction>
              ) : (
                <strong className="text-body-emphasis">
                  {animal.manager.displayName}
                </strong>
              )}
            </SimpleItem>
          ) : null}

          <SimpleItem icon={<StatusIcon status={animal.status} />}>
            Est{" "}
            <strong className="text-body-emphasis">
              {STATUS_TRANSLATION[animal.status]}
            </strong>
            {animal.status === Status.ADOPTED && animal.adoptionDate != null ? (
              <>
                {" "}
                depuis le{" "}
                <strong className="text-body-emphasis">
                  {DateTime.fromISO(animal.adoptionDate).toLocaleString(
                    DateTime.DATE_FULL,
                  )}
                </strong>
              </>
            ) : null}
            {animal.status === Status.ADOPTED &&
            animal.adoptionOption != null &&
            animal.adoptionOption !== AdoptionOption.UNKNOWN ? (
              <>
                {" "}
                (
                {ADOPTION_OPTION_TRANSLATION[
                  animal.adoptionOption
                ].toLowerCase()}
                )
              </>
            ) : null}
          </SimpleItem>

          {animal.fosterFamily != null ? (
            <DropdownSheet>
              <SimpleItem
                icon={
                  <FosterFamilyAvatar
                    size="sm"
                    availability={animal.fosterFamily.availability}
                  />
                }
              >
                En FA chez{" "}
                <DropdownSheet.Trigger asChild>
                  <ProseInlineAction>
                    {animal.fosterFamily.displayName}
                  </ProseInlineAction>
                </DropdownSheet.Trigger>
              </SimpleItem>

              <DropdownSheet.Portal>
                <DropdownSheet.Content
                  side="bottom"
                  sideOffset={theme.spacing[1]}
                  collisionPadding={theme.spacing[1]}
                >
                  <div className="grid grid-cols-[auto,minmax(0px,1fr)] items-center gap-1">
                    <FosterFamilyAvatar
                      size="md"
                      availability={animal.fosterFamily.availability}
                    />
                    <div className="flex flex-col">
                      <span>{animal.fosterFamily.displayName}</span>
                    </div>
                  </div>

                  <hr className="border-t border-gray-100" />

                  <ul className="flex flex-col">
                    <SimpleItem icon={<Icon href="icon-phone" />}>
                      {animal.fosterFamily.phone}
                    </SimpleItem>
                    <SimpleItem icon={<Icon href="icon-envelope" />}>
                      {animal.fosterFamily.email}
                    </SimpleItem>
                    <SimpleItem icon={<Icon href="icon-location-dot" />}>
                      {getLongLocation(animal.fosterFamily)}
                    </SimpleItem>
                  </ul>

                  {canSeeFosterFamilyDetails ? (
                    <>
                      <hr className="border-t border-gray-100" />
                      <BaseLink
                        to={Routes.fosterFamilies
                          .id(animal.fosterFamily.id)
                          .toString()}
                        className="grid cursor-pointer grid-cols-[auto,minmax(0px,1fr)] items-center rounded-0.5 pr-1 text-left text-gray-500 transition-colors duration-100 ease-in-out active:bg-gray-100 focus-visible:focus-compact-blue-400 hover:bg-gray-100"
                      >
                        <span className="flex h-4 w-4 items-center justify-center text-[20px]">
                          <Icon href="icon-ellipsis" />
                        </span>

                        <span className="text-body-emphasis">
                          Voir plus d’informations
                        </span>
                      </BaseLink>
                    </>
                  ) : null}
                </DropdownSheet.Content>
              </DropdownSheet.Portal>
            </DropdownSheet>
          ) : null}

          {animal.isSterilized != null &&
          animal.isSterilizationMandatory != null ? (
            <SimpleItem icon={<Icon href="icon-scissors" />}>
              {animal.isSterilized ? (
                <>
                  Est{" "}
                  <strong className="text-body-emphasis">
                    {animal.gender === Gender.FEMALE
                      ? "stérilisée"
                      : "stérilisé"}
                  </strong>
                </>
              ) : animal.isSterilizationMandatory ? (
                <>
                  N’est{" "}
                  <strong className="text-body-emphasis">
                    pas{" "}
                    {animal.gender === Gender.FEMALE
                      ? "stérilisée"
                      : "stérilisé"}
                  </strong>
                </>
              ) : (
                <>
                  Ne sera{" "}
                  <strong className="text-body-emphasis">
                    pas{" "}
                    {animal.gender === Gender.FEMALE
                      ? "stérilisée"
                      : "stérilisé"}
                  </strong>
                </>
              )}
            </SimpleItem>
          ) : null}

          {animal.nextVaccinationDate != null ? (
            <SimpleItem icon={<Icon href="icon-syringe" />}>
              Prochaine vaccination le{" "}
              <strong className="text-body-emphasis">
                {DateTime.fromISO(animal.nextVaccinationDate).toLocaleString(
                  DateTime.DATE_FULL,
                )}
              </strong>
            </SimpleItem>
          ) : null}

          {animal.isVaccinationMandatory === false ? (
            <SimpleItem icon={<Icon href="icon-syringe" />}>
              Ne sera{" "}
              <strong className="text-body-emphasis">
                pas {animal.gender === Gender.FEMALE ? "vaccinée" : "vacciné"}
              </strong>
            </SimpleItem>
          ) : null}

          {animal.species === Species.CAT &&
          animal.screeningFiv !== ScreeningResult.UNKNOWN ? (
            <SimpleItem
              icon={
                <Icon
                  href={SCREENING_RESULT_ICON[animal.screeningFiv]}
                  className={
                    animal.screeningFiv === ScreeningResult.NEGATIVE
                      ? "text-green-600"
                      : "text-red-500"
                  }
                />
              }
            >
              Est{" "}
              <strong className="text-body-emphasis">
                {
                  SCREENING_RESULT_TRANSLATION[animal.screeningFiv][
                    animal.gender
                  ]
                }
              </strong>{" "}
              au FIV
            </SimpleItem>
          ) : null}

          {animal.species === Species.CAT &&
          animal.screeningFelv !== ScreeningResult.UNKNOWN ? (
            <SimpleItem
              icon={
                <Icon
                  href={SCREENING_RESULT_ICON[animal.screeningFelv]}
                  className={
                    animal.screeningFelv === ScreeningResult.NEGATIVE
                      ? "text-green-600"
                      : "text-red-500"
                  }
                />
              }
            >
              Est{" "}
              <strong className="text-body-emphasis">
                {
                  SCREENING_RESULT_TRANSLATION[animal.screeningFelv][
                    animal.gender
                  ]
                }
              </strong>{" "}
              au FeLV
            </SimpleItem>
          ) : null}

          <DiagnosisItem />

          <SimpleItem icon={<Icon href="icon-hand-holding-heart" />}>
            {animal.gender === Gender.FEMALE
              ? "Prise en charge le"
              : "Pris en charge le"}{" "}
            <strong className="text-body-emphasis">
              {DateTime.fromISO(animal.pickUpDate).toLocaleString(
                DateTime.DATE_FULL,
              )}
            </strong>
            {animal.pickUpLocation != null ? (
              <>
                <br />à{" "}
                <strong className="text-body-emphasis">
                  {animal.pickUpLocation}
                </strong>
              </>
            ) : null}
            <br />
            suite à{" "}
            <strong className="text-body-emphasis">
              {PICK_UP_REASON_TRANSLATION[animal.pickUpReason]}
            </strong>
          </SimpleItem>
        </ItemList>
      </Card.Content>
    </Card>
  );
}

function DiagnosisItem() {
  const { animal } = useLoaderData<loader>();

  if (
    animal.species !== Species.DOG ||
    animal.diagnosis == null ||
    animal.diagnosis == Diagnosis.NOT_APPLICABLE
  ) {
    return null;
  }

  return (
    <SimpleItem icon={DIAGNOSIS_ICON[animal.diagnosis]}>
      <Markdown components={HIGHLIGHT_COMPONENTS}>
        {DIAGNOSIS_TEXT[animal.diagnosis][animal.gender]}
      </Markdown>
    </SimpleItem>
  );
}

const DIAGNOSIS_ICON: Record<
  Exclude<Diagnosis, typeof Diagnosis.NOT_APPLICABLE>,
  React.ReactNode
> = {
  [Diagnosis.CATEGORIZED]: (
    <Icon href="icon-shield-dog" className="text-red-500" />
  ),
  [Diagnosis.UNCATEGORIZED]: (
    <Icon href="icon-shield-dog" className="text-green-600" />
  ),
  [Diagnosis.UNKNOWN]: <Icon href="icon-shield-dog" />,
};

const DIAGNOSIS_TEXT: Record<
  Exclude<Diagnosis, typeof Diagnosis.NOT_APPLICABLE>,
  Record<Gender, string>
> = {
  [Diagnosis.CATEGORIZED]: {
    [Gender.FEMALE]: "Est **catégorisée**",
    [Gender.MALE]: "Est **catégorisé**",
  },
  [Diagnosis.UNCATEGORIZED]: {
    [Gender.FEMALE]: "Est **non catégorisée**",
    [Gender.MALE]: "Est **non catégorisé**",
  },
  [Diagnosis.UNKNOWN]: {
    [Gender.FEMALE]: "Diagnose **à faire**",
    [Gender.MALE]: "Diagnose **à faire**",
  },
};
