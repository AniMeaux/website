import { FosterFamily, User, UserGroup } from "@prisma/client";
import {
  ADOPTION_OPTION_ICON,
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
} from "~/animals/adoption";
import { AGE_ICON, AGE_TRANSLATION, SORTED_AGES } from "~/animals/age";
import {
  PICK_UP_REASON_ICON,
  PICK_UP_REASON_TRANSLATION,
  SORTED_PICK_UP_REASON,
} from "~/animals/pickUp";
import { AnimalSearchParams } from "~/animals/searchParams";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "~/animals/species";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  STATUS_TRANSLATION,
  StatusIcon,
} from "~/animals/status";
import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filters } from "~/core/controllers/filters";
import { toIsoDateValue } from "~/core/dates";
import { ControlledInput } from "~/core/formElements/controlledInput";
import { Form } from "~/core/formElements/form";
import { ToggleInput, ToggleInputList } from "~/core/formElements/toggleInput";
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
  currentUser: Pick<User, "groups" | "id">;
  managers: Pick<User, "displayName" | "id">[];
  fosterFamilies: Pick<FosterFamily, "displayName" | "id">[];
  possiblePickUpLocations: string[];
}) {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const animalSearchParams = new AnimalSearchParams(searchParams);
  const visibleFilters = {
    adoptionOptions: animalSearchParams.getAdoptionOptions(),
    ages: animalSearchParams.getAges(),
    fosterFamiliesId: animalSearchParams.getFosterFamiliesId(),
    isSterilized: animalSearchParams.getIsSterilized(),
    managersId: animalSearchParams.getManagersId(),
    maxAdoptionDate: animalSearchParams.getMaxAdoptionDate(),
    maxBirthdate: animalSearchParams.getMaxBirthdate(),
    maxPickUpDate: animalSearchParams.getMaxPickUpDate(),
    maxVaccinationDate: animalSearchParams.getMaxVaccinationDate(),
    minAdoptionDate: animalSearchParams.getMinAdoptionDate(),
    minBirthdate: animalSearchParams.getMinBirthdate(),
    minPickUpDate: animalSearchParams.getMinPickUpDate(),
    minVaccinationDate: animalSearchParams.getMinVaccinationDate(),
    nameOrAlias: animalSearchParams.getNameOrAlias(),
    noVaccination: animalSearchParams.getNoVaccination(),
    pickUpLocations: animalSearchParams.getPickUpLocations(),
    pickUpReasons: animalSearchParams.getPickUpReasons(),
    sort: animalSearchParams.getSort(),
    species: animalSearchParams.getSpecies(),
    statuses: animalSearchParams.getStatuses(),
  };

  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  const isCurrentUserAnimalAdmin =
    isCurrentUserManager ||
    hasGroups(currentUser, [UserGroup.ADMIN, UserGroup.VETERINARIAN]);

  return (
    <Filters>
      <Filters.Actions>
        <Action asChild variant="secondary" color="gray">
          <BaseLink replace to={{ search: "" }}>
            Tout effacer
          </BaseLink>
        </Action>

        <ActiveFilterLink />

        {isCurrentUserManager ? (
          <ManagerActiveFilterLink currentUser={currentUser} />
        ) : null}
      </Filters.Actions>

      <Filters.Content>
        <Filters.Filter
          value={AnimalSearchParams.Keys.SORT}
          label="Trier"
          count={
            visibleFilters.sort === AnimalSearchParams.DEFAULT_SORT ? 0 : 1
          }
          hiddenContent={
            visibleFilters.sort === AnimalSearchParams.DEFAULT_SORT ? null : (
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.SORT}
                value={visibleFilters.sort}
              />
            )
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Pertinence"
              name={AnimalSearchParams.Keys.SORT}
              value={AnimalSearchParams.Sort.RELEVANCE}
              icon={<Icon id="bolt" />}
              checked={
                visibleFilters.sort === AnimalSearchParams.Sort.RELEVANCE
              }
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Date de prise en charge"
              name={AnimalSearchParams.Keys.SORT}
              value={AnimalSearchParams.Sort.PICK_UP}
              icon={<Icon id="handHoldingHeart" />}
              checked={visibleFilters.sort === AnimalSearchParams.Sort.PICK_UP}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={AnimalSearchParams.Keys.SORT}
              value={AnimalSearchParams.Sort.NAME}
              icon={<Icon id="arrowDownAZ" />}
              checked={visibleFilters.sort === AnimalSearchParams.Sort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Date de naissance"
              name={AnimalSearchParams.Keys.SORT}
              value={AnimalSearchParams.Sort.BIRTHDATE}
              icon={<Icon id="cakeCandles" />}
              checked={
                visibleFilters.sort === AnimalSearchParams.Sort.BIRTHDATE
              }
              onChange={() => {}}
            />

            {isCurrentUserAnimalAdmin ? (
              <ToggleInput
                type="radio"
                label="Date de vaccination"
                name={AnimalSearchParams.Keys.SORT}
                value={AnimalSearchParams.Sort.VACCINATION}
                icon={<Icon id="syringe" />}
                checked={
                  visibleFilters.sort === AnimalSearchParams.Sort.VACCINATION
                }
                onChange={() => {}}
              />
            ) : null}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
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
          <ToggleInputList>
            {SORTED_SPECIES.map((species) => (
              <ToggleInput
                key={species}
                type="checkbox"
                label={SPECIES_TRANSLATION[species]}
                name={AnimalSearchParams.Keys.SPECIES}
                value={species}
                icon={<Icon id={SPECIES_ICON[species]} />}
                checked={visibleFilters.species.includes(species)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.Keys.AGE}
          label="Âges"
          count={
            (visibleFilters.minBirthdate == null ? 0 : 1) +
            (visibleFilters.maxBirthdate == null ? 0 : 1) +
            visibleFilters.ages.length
          }
          hiddenContent={
            <>
              {visibleFilters.minBirthdate == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.Keys.MIN_BIRTHDATE}
                  value={toIsoDateValue(visibleFilters.minBirthdate)}
                />
              )}
              {visibleFilters.maxBirthdate == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.Keys.MAX_BIRTHDATE}
                  value={toIsoDateValue(visibleFilters.maxBirthdate)}
                />
              )}
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
          <Form.Fields>
            <Form.Field>
              <ToggleInputList>
                {SORTED_AGES.map((age) => (
                  <ToggleInput
                    key={age}
                    type="checkbox"
                    label={AGE_TRANSLATION[age]}
                    name={AnimalSearchParams.Keys.AGE}
                    value={age}
                    icon={<Icon id={AGE_ICON[age]} />}
                    checked={visibleFilters.ages.includes(age)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.Keys.MIN_BIRTHDATE}>
                Né après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.Keys.MIN_BIRTHDATE}
                name={AnimalSearchParams.Keys.MIN_BIRTHDATE}
                value={toIsoDateValue(visibleFilters.minBirthdate)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.minBirthdate != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(animalSearchParams.deleteMinBirthdate())
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.Keys.MAX_BIRTHDATE}>
                Né avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.Keys.MAX_BIRTHDATE}
                name={AnimalSearchParams.Keys.MAX_BIRTHDATE}
                value={toIsoDateValue(visibleFilters.maxBirthdate)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.maxBirthdate != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(animalSearchParams.deleteMaxBirthdate())
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>
          </Form.Fields>
        </Filters.Filter>

        <Filters.Filter
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
          <ToggleInputList>
            {SORTED_STATUS.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={STATUS_TRANSLATION[status]}
                name={AnimalSearchParams.Keys.STATUS}
                value={status}
                icon={<StatusIcon status={status} />}
                checked={visibleFilters.statuses.includes(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.Keys.PICK_UP_LOCATION}
          label="Prise en charge"
          count={
            visibleFilters.pickUpReasons.length +
            (visibleFilters.minPickUpDate == null ? 0 : 1) +
            (visibleFilters.maxPickUpDate == null ? 0 : 1) +
            visibleFilters.pickUpLocations.length
          }
          hiddenContent={
            <>
              {visibleFilters.pickUpReasons.map((pickUpReason) => (
                <input
                  key={pickUpReason}
                  type="hidden"
                  name={AnimalSearchParams.Keys.PICK_UP_REASON}
                  value={pickUpReason}
                />
              ))}
              {visibleFilters.minPickUpDate == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
                  value={toIsoDateValue(visibleFilters.minPickUpDate)}
                />
              )}
              {visibleFilters.maxPickUpDate == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
                  value={toIsoDateValue(visibleFilters.maxPickUpDate)}
                />
              )}
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
          <Form.Fields>
            <Form.Field>
              <Form.Label asChild>
                <span>Raison</span>
              </Form.Label>

              <ToggleInputList>
                {SORTED_PICK_UP_REASON.map((pickUpReason) => (
                  <ToggleInput
                    key={pickUpReason}
                    type="checkbox"
                    label={PICK_UP_REASON_TRANSLATION[pickUpReason]}
                    name={AnimalSearchParams.Keys.PICK_UP_REASON}
                    value={pickUpReason}
                    icon={<Icon id={PICK_UP_REASON_ICON[pickUpReason]} />}
                    checked={visibleFilters.pickUpReasons.includes(
                      pickUpReason
                    )}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}>
                Après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
                name={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
                value={toIsoDateValue(visibleFilters.minPickUpDate)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.minPickUpDate != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(
                          animalSearchParams.deleteMinPickUpDate()
                        )
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}>
                Avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
                name={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
                value={toIsoDateValue(visibleFilters.maxPickUpDate)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.maxPickUpDate != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(
                          animalSearchParams.deleteMaxPickUpDate()
                        )
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label asChild>
                <span>Lieu</span>
              </Form.Label>

              <ToggleInputList>
                {possiblePickUpLocations.map((location) => (
                  <ToggleInput
                    key={location}
                    type="checkbox"
                    label={location}
                    name={AnimalSearchParams.Keys.PICK_UP_LOCATION}
                    value={location}
                    icon={<Icon id="locationDot" />}
                    checked={visibleFilters.pickUpLocations.includes(location)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>
          </Form.Fields>
        </Filters.Filter>

        {isCurrentUserAnimalAdmin ? (
          <Filters.Filter
            value={AnimalSearchParams.Keys.IS_STERILIZED}
            label="Stérilisé"
            count={visibleFilters.isSterilized.length}
            hiddenContent={visibleFilters.isSterilized.map((isSterilized) => (
              <input
                key={isSterilized}
                type="hidden"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={isSterilized}
              />
            ))}
          >
            <ToggleInputList>
              <ToggleInput
                type="checkbox"
                label="Oui"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={AnimalSearchParams.IsSterilized.YES}
                icon={<Icon id="scissors" />}
                checked={visibleFilters.isSterilized.includes(
                  AnimalSearchParams.IsSterilized.YES
                )}
                onChange={() => {}}
              />

              <ToggleInput
                type="checkbox"
                label="Non"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={AnimalSearchParams.IsSterilized.NO}
                icon={<Icon id="scissors" />}
                checked={visibleFilters.isSterilized.includes(
                  AnimalSearchParams.IsSterilized.NO
                )}
                onChange={() => {}}
              />

              <ToggleInput
                type="checkbox"
                label="Non, et ne le sera pas"
                name={AnimalSearchParams.Keys.IS_STERILIZED}
                value={AnimalSearchParams.IsSterilized.NOT_MANDATORY}
                icon={<Icon id="scissors" />}
                checked={visibleFilters.isSterilized.includes(
                  AnimalSearchParams.IsSterilized.NOT_MANDATORY
                )}
                onChange={() => {}}
              />
            </ToggleInputList>
          </Filters.Filter>
        ) : null}

        {isCurrentUserAnimalAdmin ? (
          <Filters.Filter
            value={AnimalSearchParams.Keys.MIN_VACCINATION}
            label="Prochaine vaccination"
            count={
              (visibleFilters.minVaccinationDate == null ? 0 : 1) +
              (visibleFilters.maxVaccinationDate == null ? 0 : 1) +
              (visibleFilters.noVaccination ? 1 : 0)
            }
            hiddenContent={
              <>
                {visibleFilters.minVaccinationDate == null ? null : (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.Keys.MIN_VACCINATION}
                    value={toIsoDateValue(visibleFilters.minVaccinationDate)}
                  />
                )}
                {visibleFilters.maxVaccinationDate == null ? null : (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.Keys.MAX_VACCINATION}
                    value={toIsoDateValue(visibleFilters.maxVaccinationDate)}
                  />
                )}
                {visibleFilters.noVaccination ? (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.Keys.NO_VACCINATION}
                    value={String(true)}
                  />
                ) : null}
              </>
            }
          >
            <Form.Fields>
              <Form.Field>
                <ToggleInputList>
                  <ToggleInput
                    type="checkbox"
                    label="Aucune prévue"
                    name={AnimalSearchParams.Keys.NO_VACCINATION}
                    value={String(true)}
                    icon={<Icon id="syringe" />}
                    checked={visibleFilters.noVaccination}
                    onChange={() => {}}
                  />
                </ToggleInputList>
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor={AnimalSearchParams.Keys.MIN_VACCINATION}>
                  Après le et incluant
                </Form.Label>

                <ControlledInput
                  type="date"
                  id={AnimalSearchParams.Keys.MIN_VACCINATION}
                  name={AnimalSearchParams.Keys.MIN_VACCINATION}
                  value={toIsoDateValue(visibleFilters.minVaccinationDate)}
                  leftAdornment={
                    <ControlledInput.Adornment>
                      <Icon id="calendarDays" />
                    </ControlledInput.Adornment>
                  }
                  rightAdornment={
                    visibleFilters.minVaccinationDate != null ? (
                      <ControlledInput.ActionAdornment
                        onClick={() =>
                          setSearchParams(
                            animalSearchParams.deleteMinVaccinationDate()
                          )
                        }
                      >
                        <Icon id="xMark" />
                      </ControlledInput.ActionAdornment>
                    ) : null
                  }
                />
              </Form.Field>

              <Form.Field>
                <Form.Label htmlFor={AnimalSearchParams.Keys.MAX_VACCINATION}>
                  Avant le et incluant
                </Form.Label>

                <ControlledInput
                  type="date"
                  id={AnimalSearchParams.Keys.MAX_VACCINATION}
                  name={AnimalSearchParams.Keys.MAX_VACCINATION}
                  value={toIsoDateValue(visibleFilters.maxVaccinationDate)}
                  leftAdornment={
                    <ControlledInput.Adornment>
                      <Icon id="calendarDays" />
                    </ControlledInput.Adornment>
                  }
                  rightAdornment={
                    visibleFilters.maxVaccinationDate != null ? (
                      <ControlledInput.ActionAdornment
                        onClick={() =>
                          setSearchParams(
                            animalSearchParams.deleteMaxVaccinationDate()
                          )
                        }
                      >
                        <Icon id="xMark" />
                      </ControlledInput.ActionAdornment>
                    ) : null
                  }
                />
              </Form.Field>
            </Form.Fields>
          </Filters.Filter>
        ) : null}

        <Filters.Filter
          value={AnimalSearchParams.Keys.ADOPTION_OPTION}
          label="Adoption"
          count={
            (visibleFilters.minAdoptionDate == null ? 0 : 1) +
            (visibleFilters.maxAdoptionDate == null ? 0 : 1) +
            visibleFilters.adoptionOptions.length
          }
          hiddenContent={
            <>
              {visibleFilters.minAdoptionDate == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.Keys.MIN_ADOPTION_DATE}
                  value={toIsoDateValue(visibleFilters.minAdoptionDate)}
                />
              )}
              {visibleFilters.maxAdoptionDate == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.Keys.MAX_ADOPTION_DATE}
                  value={toIsoDateValue(visibleFilters.maxAdoptionDate)}
                />
              )}
              {visibleFilters.adoptionOptions.map((adoptionOption) => (
                <input
                  key={adoptionOption}
                  type="hidden"
                  name={AnimalSearchParams.Keys.ADOPTION_OPTION}
                  value={adoptionOption}
                />
              ))}
            </>
          }
        >
          <Form.Fields>
            <Form.Field>
              <ToggleInputList>
                {SORTED_ADOPTION_OPTION.map((adoptionOption) => (
                  <ToggleInput
                    key={adoptionOption}
                    type="checkbox"
                    label={ADOPTION_OPTION_TRANSLATION[adoptionOption]}
                    name={AnimalSearchParams.Keys.ADOPTION_OPTION}
                    value={adoptionOption}
                    icon={<Icon id={ADOPTION_OPTION_ICON[adoptionOption]} />}
                    checked={visibleFilters.adoptionOptions.includes(
                      adoptionOption
                    )}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.Keys.MIN_ADOPTION_DATE}>
                Adopté après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.Keys.MIN_ADOPTION_DATE}
                name={AnimalSearchParams.Keys.MIN_ADOPTION_DATE}
                value={toIsoDateValue(visibleFilters.minAdoptionDate)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.minAdoptionDate != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(
                          animalSearchParams.deleteMinAdoptionDate()
                        )
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.Keys.MAX_ADOPTION_DATE}>
                Adopté avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.Keys.MAX_ADOPTION_DATE}
                name={AnimalSearchParams.Keys.MAX_ADOPTION_DATE}
                value={toIsoDateValue(visibleFilters.maxAdoptionDate)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.maxAdoptionDate != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(
                          animalSearchParams.deleteMaxAdoptionDate()
                        )
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>
          </Form.Fields>
        </Filters.Filter>

        {fosterFamilies.length > 0 ? (
          <Filters.Filter
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
            <ToggleInputList>
              {fosterFamilies.map((fosterFamily) => (
                <ToggleInput
                  key={fosterFamily.id}
                  type="checkbox"
                  label={fosterFamily.displayName}
                  name={AnimalSearchParams.Keys.FOSTER_FAMILIES_ID}
                  value={fosterFamily.id}
                  icon={
                    <FosterFamilyAvatar fosterFamily={fosterFamily} size="sm" />
                  }
                  checked={visibleFilters.fosterFamiliesId.includes(
                    fosterFamily.id
                  )}
                  onChange={() => {}}
                />
              ))}
            </ToggleInputList>
          </Filters.Filter>
        ) : null}

        <Filters.Filter
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
          <ToggleInputList>
            {managers.map((manager) => (
              <ToggleInput
                key={manager.id}
                type="checkbox"
                label={manager.displayName}
                name={AnimalSearchParams.Keys.MANAGERS_ID}
                value={manager.id}
                icon={<UserAvatar user={manager} size="sm" />}
                checked={visibleFilters.managersId.includes(manager.id)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.Keys.NAME_OR_ALIAS}
          label="Nom ou alias"
          count={visibleFilters.nameOrAlias == null ? 0 : 1}
          hiddenContent={
            visibleFilters.nameOrAlias == null ? null : (
              <input
                type="hidden"
                name={AnimalSearchParams.Keys.NAME_OR_ALIAS}
                value={visibleFilters.nameOrAlias}
              />
            )
          }
        >
          <ControlledInput
            name={AnimalSearchParams.Keys.NAME_OR_ALIAS}
            value={visibleFilters.nameOrAlias ?? ""}
            rightAdornment={
              visibleFilters.nameOrAlias != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams(animalSearchParams.deleteNameOrAlias())
                  }
                >
                  <Icon id="xMark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
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
    <Action asChild variant="secondary" color={isActive ? "blue" : "gray"}>
      <BaseLink replace to={{ search: toSearchParams.toString() }}>
        {isActive ? <Icon id="check" /> : null}
        Animaux en charge
      </BaseLink>
    </Action>
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
    <Action asChild variant="secondary" color={isActive ? "blue" : "gray"}>
      <BaseLink replace to={{ search: toSearchParams.toString() }}>
        {isActive ? <Icon id="check" /> : null}À votre charge
      </BaseLink>
    </Action>
  );
}
