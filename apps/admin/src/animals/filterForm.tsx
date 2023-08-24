import {
  ADOPTION_OPTION_ICON,
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
} from "#animals/adoption.tsx";
import { AGE_ICON, AGE_TRANSLATION, SORTED_AGES } from "#animals/age.tsx";
import {
  PICK_UP_REASON_ICON,
  PICK_UP_REASON_TRANSLATION,
  SORTED_PICK_UP_REASON,
} from "#animals/pickUp.ts";
import {
  SCREENING_RESULT_ICON,
  SCREENING_RESULT_TRANSLATION,
  SORTED_SCREENING_RESULTS,
} from "#animals/screening.ts";
import {
  ANIMAL_DEFAULT_SORT,
  AnimalSearchParams,
  AnimalSort,
  AnimalSterilization,
  AnimalVaccination,
} from "#animals/searchParams.ts";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species.tsx";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  STATUS_TRANSLATION,
  StatusIcon,
} from "#animals/status.tsx";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Filters } from "#core/controllers/filters.tsx";
import { toIsoDateValue } from "#core/dates.ts";
import { ControlledInput } from "#core/formElements/controlledInput.tsx";
import { Form } from "#core/formElements/form.tsx";
import {
  ToggleInput,
  ToggleInputList,
} from "#core/formElements/toggleInput.tsx";
import { useOptimisticSearchParams } from "#core/searchParams.ts";
import { FosterFamilyAvatar } from "#fosterFamilies/avatar.tsx";
import { Icon } from "#generated/icon.tsx";
import { UserAvatar } from "#users/avatar.tsx";
import { hasGroups } from "#users/groups.tsx";
import { FosterFamily, Gender, User, UserGroup } from "@prisma/client";

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
  const animalSearchParams = AnimalSearchParams.parse(searchParams);

  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  const isCurrentUserAnimalAdmin = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
  ]);

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
          value={AnimalSearchParams.keys.sort}
          label="Trier"
          count={animalSearchParams.sort === ANIMAL_DEFAULT_SORT ? 0 : 1}
          hiddenContent={
            animalSearchParams.sort !== ANIMAL_DEFAULT_SORT ? (
              <input
                type="hidden"
                name={AnimalSearchParams.keys.sort}
                value={animalSearchParams.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Date de prise en charge"
              name={AnimalSearchParams.keys.sort}
              value={AnimalSort.PICK_UP}
              icon={<Icon id="handHoldingHeart" />}
              checked={animalSearchParams.sort === AnimalSort.PICK_UP}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={AnimalSearchParams.keys.sort}
              value={AnimalSort.NAME}
              icon={<Icon id="arrowDownAZ" />}
              checked={animalSearchParams.sort === AnimalSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Date de naissance"
              name={AnimalSearchParams.keys.sort}
              value={AnimalSort.BIRTHDATE}
              icon={<Icon id="cakeCandles" />}
              checked={animalSearchParams.sort === AnimalSort.BIRTHDATE}
              onChange={() => {}}
            />

            {isCurrentUserAnimalAdmin ? (
              <ToggleInput
                type="radio"
                label="Date de vaccination"
                name={AnimalSearchParams.keys.sort}
                value={AnimalSort.VACCINATION}
                icon={<Icon id="syringe" />}
                checked={animalSearchParams.sort === AnimalSort.VACCINATION}
                onChange={() => {}}
              />
            ) : null}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.keys.species}
          label="Espèces"
          count={animalSearchParams.species.size}
          hiddenContent={Array.from(animalSearchParams.species).map(
            (species) => (
              <input
                key={species}
                type="hidden"
                name={AnimalSearchParams.keys.species}
                value={species}
              />
            )
          )}
        >
          <ToggleInputList>
            {SORTED_SPECIES.map((species) => (
              <ToggleInput
                key={species}
                type="checkbox"
                label={SPECIES_TRANSLATION[species]}
                name={AnimalSearchParams.keys.species}
                value={species}
                icon={<Icon id={SPECIES_ICON[species]} />}
                checked={animalSearchParams.species.has(species)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.keys.ages}
          label="Âges"
          count={
            (animalSearchParams.birthdateStart == null ? 0 : 1) +
            (animalSearchParams.birthdateEnd == null ? 0 : 1) +
            animalSearchParams.ages.size
          }
          hiddenContent={
            <>
              {animalSearchParams.birthdateStart == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.keys.birthdateStart}
                  value={toIsoDateValue(animalSearchParams.birthdateStart)}
                />
              )}
              {animalSearchParams.birthdateEnd == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.keys.birthdateEnd}
                  value={toIsoDateValue(animalSearchParams.birthdateEnd)}
                />
              )}
              {Array.from(animalSearchParams.ages).map((age) => (
                <input
                  key={age}
                  type="hidden"
                  name={AnimalSearchParams.keys.ages}
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
                    name={AnimalSearchParams.keys.ages}
                    value={age}
                    icon={<Icon id={AGE_ICON[age]} />}
                    checked={animalSearchParams.ages.has(age)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.keys.birthdateStart}>
                Né après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.keys.birthdateStart}
                name={AnimalSearchParams.keys.birthdateStart}
                value={toIsoDateValue(animalSearchParams.birthdateStart)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.birthdateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          const copy = new URLSearchParams(searchParams);
                          AnimalSearchParams.set(copy, {
                            birthdateStart: undefined,
                          });
                          return copy;
                        });
                      }}
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.keys.birthdateEnd}>
                Né avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.keys.birthdateEnd}
                name={AnimalSearchParams.keys.birthdateEnd}
                value={toIsoDateValue(animalSearchParams.birthdateEnd)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.birthdateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          const copy = new URLSearchParams(searchParams);
                          AnimalSearchParams.set(copy, {
                            birthdateEnd: undefined,
                          });
                          return copy;
                        });
                      }}
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
          value={AnimalSearchParams.keys.statuses}
          label="Statuts"
          count={animalSearchParams.statuses.size}
          hiddenContent={Array.from(animalSearchParams.statuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={AnimalSearchParams.keys.statuses}
                value={status}
              />
            )
          )}
        >
          <ToggleInputList>
            {SORTED_STATUS.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={STATUS_TRANSLATION[status]}
                name={AnimalSearchParams.keys.statuses}
                value={status}
                icon={<StatusIcon status={status} />}
                checked={animalSearchParams.statuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.keys.pickUpLocations}
          label="Prise en charge"
          count={
            animalSearchParams.pickUpReasons.size +
            (animalSearchParams.pickUpDateStart == null ? 0 : 1) +
            (animalSearchParams.pickUpDateEnd == null ? 0 : 1) +
            animalSearchParams.pickUpLocations.size
          }
          hiddenContent={
            <>
              {Array.from(animalSearchParams.pickUpReasons).map(
                (pickUpReason) => (
                  <input
                    key={pickUpReason}
                    type="hidden"
                    name={AnimalSearchParams.keys.pickUpReasons}
                    value={pickUpReason}
                  />
                )
              )}
              {animalSearchParams.pickUpDateStart == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.keys.pickUpDateStart}
                  value={toIsoDateValue(animalSearchParams.pickUpDateStart)}
                />
              )}
              {animalSearchParams.pickUpDateEnd == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.keys.pickUpDateEnd}
                  value={toIsoDateValue(animalSearchParams.pickUpDateEnd)}
                />
              )}
              {Array.from(animalSearchParams.pickUpLocations).map(
                (location) => (
                  <input
                    key={location}
                    type="hidden"
                    name={AnimalSearchParams.keys.pickUpLocations}
                    value={location}
                  />
                )
              )}
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
                    name={AnimalSearchParams.keys.pickUpReasons}
                    value={pickUpReason}
                    icon={<Icon id={PICK_UP_REASON_ICON[pickUpReason]} />}
                    checked={animalSearchParams.pickUpReasons.has(pickUpReason)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.keys.pickUpDateStart}>
                Après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.keys.pickUpDateStart}
                name={AnimalSearchParams.keys.pickUpDateStart}
                value={toIsoDateValue(animalSearchParams.pickUpDateStart)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.pickUpDateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          const copy = new URLSearchParams(searchParams);
                          AnimalSearchParams.set(copy, {
                            pickUpDateStart: undefined,
                          });
                          return copy;
                        });
                      }}
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.keys.pickUpDateEnd}>
                Avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.keys.pickUpDateEnd}
                name={AnimalSearchParams.keys.pickUpDateEnd}
                value={toIsoDateValue(animalSearchParams.pickUpDateEnd)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.pickUpDateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          const copy = new URLSearchParams(searchParams);
                          AnimalSearchParams.set(copy, {
                            pickUpDateEnd: undefined,
                          });
                          return copy;
                        });
                      }}
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
                    name={AnimalSearchParams.keys.pickUpLocations}
                    value={location}
                    icon={<Icon id="locationDot" />}
                    checked={animalSearchParams.pickUpLocations.has(location)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>
          </Form.Fields>
        </Filters.Filter>

        {isCurrentUserAnimalAdmin ? (
          <Filters.Filter
            value={AnimalSearchParams.keys.sterilizations}
            label="Stérilisé"
            count={animalSearchParams.sterilizations.size}
            hiddenContent={Array.from(animalSearchParams.sterilizations).map(
              (isSterilized) => (
                <input
                  key={isSterilized}
                  type="hidden"
                  name={AnimalSearchParams.keys.sterilizations}
                  value={isSterilized}
                />
              )
            )}
          >
            <ToggleInputList>
              <ToggleInput
                type="checkbox"
                label="Oui"
                name={AnimalSearchParams.keys.sterilizations}
                value={AnimalSterilization.YES}
                icon={<Icon id="scissors" />}
                checked={animalSearchParams.sterilizations.has(
                  AnimalSterilization.YES
                )}
                onChange={() => {}}
              />

              <ToggleInput
                type="checkbox"
                label="Non"
                name={AnimalSearchParams.keys.sterilizations}
                value={AnimalSterilization.NO}
                icon={<Icon id="scissors" />}
                checked={animalSearchParams.sterilizations.has(
                  AnimalSterilization.NO
                )}
                onChange={() => {}}
              />

              <ToggleInput
                type="checkbox"
                label="Non, et ne le sera pas"
                name={AnimalSearchParams.keys.sterilizations}
                value={AnimalSterilization.NOT_MANDATORY}
                icon={<Icon id="scissors" />}
                checked={animalSearchParams.sterilizations.has(
                  AnimalSterilization.NOT_MANDATORY
                )}
                onChange={() => {}}
              />
            </ToggleInputList>
          </Filters.Filter>
        ) : null}

        {isCurrentUserAnimalAdmin ? (
          <Filters.Filter
            value={AnimalSearchParams.keys.vaccination}
            label="Prochaine vaccination"
            count={
              animalSearchParams.vaccination.size +
              (animalSearchParams.nextVaccinationDateStart == null ? 0 : 1) +
              (animalSearchParams.nextVaccinationDateEnd == null ? 0 : 1)
            }
            hiddenContent={
              <>
                {Array.from(animalSearchParams.vaccination).map(
                  (vaccination) => (
                    <input
                      key={vaccination}
                      type="hidden"
                      name={AnimalSearchParams.keys.vaccination}
                      value={vaccination}
                    />
                  )
                )}
                {animalSearchParams.nextVaccinationDateStart == null ? null : (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.keys.nextVaccinationDateStart}
                    value={toIsoDateValue(
                      animalSearchParams.nextVaccinationDateStart
                    )}
                  />
                )}
                {animalSearchParams.nextVaccinationDateEnd == null ? null : (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.keys.nextVaccinationDateEnd}
                    value={toIsoDateValue(
                      animalSearchParams.nextVaccinationDateEnd
                    )}
                  />
                )}
              </>
            }
          >
            <Form.Fields>
              <Form.Field>
                <ToggleInputList>
                  <ToggleInput
                    type="checkbox"
                    label="Aucune prévue"
                    name={AnimalSearchParams.keys.vaccination}
                    value={AnimalVaccination.NONE_PLANNED}
                    icon={<Icon id="syringe" />}
                    checked={animalSearchParams.vaccination.has(
                      AnimalVaccination.NONE_PLANNED
                    )}
                    onChange={() => {}}
                  />

                  <ToggleInput
                    type="checkbox"
                    label="Ne sera pas vacciné"
                    name={AnimalSearchParams.keys.vaccination}
                    value={AnimalVaccination.NOT_MANDATORY}
                    icon={<Icon id="syringe" />}
                    checked={animalSearchParams.vaccination.has(
                      AnimalVaccination.NOT_MANDATORY
                    )}
                    onChange={() => {}}
                  />
                </ToggleInputList>
              </Form.Field>

              <Form.Field>
                <Form.Label
                  htmlFor={AnimalSearchParams.keys.nextVaccinationDateStart}
                >
                  Après le et incluant
                </Form.Label>

                <ControlledInput
                  type="date"
                  id={AnimalSearchParams.keys.nextVaccinationDateStart}
                  name={AnimalSearchParams.keys.nextVaccinationDateStart}
                  value={toIsoDateValue(
                    animalSearchParams.nextVaccinationDateStart
                  )}
                  leftAdornment={
                    <ControlledInput.Adornment>
                      <Icon id="calendarDays" />
                    </ControlledInput.Adornment>
                  }
                  rightAdornment={
                    animalSearchParams.nextVaccinationDateStart != null ? (
                      <ControlledInput.ActionAdornment
                        onClick={() => {
                          setSearchParams((searchParams) => {
                            const copy = new URLSearchParams(searchParams);
                            AnimalSearchParams.set(copy, {
                              nextVaccinationDateStart: undefined,
                            });
                            return copy;
                          });
                        }}
                      >
                        <Icon id="xMark" />
                      </ControlledInput.ActionAdornment>
                    ) : null
                  }
                />
              </Form.Field>

              <Form.Field>
                <Form.Label
                  htmlFor={AnimalSearchParams.keys.nextVaccinationDateEnd}
                >
                  Avant le et incluant
                </Form.Label>

                <ControlledInput
                  type="date"
                  id={AnimalSearchParams.keys.nextVaccinationDateEnd}
                  name={AnimalSearchParams.keys.nextVaccinationDateEnd}
                  value={toIsoDateValue(
                    animalSearchParams.nextVaccinationDateEnd
                  )}
                  leftAdornment={
                    <ControlledInput.Adornment>
                      <Icon id="calendarDays" />
                    </ControlledInput.Adornment>
                  }
                  rightAdornment={
                    animalSearchParams.nextVaccinationDateEnd != null ? (
                      <ControlledInput.ActionAdornment
                        onClick={() => {
                          setSearchParams((searchParams) => {
                            const copy = new URLSearchParams(searchParams);
                            AnimalSearchParams.set(copy, {
                              nextVaccinationDateEnd: undefined,
                            });
                            return copy;
                          });
                        }}
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
          value={AnimalSearchParams.keys.fivResults}
          label="Dépistage"
          count={
            animalSearchParams.fivResults.size +
            animalSearchParams.felvResults.size
          }
          hiddenContent={
            <>
              {Array.from(animalSearchParams.fivResults).map((result) => (
                <input
                  key={result}
                  type="hidden"
                  name={AnimalSearchParams.keys.fivResults}
                  value={result}
                />
              ))}
              {Array.from(animalSearchParams.felvResults).map((result) => (
                <input
                  key={result}
                  type="hidden"
                  name={AnimalSearchParams.keys.felvResults}
                  value={result}
                />
              ))}
            </>
          }
        >
          <Form.Fields>
            <Form.Field>
              <Form.Label asChild>
                <span>FIV</span>
              </Form.Label>

              <ToggleInputList>
                {SORTED_SCREENING_RESULTS.map((result) => (
                  <ToggleInput
                    key={result}
                    type="checkbox"
                    label={SCREENING_RESULT_TRANSLATION[result][Gender.MALE]}
                    name={AnimalSearchParams.keys.fivResults}
                    value={result}
                    icon={<Icon id={SCREENING_RESULT_ICON[result]} />}
                    checked={animalSearchParams.fivResults.has(result)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label asChild>
                <span>FeLV</span>
              </Form.Label>

              <ToggleInputList>
                {SORTED_SCREENING_RESULTS.map((result) => (
                  <ToggleInput
                    key={result}
                    type="checkbox"
                    label={SCREENING_RESULT_TRANSLATION[result][Gender.MALE]}
                    name={AnimalSearchParams.keys.felvResults}
                    value={result}
                    icon={<Icon id={SCREENING_RESULT_ICON[result]} />}
                    checked={animalSearchParams.felvResults.has(result)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>
          </Form.Fields>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.keys.adoptionOptions}
          label="Adoption"
          count={
            (animalSearchParams.adoptionDateStart == null ? 0 : 1) +
            (animalSearchParams.adoptionDateEnd == null ? 0 : 1) +
            animalSearchParams.adoptionOptions.size
          }
          hiddenContent={
            <>
              {animalSearchParams.adoptionDateStart == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.keys.adoptionDateStart}
                  value={toIsoDateValue(animalSearchParams.adoptionDateStart)}
                />
              )}
              {animalSearchParams.adoptionDateEnd == null ? null : (
                <input
                  type="hidden"
                  name={AnimalSearchParams.keys.adoptionDateEnd}
                  value={toIsoDateValue(animalSearchParams.adoptionDateEnd)}
                />
              )}
              {Array.from(animalSearchParams.adoptionOptions).map(
                (adoptionOption) => (
                  <input
                    key={adoptionOption}
                    type="hidden"
                    name={AnimalSearchParams.keys.adoptionOptions}
                    value={adoptionOption}
                  />
                )
              )}
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
                    name={AnimalSearchParams.keys.adoptionOptions}
                    value={adoptionOption}
                    icon={<Icon id={ADOPTION_OPTION_ICON[adoptionOption]} />}
                    checked={animalSearchParams.adoptionOptions.has(
                      adoptionOption
                    )}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.keys.adoptionDateStart}>
                Adopté après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.keys.adoptionDateStart}
                name={AnimalSearchParams.keys.adoptionDateStart}
                value={toIsoDateValue(animalSearchParams.adoptionDateStart)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.adoptionDateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          const copy = new URLSearchParams(searchParams);
                          AnimalSearchParams.set(copy, {
                            adoptionDateStart: undefined,
                          });
                          return copy;
                        });
                      }}
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={AnimalSearchParams.keys.adoptionDateEnd}>
                Adopté avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={AnimalSearchParams.keys.adoptionDateEnd}
                name={AnimalSearchParams.keys.adoptionDateEnd}
                value={toIsoDateValue(animalSearchParams.adoptionDateEnd)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.adoptionDateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          const copy = new URLSearchParams(searchParams);
                          AnimalSearchParams.set(copy, {
                            adoptionDateEnd: undefined,
                          });
                          return copy;
                        });
                      }}
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
            value={AnimalSearchParams.keys.fosterFamiliesId}
            label="Familles d’accueil"
            count={animalSearchParams.fosterFamiliesId.size}
            hiddenContent={Array.from(animalSearchParams.fosterFamiliesId).map(
              (fosterFamilyId) => (
                <input
                  key={fosterFamilyId}
                  type="hidden"
                  name={AnimalSearchParams.keys.fosterFamiliesId}
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
                  name={AnimalSearchParams.keys.fosterFamiliesId}
                  value={fosterFamily.id}
                  icon={
                    <FosterFamilyAvatar fosterFamily={fosterFamily} size="sm" />
                  }
                  checked={animalSearchParams.fosterFamiliesId.has(
                    fosterFamily.id
                  )}
                  onChange={() => {}}
                />
              ))}
            </ToggleInputList>
          </Filters.Filter>
        ) : null}

        <Filters.Filter
          value={AnimalSearchParams.keys.managersId}
          label="Responsables"
          count={animalSearchParams.managersId.size}
          hiddenContent={Array.from(animalSearchParams.managersId).map(
            (managerId) => (
              <input
                key={managerId}
                type="hidden"
                name={AnimalSearchParams.keys.managersId}
                value={managerId}
              />
            )
          )}
        >
          <ToggleInputList>
            {managers.map((manager) => (
              <ToggleInput
                key={manager.id}
                type="checkbox"
                label={manager.displayName}
                name={AnimalSearchParams.keys.managersId}
                value={manager.id}
                icon={<UserAvatar user={manager} size="sm" />}
                checked={animalSearchParams.managersId.has(manager.id)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={AnimalSearchParams.keys.nameOrAlias}
          label="Nom ou alias"
          count={animalSearchParams.nameOrAlias == null ? 0 : 1}
          hiddenContent={
            animalSearchParams.nameOrAlias == null ? null : (
              <input
                type="hidden"
                name={AnimalSearchParams.keys.nameOrAlias}
                value={animalSearchParams.nameOrAlias}
              />
            )
          }
        >
          <ControlledInput
            name={AnimalSearchParams.keys.nameOrAlias}
            value={animalSearchParams.nameOrAlias ?? ""}
            rightAdornment={
              animalSearchParams.nameOrAlias != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() => {
                    setSearchParams((searchParams) => {
                      const copy = new URLSearchParams(searchParams);
                      AnimalSearchParams.set(copy, {
                        nameOrAlias: undefined,
                      });
                      return copy;
                    });
                  }}
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
  const toSearchParams = AnimalSearchParams.create({
    statuses: new Set(ACTIVE_ANIMAL_STATUS),
  });

  const [searchParams] = useOptimisticSearchParams();
  const isActive = AnimalSearchParams.areEqual(searchParams, toSearchParams);

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
  const toSearchParams = AnimalSearchParams.create({
    statuses: new Set(ACTIVE_ANIMAL_STATUS),
    managersId: new Set([currentUser.id]),
  });

  const [searchParams] = useOptimisticSearchParams();
  const isActive = AnimalSearchParams.areEqual(searchParams, toSearchParams);

  return (
    <Action asChild variant="secondary" color={isActive ? "blue" : "gray"}>
      <BaseLink replace to={{ search: toSearchParams.toString() }}>
        {isActive ? <Icon id="check" /> : null}À votre charge
      </BaseLink>
    </Action>
  );
}
