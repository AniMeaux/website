import {
  ADOPTION_OPTION_ICON,
  ADOPTION_OPTION_TRANSLATION,
  SORTED_ADOPTION_OPTION,
} from "#animals/adoption";
import { AGE_ICON, AGE_TRANSLATION, SORTED_AGES } from "#animals/age";
import {
  PICK_UP_REASON_ICON,
  PICK_UP_REASON_TRANSLATION,
  SORTED_PICK_UP_REASON,
} from "#animals/pick-up";
import {
  SCREENING_RESULT_ICON,
  SCREENING_RESULT_TRANSLATION,
  SORTED_SCREENING_RESULTS,
} from "#animals/screening";
import {
  ANIMAL_DEFAULT_SORT,
  AnimalSearchParams,
  AnimalSort,
  AnimalSortSearchParams,
  AnimalSterilization,
  AnimalVaccination,
} from "#animals/search-params";
import {
  DIAGNOSIS_TRANSLATION,
  SORTED_DIAGNOSIS,
} from "#animals/situation/diagnosis";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#animals/species";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  STATUS_TRANSLATION,
  StatusIcon,
} from "#animals/status";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { toIsoDateValue } from "#core/dates";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { Form } from "#core/form-elements/form";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import { FosterFamilyAvatar } from "#foster-families/avatar";
import { Icon } from "#generated/icon";
import { UserAvatar } from "#users/avatar";
import { hasGroups } from "#users/groups";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import type { FosterFamily, User } from "@prisma/client";
import { Gender, UserGroup } from "@prisma/client";
import type { SerializeFrom } from "@remix-run/node";

export function AnimalFilters({
  currentUser,
  managers,
  fosterFamilies,
  possiblePickUpLocations,
}: {
  currentUser: Pick<User, "groups" | "id">;
  managers: Pick<User, "displayName" | "id">[];
  fosterFamilies: SerializeFrom<
    Pick<FosterFamily, "availability" | "displayName" | "id">
  >[];
  possiblePickUpLocations: string[];
}) {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const animalSortSearchParams = AnimalSortSearchParams.parse(searchParams);
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
          value={AnimalSortSearchParams.keys.sort}
          label="Trier"
          count={animalSortSearchParams.sort === ANIMAL_DEFAULT_SORT ? 0 : 1}
          hiddenContent={
            animalSortSearchParams.sort !== ANIMAL_DEFAULT_SORT ? (
              <input
                type="hidden"
                name={AnimalSortSearchParams.keys.sort}
                value={animalSortSearchParams.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Date de prise en charge"
              name={AnimalSortSearchParams.keys.sort}
              value={AnimalSort.PICK_UP}
              icon={<Icon href="icon-hand-holding-heart-solid" />}
              checked={animalSortSearchParams.sort === AnimalSort.PICK_UP}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={AnimalSortSearchParams.keys.sort}
              value={AnimalSort.NAME}
              icon={<Icon href="icon-arrow-down-a-z-solid" />}
              checked={animalSortSearchParams.sort === AnimalSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Date de naissance"
              name={AnimalSortSearchParams.keys.sort}
              value={AnimalSort.BIRTHDATE}
              icon={<Icon href="icon-cake-candles-solid" />}
              checked={animalSortSearchParams.sort === AnimalSort.BIRTHDATE}
              onChange={() => {}}
            />

            {isCurrentUserAnimalAdmin ? (
              <ToggleInput
                type="radio"
                label="Date de vaccination"
                name={AnimalSortSearchParams.keys.sort}
                value={AnimalSort.VACCINATION}
                icon={<Icon href="icon-syringe-solid" />}
                checked={animalSortSearchParams.sort === AnimalSort.VACCINATION}
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
            ),
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
                icon={<Icon href={SPECIES_ICON[species]} />}
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
                    icon={<Icon href={AGE_ICON[age]} />}
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
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.birthdateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return AnimalSearchParams.set(
                            searchParams,
                            (animalSearchParams) => ({
                              ...animalSearchParams,
                              birthdateStart: undefined,
                            }),
                          );
                        });
                      }}
                    >
                      <Icon href="icon-x-mark-solid" />
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
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.birthdateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return AnimalSearchParams.set(
                            searchParams,
                            (animalSearchParams) => ({
                              ...animalSearchParams,
                              birthdateEnd: undefined,
                            }),
                          );
                        });
                      }}
                    >
                      <Icon href="icon-x-mark-solid" />
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
            ),
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
          value={AnimalSearchParams.keys.iCadNumber}
          label="Identification"
          count={animalSearchParams.iCadNumber == null ? 0 : 1}
          hiddenContent={
            animalSearchParams.iCadNumber == null ? null : (
              <input
                type="hidden"
                name={AnimalSearchParams.keys.iCadNumber}
                value={animalSearchParams.iCadNumber}
              />
            )
          }
        >
          <ControlledInput
            name={AnimalSearchParams.keys.iCadNumber}
            value={animalSearchParams.iCadNumber ?? ""}
            rightAdornment={
              animalSearchParams.iCadNumber != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() => {
                    setSearchParams((searchParams) => {
                      return AnimalSearchParams.set(
                        searchParams,
                        (animalSearchParams) => ({
                          ...animalSearchParams,
                          iCadNumber: undefined,
                        }),
                      );
                    });
                  }}
                >
                  <Icon href="icon-x-mark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
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
                ),
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
                ),
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
                    icon={<Icon href={PICK_UP_REASON_ICON[pickUpReason]} />}
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
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.pickUpDateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return AnimalSearchParams.set(
                            searchParams,
                            (animalSearchParams) => ({
                              ...animalSearchParams,
                              pickUpDateStart: undefined,
                            }),
                          );
                        });
                      }}
                    >
                      <Icon href="icon-x-mark-solid" />
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
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.pickUpDateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return AnimalSearchParams.set(
                            searchParams,
                            (animalSearchParams) => ({
                              ...animalSearchParams,
                              pickUpDateEnd: undefined,
                            }),
                          );
                        });
                      }}
                    >
                      <Icon href="icon-x-mark-solid" />
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
                    icon={<Icon href="icon-location-dot-solid" />}
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
              ),
            )}
          >
            <ToggleInputList>
              <ToggleInput
                type="checkbox"
                label="Oui"
                name={AnimalSearchParams.keys.sterilizations}
                value={AnimalSterilization.YES}
                icon={<Icon href="icon-scissors-solid" />}
                checked={animalSearchParams.sterilizations.has(
                  AnimalSterilization.YES,
                )}
                onChange={() => {}}
              />

              <ToggleInput
                type="checkbox"
                label="Non"
                name={AnimalSearchParams.keys.sterilizations}
                value={AnimalSterilization.NO}
                icon={<Icon href="icon-scissors-solid" />}
                checked={animalSearchParams.sterilizations.has(
                  AnimalSterilization.NO,
                )}
                onChange={() => {}}
              />

              <ToggleInput
                type="checkbox"
                label="Non, et ne le sera pas"
                name={AnimalSearchParams.keys.sterilizations}
                value={AnimalSterilization.NOT_MANDATORY}
                icon={<Icon href="icon-scissors-solid" />}
                checked={animalSearchParams.sterilizations.has(
                  AnimalSterilization.NOT_MANDATORY,
                )}
                onChange={() => {}}
              />
            </ToggleInputList>
          </Filters.Filter>
        ) : null}

        {isCurrentUserAnimalAdmin ? (
          <Filters.Filter
            value={AnimalSearchParams.keys.vaccinations}
            label="Prochaine vaccination"
            count={
              animalSearchParams.vaccinations.size +
              (animalSearchParams.nextVaccinationDateStart == null ? 0 : 1) +
              (animalSearchParams.nextVaccinationDateEnd == null ? 0 : 1)
            }
            hiddenContent={
              <>
                {Array.from(animalSearchParams.vaccinations).map(
                  (vaccination) => (
                    <input
                      key={vaccination}
                      type="hidden"
                      name={AnimalSearchParams.keys.vaccinations}
                      value={vaccination}
                    />
                  ),
                )}
                {animalSearchParams.nextVaccinationDateStart == null ? null : (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.keys.nextVaccinationDateStart}
                    value={toIsoDateValue(
                      animalSearchParams.nextVaccinationDateStart,
                    )}
                  />
                )}
                {animalSearchParams.nextVaccinationDateEnd == null ? null : (
                  <input
                    type="hidden"
                    name={AnimalSearchParams.keys.nextVaccinationDateEnd}
                    value={toIsoDateValue(
                      animalSearchParams.nextVaccinationDateEnd,
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
                    name={AnimalSearchParams.keys.vaccinations}
                    value={AnimalVaccination.NONE_PLANNED}
                    icon={<Icon href="icon-syringe-solid" />}
                    checked={animalSearchParams.vaccinations.has(
                      AnimalVaccination.NONE_PLANNED,
                    )}
                    onChange={() => {}}
                  />

                  <ToggleInput
                    type="checkbox"
                    label="Ne sera pas vacciné"
                    name={AnimalSearchParams.keys.vaccinations}
                    value={AnimalVaccination.NOT_MANDATORY}
                    icon={<Icon href="icon-syringe-solid" />}
                    checked={animalSearchParams.vaccinations.has(
                      AnimalVaccination.NOT_MANDATORY,
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
                    animalSearchParams.nextVaccinationDateStart,
                  )}
                  leftAdornment={
                    <ControlledInput.Adornment>
                      <Icon href="icon-calendar-days-solid" />
                    </ControlledInput.Adornment>
                  }
                  rightAdornment={
                    animalSearchParams.nextVaccinationDateStart != null ? (
                      <ControlledInput.ActionAdornment
                        onClick={() => {
                          setSearchParams((searchParams) => {
                            return AnimalSearchParams.set(
                              searchParams,
                              (animalSearchParams) => ({
                                ...animalSearchParams,
                                nextVaccinationDateStart: undefined,
                              }),
                            );
                          });
                        }}
                      >
                        <Icon href="icon-x-mark-solid" />
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
                    animalSearchParams.nextVaccinationDateEnd,
                  )}
                  leftAdornment={
                    <ControlledInput.Adornment>
                      <Icon href="icon-calendar-days-solid" />
                    </ControlledInput.Adornment>
                  }
                  rightAdornment={
                    animalSearchParams.nextVaccinationDateEnd != null ? (
                      <ControlledInput.ActionAdornment
                        onClick={() => {
                          setSearchParams((searchParams) => {
                            return AnimalSearchParams.set(
                              new URLSearchParams(searchParams),
                              (animalSearchParams) => ({
                                ...animalSearchParams,
                                nextVaccinationDateEnd: undefined,
                              }),
                            );
                          });
                        }}
                      >
                        <Icon href="icon-x-mark-solid" />
                      </ControlledInput.ActionAdornment>
                    ) : null
                  }
                />
              </Form.Field>
            </Form.Fields>
          </Filters.Filter>
        ) : null}

        <ScreeningAndDiagnosisFilter currentUser={currentUser} />

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
                ),
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
                    icon={<Icon href={ADOPTION_OPTION_ICON[adoptionOption]} />}
                    checked={animalSearchParams.adoptionOptions.has(
                      adoptionOption,
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
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.adoptionDateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return AnimalSearchParams.set(
                            searchParams,
                            (animalSearchParams) => ({
                              ...animalSearchParams,
                              adoptionDateStart: undefined,
                            }),
                          );
                        });
                      }}
                    >
                      <Icon href="icon-x-mark-solid" />
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
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  animalSearchParams.adoptionDateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return AnimalSearchParams.set(
                            searchParams,
                            (animalSearchParams) => ({
                              ...animalSearchParams,
                              adoptionDateEnd: undefined,
                            }),
                          );
                        });
                      }}
                    >
                      <Icon href="icon-x-mark-solid" />
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
              ),
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
                    <FosterFamilyAvatar
                      size="sm"
                      availability={fosterFamily.availability}
                    />
                  }
                  checked={animalSearchParams.fosterFamiliesId.has(
                    fosterFamily.id,
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
            ),
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
                      return AnimalSearchParams.set(
                        searchParams,
                        (animalSearchParams) => ({
                          ...animalSearchParams,
                          nameOrAlias: undefined,
                        }),
                      );
                    });
                  }}
                >
                  <Icon href="icon-x-mark-solid" />
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
  AnimalSortSearchParams.copy(searchParams, toSearchParams);

  const isActive = AnimalSearchParams.areEqual(searchParams, toSearchParams);

  return (
    <Action asChild variant="secondary" color={isActive ? "blue" : "gray"}>
      <BaseLink replace to={{ search: toSearchParams.toString() }}>
        {isActive ? <Action.Icon href="icon-check-solid" /> : null}
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
  AnimalSortSearchParams.copy(searchParams, toSearchParams);

  const isActive = AnimalSearchParams.areEqual(searchParams, toSearchParams);

  return (
    <Action asChild variant="secondary" color={isActive ? "blue" : "gray"}>
      <BaseLink replace to={{ search: toSearchParams.toString() }}>
        {isActive ? <Action.Icon href="icon-check-solid" /> : null}À votre
        charge
      </BaseLink>
    </Action>
  );
}

function ScreeningAndDiagnosisFilter({
  currentUser,
}: {
  currentUser: Pick<User, "groups" | "id">;
}) {
  const [searchParams] = useOptimisticSearchParams();
  const animalSearchParams = AnimalSearchParams.parse(searchParams);

  const isCurrentUserAnimalAdmin = hasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.ANIMAL_MANAGER,
    UserGroup.VETERINARIAN,
  ]);

  return (
    <Filters.Filter
      value={AnimalSearchParams.keys.fivResults}
      label="Dépistage et Diagnose"
      count={
        animalSearchParams.fivResults.size +
        animalSearchParams.felvResults.size +
        animalSearchParams.diagnosis.size
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

          {Array.from(animalSearchParams.diagnosis).map((diagnosis) => (
            <input
              key={diagnosis}
              type="hidden"
              name={AnimalSearchParams.keys.diagnosis}
              value={diagnosis}
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
                icon={<Icon href={SCREENING_RESULT_ICON[result]} />}
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
                icon={<Icon href={SCREENING_RESULT_ICON[result]} />}
                checked={animalSearchParams.felvResults.has(result)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        {isCurrentUserAnimalAdmin ? (
          <Form.Field>
            <Form.Label asChild>
              <span>Diagnose</span>
            </Form.Label>

            <ToggleInputList>
              {SORTED_DIAGNOSIS.map((diagnosis) => (
                <ToggleInput
                  key={diagnosis}
                  type="checkbox"
                  label={DIAGNOSIS_TRANSLATION[diagnosis][Gender.MALE]}
                  name={AnimalSearchParams.keys.diagnosis}
                  value={diagnosis}
                  icon={<Icon href="icon-shield-dog-solid" />}
                  checked={animalSearchParams.diagnosis.has(diagnosis)}
                  onChange={() => {}}
                />
              ))}
            </ToggleInputList>
          </Form.Field>
        ) : null}
      </Form.Fields>
    </Filters.Filter>
  );
}
