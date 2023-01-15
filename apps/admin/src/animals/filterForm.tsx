import { FosterFamily, User, UserGroup } from "@prisma/client";
import { Form, useSubmit } from "@remix-run/react";
import { DateTime } from "luxon";
import { AGE_ICON, AGE_TRANSLATION, SORTED_AGES } from "~/animals/age";
import { AnimalSearchParams } from "~/animals/searchParams";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  StatusIcon,
  STATUS_TRANSLATION,
} from "~/animals/status";
import { actionClassName } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filter, Filters } from "~/core/controllers/filters";
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { ControlledInput } from "~/core/formElements/controlledInput";
import {
  Suggestion,
  SuggestionInput,
  SuggestionLabel,
  Suggestions,
} from "~/core/formElements/filterSuggestions";
import { formClassNames } from "~/core/formElements/form";
import { useOptimisticSearchParams } from "~/core/searchParams";
import { FosterFamilyAvatar } from "~/fosterFamilies/avatar";
import { Icon } from "~/generated/icon";
import { UserAvatar } from "~/users/avatar";
import { hasGroups } from "~/users/groups";

export function AnimalFilters({
  currentUser,
  managers,
  fosterFamilies,
  possiblePickUpLocations,
}: {
  currentUser: ManagerActiveFilterLinkProps["currentUser"];
  managers: Pick<User, "displayName" | "id">[];
  fosterFamilies: Pick<FosterFamily, "displayName" | "id">[];
  possiblePickUpLocations: string[];
}) {
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const animalSearchParams = new AnimalSearchParams(searchParams);
  const visibleFilters = {
    ages: animalSearchParams.getAges(),
    fosterFamiliesId: animalSearchParams.getFosterFamiliesId(),
    isSterilized: animalSearchParams.getIsSterilized(),
    managersId: animalSearchParams.getManagersId(),
    maxBirthdate: animalSearchParams.getMaxBirthdate(),
    maxPickUpDate: animalSearchParams.getMaxPickUpDate(),
    minBirthdate: animalSearchParams.getMinBirthdate(),
    minPickUpDate: animalSearchParams.getMinPickUpDate(),
    nameOrAlias: animalSearchParams.getNameOrAlias(),
    pickUpLocations: animalSearchParams.getPickUpLocations(),
    sort: animalSearchParams.getSort(),
    species: animalSearchParams.getSpecies(),
    statuses: animalSearchParams.getStatuses(),
  };

  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  return (
    <Form
      method="get"
      onChange={(event) => submit(event.currentTarget)}
      className="flex flex-col gap-2"
    >
      <div className="flex flex-col gap-1">
        <BaseLink
          to={{ search: "" }}
          className={actionClassName.standalone({
            variant: "secondary",
            color: "gray",
          })}
        >
          Tout effacer
        </BaseLink>

        <ActiveFilterLink />

        {isCurrentUserManager ? (
          <ManagerActiveFilterLink currentUser={currentUser} />
        ) : null}
      </div>

      <Filters>
        <Filter
          value={AnimalSearchParams.Keys.SORT}
          label="Trier"
          hiddenContent={
            <input
              type="hidden"
              name={AnimalSearchParams.Keys.SORT}
              value={visibleFilters.sort}
            />
          }
        >
          <Suggestions>
            <Suggestion>
              <SuggestionInput
                type="radio"
                name={AnimalSearchParams.Keys.SORT}
                value={AnimalSearchParams.Sort.RELEVANCE}
                checked={
                  visibleFilters.sort === AnimalSearchParams.Sort.RELEVANCE
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="bolt" />}>
                Pertinence
              </SuggestionLabel>
            </Suggestion>

            <Suggestion>
              <SuggestionInput
                type="radio"
                name={AnimalSearchParams.Keys.SORT}
                value={AnimalSearchParams.Sort.PICK_UP}
                checked={
                  visibleFilters.sort === AnimalSearchParams.Sort.PICK_UP
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="calendarDays" />}>
                Date de prise en charge
              </SuggestionLabel>
            </Suggestion>

            <Suggestion>
              <SuggestionInput
                type="radio"
                name={AnimalSearchParams.Keys.SORT}
                value={AnimalSearchParams.Sort.NAME}
                checked={visibleFilters.sort === AnimalSearchParams.Sort.NAME}
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="arrowDownAZ" />}>
                Alphabétique
              </SuggestionLabel>
            </Suggestion>
          </Suggestions>
        </Filter>

        <Filter
          value={AnimalSearchParams.Keys.NAME_OR_ALIAS}
          label="Nom ou alias"
          count={visibleFilters.nameOrAlias == null ? 0 : 1}
          hiddenContent={
            <input
              type="hidden"
              name={AnimalSearchParams.Keys.NAME_OR_ALIAS}
              value={visibleFilters.nameOrAlias ?? ""}
            />
          }
        >
          <ControlledInput
            name={AnimalSearchParams.Keys.NAME_OR_ALIAS}
            value={visibleFilters.nameOrAlias ?? ""}
            rightAdornment={
              visibleFilters.nameOrAlias != null ? (
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(animalSearchParams.deleteNameOrAlias())
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
              ) : null
            }
          />
        </Filter>

        <Filter
          value={AnimalSearchParams.Keys.SPECIES}
          label="Espèces"
          count={visibleFilters.species.length}
          hiddenContent={visibleFilters.species.map((species) => (
            <input
              key={species}
              type="hidden"
              name={AnimalSearchParams.Keys.SPECIES}
              value={species}
            />
          ))}
        >
          <Suggestions>
            {SORTED_SPECIES.map((species) => (
              <Suggestion key={species}>
                <SuggestionInput
                  type="checkbox"
                  name={AnimalSearchParams.Keys.SPECIES}
                  value={species}
                  checked={visibleFilters.species.includes(species)}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<Icon id={SPECIES_ICON[species]} />}>
                  {SPECIES_TRANSLATION[species]}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>

        <Filter
          value={AnimalSearchParams.Keys.AGE}
          label="Âges"
          count={
            (visibleFilters.minBirthdate == null ? 0 : 1) +
            (visibleFilters.maxBirthdate == null ? 0 : 1) +
            visibleFilters.ages.length
          }
          hiddenContent={
            <>
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.MIN_BIRTHDATE}
                value={toIsoDate(visibleFilters.minBirthdate)}
              />
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.MAX_BIRTHDATE}
                value={toIsoDate(visibleFilters.maxBirthdate)}
              />
              {visibleFilters.ages.map((age) => (
                <input
                  key={age}
                  type="hidden"
                  name={AnimalSearchParams.Keys.AGE}
                  value={age}
                />
              ))}
            </>
          }
        >
          <div className={formClassNames.fields.root()}>
            <div className={formClassNames.fields.field.root()}>
              <Suggestions>
                {SORTED_AGES.map((age) => (
                  <Suggestion key={age}>
                    <SuggestionInput
                      type="checkbox"
                      name={AnimalSearchParams.Keys.AGE}
                      value={age}
                      checked={visibleFilters.ages.includes(age)}
                      onChange={() => {}}
                    />

                    <SuggestionLabel icon={<Icon id={AGE_ICON[age]} />}>
                      {AGE_TRANSLATION[age]}
                    </SuggestionLabel>
                  </Suggestion>
                ))}
              </Suggestions>
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Né après le et incluant
              </span>

              <ControlledInput
                type="date"
                name={AnimalSearchParams.Keys.MIN_BIRTHDATE}
                value={toIsoDate(visibleFilters.minBirthdate)}
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.minBirthdate != null ? (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(animalSearchParams.deleteMinBirthdate())
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
                  ) : null
                }
              />
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Né avant le et incluant
              </span>

              <ControlledInput
                type="date"
                name={AnimalSearchParams.Keys.MAX_BIRTHDATE}
                value={toIsoDate(visibleFilters.maxBirthdate)}
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.maxBirthdate != null ? (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(animalSearchParams.deleteMaxBirthdate())
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
                  ) : null
                }
              />
            </div>
          </div>
        </Filter>

        <Filter
          value={AnimalSearchParams.Keys.STATUS}
          label="Statuts"
          count={visibleFilters.statuses.length}
          hiddenContent={visibleFilters.statuses.map((status) => (
            <input
              key={status}
              type="hidden"
              name={AnimalSearchParams.Keys.STATUS}
              value={status}
            />
          ))}
        >
          <Suggestions>
            {SORTED_STATUS.map((status) => (
              <Suggestion key={status}>
                <SuggestionInput
                  type="checkbox"
                  name={AnimalSearchParams.Keys.STATUS}
                  value={status}
                  checked={visibleFilters.statuses.includes(status)}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<StatusIcon status={status} />}>
                  {STATUS_TRANSLATION[status]}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>

        <Filter
          value={AnimalSearchParams.Keys.MANAGERS_ID}
          label="Responsables"
          count={visibleFilters.managersId.length}
          hiddenContent={visibleFilters.managersId.map((managerId) => (
            <input
              key={managerId}
              type="hidden"
              name={AnimalSearchParams.Keys.MANAGERS_ID}
              value={managerId}
            />
          ))}
        >
          <Suggestions>
            {managers.map((manager) => (
              <Suggestion key={manager.id}>
                <SuggestionInput
                  type="checkbox"
                  name={AnimalSearchParams.Keys.MANAGERS_ID}
                  value={manager.id}
                  checked={visibleFilters.managersId.includes(manager.id)}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<UserAvatar user={manager} size="sm" />}>
                  {manager.displayName}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
        </Filter>

        {fosterFamilies.length > 0 ? (
          <Filter
            value={AnimalSearchParams.Keys.FOSTER_FAMILIES_ID}
            label="Familles d’accueil"
            count={visibleFilters.fosterFamiliesId.length}
            hiddenContent={visibleFilters.fosterFamiliesId.map(
              (fosterFamilyId) => (
                <input
                  key={fosterFamilyId}
                  type="hidden"
                  name={AnimalSearchParams.Keys.FOSTER_FAMILIES_ID}
                  value={fosterFamilyId}
                />
              )
            )}
          >
            <Suggestions>
              {fosterFamilies.map((fosterFamily) => (
                <Suggestion key={fosterFamily.id}>
                  <SuggestionInput
                    type="checkbox"
                    name={AnimalSearchParams.Keys.FOSTER_FAMILIES_ID}
                    value={fosterFamily.id}
                    checked={visibleFilters.fosterFamiliesId.includes(
                      fosterFamily.id
                    )}
                    onChange={() => {}}
                  />

                  <SuggestionLabel
                    icon={
                      <FosterFamilyAvatar
                        fosterFamily={fosterFamily}
                        size="sm"
                      />
                    }
                  >
                    {fosterFamily.displayName}
                  </SuggestionLabel>
                </Suggestion>
              ))}
            </Suggestions>
          </Filter>
        ) : null}

        <Filter
          value={AnimalSearchParams.Keys.PICK_UP_LOCATION}
          label="Prise en charge"
          count={
            (visibleFilters.minPickUpDate == null ? 0 : 1) +
            (visibleFilters.maxPickUpDate == null ? 0 : 1) +
            visibleFilters.pickUpLocations.length
          }
          hiddenContent={
            <>
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
                value={toIsoDate(visibleFilters.minPickUpDate)}
              />
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
                value={toIsoDate(visibleFilters.maxPickUpDate)}
              />
              {visibleFilters.pickUpLocations.map((location) => (
                <input
                  key={location}
                  type="hidden"
                  name={AnimalSearchParams.Keys.PICK_UP_LOCATION}
                  value={location}
                />
              ))}
            </>
          }
        >
          <div className={formClassNames.fields.root()}>
            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Après le et incluant
              </span>

              <ControlledInput
                type="date"
                name={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
                value={toIsoDate(visibleFilters.minPickUpDate)}
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.minPickUpDate != null ? (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(
                          animalSearchParams.deleteMinPickUpDate()
                        )
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
                  ) : null
                }
              />
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Avant le et incluant
              </span>

              <ControlledInput
                type="date"
                name={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
                value={toIsoDate(visibleFilters.maxPickUpDate)}
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.maxPickUpDate != null ? (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(
                          animalSearchParams.deleteMaxPickUpDate()
                        )
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
                  ) : null
                }
              />
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>Lieu</span>

              <Suggestions>
                {possiblePickUpLocations.map((location) => (
                  <Suggestion key={location}>
                    <SuggestionInput
                      type="checkbox"
                      name={AnimalSearchParams.Keys.PICK_UP_LOCATION}
                      value={location}
                      checked={visibleFilters.pickUpLocations.includes(
                        location
                      )}
                      onChange={() => {}}
                    />

                    <SuggestionLabel icon={<Icon id="locationDot" />}>
                      {location}
                    </SuggestionLabel>
                  </Suggestion>
                ))}
              </Suggestions>
            </div>
          </div>
        </Filter>

        <Filter
          value={AnimalSearchParams.Keys.IS_STERILIZED}
          label="Stérilisé"
          count={visibleFilters.isSterilized == null ? 0 : 1}
          hiddenContent={
            visibleFilters.isSterilized != null ? (
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={visibleFilters.isSterilized}
              />
            ) : null
          }
        >
          <Suggestions>
            <Suggestion>
              <SuggestionInput
                type="radio"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={AnimalSearchParams.IsSterilized.YES}
                checked={
                  visibleFilters.isSterilized ===
                  AnimalSearchParams.IsSterilized.YES
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="scissors" />}>
                Oui
              </SuggestionLabel>
            </Suggestion>

            <Suggestion>
              <SuggestionInput
                type="radio"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={AnimalSearchParams.IsSterilized.NO}
                checked={
                  visibleFilters.isSterilized ===
                  AnimalSearchParams.IsSterilized.NO
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="scissors" />}>
                Non
              </SuggestionLabel>
            </Suggestion>

            <Suggestion>
              <SuggestionInput
                type="radio"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={AnimalSearchParams.IsSterilized.NOT_MANDATORY}
                checked={
                  visibleFilters.isSterilized ===
                  AnimalSearchParams.IsSterilized.NOT_MANDATORY
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="scissors" />}>
                Non, et ne le sera pas
              </SuggestionLabel>
            </Suggestion>
          </Suggestions>
        </Filter>
      </Filters>
    </Form>
  );
}

function toIsoDate(date: Date | null) {
  if (date == null) {
    return "";
  }

  return DateTime.fromJSDate(date).toISODate();
}

function ActiveFilterLink() {
  let toSearchParams = new AnimalSearchParams().setStatuses(
    ACTIVE_ANIMAL_STATUS
  );

  const [searchParams] = useOptimisticSearchParams();
  const isActive = toSearchParams.areFiltersEqual(
    new AnimalSearchParams(searchParams)
  );

  return (
    <BaseLink
      to={{ search: toSearchParams.toString() }}
      className={actionClassName.standalone({
        variant: "secondary",
        color: isActive ? "blue" : "gray",
      })}
    >
      {isActive ? <Icon id="check" /> : null}
      Animaux en charge
    </BaseLink>
  );
}

type ManagerActiveFilterLinkProps = {
  currentUser: Pick<User, "groups" | "id">;
};

function ManagerActiveFilterLink({
  currentUser,
}: ManagerActiveFilterLinkProps) {
  const toSearchParams = new AnimalSearchParams()
    .setStatuses(ACTIVE_ANIMAL_STATUS)
    .setManagersId([currentUser.id]);

  const [searchParams] = useOptimisticSearchParams();
  const isActive = toSearchParams.areFiltersEqual(
    new AnimalSearchParams(searchParams)
  );

  return (
    <BaseLink
      to={{ search: toSearchParams.toString() }}
      className={actionClassName.standalone({
        variant: "secondary",
        color: isActive ? "blue" : "gray",
      })}
    >
      {isActive ? <Icon id="check" /> : null}À votre charge
    </BaseLink>
  );
}
