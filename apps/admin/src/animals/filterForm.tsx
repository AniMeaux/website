import { AGE_ICON, AGE_TRANSLATION, SORTED_AGES } from "#/animals/age";
import { AnimalSearchParams } from "#/animals/searchParams";
import {
  SORTED_SPECIES,
  SPECIES_ICON,
  SPECIES_TRANSLATION,
} from "#/animals/species";
import {
  ACTIVE_ANIMAL_STATUS,
  SORTED_STATUS,
  StatusIcon,
  STATUS_TRANSLATION,
} from "#/animals/status";
import { actionClassName } from "#/core/actions";
import { BaseLink } from "#/core/baseLink";
import { Filter, Filters } from "#/core/controllers/filters";
import { ActionAdornment, Adornment } from "#/core/formElements/adornment";
import { formClassNames } from "#/core/formElements/form";
import { Input } from "#/core/formElements/input";
import { Icon } from "#/generated/icon";
import { UserAvatar } from "#/users/avatar";
import { hasGroups } from "#/users/groups";
import { UserGroup } from "@prisma/client";
import {
  Form,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { DateTime } from "luxon";

export function AnimalFilters({
  currentUser,
  managers,
  possiblePickUpLocations,
}: {
  currentUser: ActiveFilterLinkProps["currentUser"];
  managers: { displayName: string; id: string }[];
  possiblePickUpLocations: string[];
}) {
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useVisibleSearchParams();
  const visibleFilters = {
    sort: searchParams.getSort(),
    nameOrAlias: searchParams.getNameOrAlias(),
    species: searchParams.getSpecies(),
    ages: searchParams.getAges(),
    statuses: searchParams.getStatuses(),
    managersId: searchParams.getManagersId(),
    minPickUpDate: searchParams.getMinPickUpDate(),
    maxPickUpDate: searchParams.getMaxPickUpDate(),
    pickUpLocations: searchParams.getPickUpLocations(),
  };

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

        <ActiveFilterLink currentUser={currentUser} />
      </div>

      <Filters>
        <Filter
          value="sort"
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
          value="nameOrAlias"
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
          <Input
            name={AnimalSearchParams.Keys.NAME_OR_ALIAS}
            value={visibleFilters.nameOrAlias ?? ""}
            onChange={() => {}}
            rightAdornment={
              visibleFilters.nameOrAlias != null && (
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(searchParams.deleteNameOrAlias())
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
              )
            }
          />
        </Filter>

        <Filter
          value="species"
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
          value="ages"
          label="Âges"
          count={visibleFilters.ages.length}
          hiddenContent={visibleFilters.ages.map((age) => (
            <input
              key={age}
              type="hidden"
              name={AnimalSearchParams.Keys.AGE}
              value={age}
            />
          ))}
        >
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
        </Filter>

        <Filter
          value="status"
          label="Status"
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
          value="manager"
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

        <Filter
          value="pick-up"
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
                Après le
              </span>

              <Input
                type="date"
                name={AnimalSearchParams.Keys.MIN_PICK_UP_DATE}
                value={toIsoDate(visibleFilters.minPickUpDate)}
                onChange={() => {}}
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.minPickUpDate != null && (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(searchParams.deleteMinPickUpDate())
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
                  )
                }
              />
            </div>

            <div className={formClassNames.fields.field.root()}>
              <span className={formClassNames.fields.field.label()}>
                Avant le
              </span>

              <Input
                type="date"
                name={AnimalSearchParams.Keys.MAX_PICK_UP_DATE}
                value={toIsoDate(visibleFilters.maxPickUpDate)}
                onChange={() => {}}
                leftAdornment={
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.maxPickUpDate != null && (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(searchParams.deleteMaxPickUpDate())
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
                  )
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

type ActiveFilterLinkProps = {
  currentUser: { id: string; groups: UserGroup[] };
};

function ActiveFilterLink({ currentUser }: ActiveFilterLinkProps) {
  const isCurrentUserManager = hasGroups(currentUser, [
    UserGroup.ANIMAL_MANAGER,
  ]);

  let toSearchParams = new AnimalSearchParams().setStatuses(
    ACTIVE_ANIMAL_STATUS
  );
  if (isCurrentUserManager) {
    toSearchParams = toSearchParams.setManagersId([currentUser.id]);
  }

  const [searchParams] = useVisibleSearchParams();
  const isActive = toSearchParams.areFiltersEqual(searchParams);

  return (
    <BaseLink
      to={{ search: toSearchParams.toString() }}
      className={actionClassName.standalone({
        variant: "secondary",
        color: isActive ? "blue" : "gray",
      })}
    >
      {isActive && <Icon id="check" />}
      {isCurrentUserManager ? "À votre charge" : "Animaux en charge"}
    </BaseLink>
  );
}

function useVisibleSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const transition = useTransition();
  let nextSearchParams: URLSearchParams | undefined;
  if (transition.location?.pathname === "/animals") {
    nextSearchParams = new URLSearchParams(transition.location.search);
  }

  return [
    new AnimalSearchParams(
      // Optimistic UI.
      nextSearchParams ?? searchParams
    ),
    setSearchParams,
  ] as const;
}

function Suggestions({ children }: { children?: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}

function Suggestion({ children }: { children?: React.ReactNode }) {
  return (
    <label className="group relative z-0 rounded-0.5 grid grid-cols-[auto_minmax(0px,1fr)_auto] items-start cursor-pointer focus-within:z-10">
      {children}
    </label>
  );
}

function SuggestionInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="peer appearance-none absolute -z-10 top-0 left-0 w-full h-full rounded-0.5 cursor-pointer transition-colors duration-100 ease-in-out group-hover:bg-gray-100 checked:bg-gray-100 focus-visible:outline-none focus-visible:ring-outset focus-visible:ring focus-visible:ring-blue-400"
    />
  );
}

function SuggestionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <span className="h-4 w-4 flex items-center justify-center text-gray-600 text-[20px]">
        {icon}
      </span>

      <span className="py-1 text-body-default peer-checked:text-body-emphasis">
        {children}
      </span>

      <span className="opacity-0 h-4 w-4 flex items-center justify-center text-green-600 transition-opacity duration-100 ease-in-out peer-checked:opacity-100">
        <Icon id="check" />
      </span>
    </>
  );
}
