import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filters } from "~/core/controllers/filters";
import { toIsoDateValue } from "~/core/dates";
import { ControlledInput } from "~/core/formElements/controlledInput";
import { Form } from "~/core/formElements/form";
import { ToggleInput, ToggleInputList } from "~/core/formElements/toggleInput";
import { useOptimisticSearchParams } from "~/core/searchParams";
import { Icon } from "~/generated/icon";
import { GROUP_ICON, GROUP_TRANSLATION, SORTED_GROUPS } from "~/users/groups";
import { UserSearchParams } from "~/users/searchParams";

export function UserFilterForm() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const userSearchParams = new UserSearchParams(searchParams);
  const visibleFilters = {
    displayName: userSearchParams.getDisplayName(),
    groups: userSearchParams.getGroups(),
    maxActivity: userSearchParams.getMaxActivity(),
    minActivity: userSearchParams.getMinActivity(),
    noActivity: userSearchParams.getNoActivity(),
    sort: userSearchParams.getSort(),
  };

  return (
    <Filters>
      <Filters.Actions>
        <Action asChild variant="secondary" color="gray">
          <BaseLink replace to={{ search: "" }}>
            Tout effacer
          </BaseLink>
        </Action>
      </Filters.Actions>

      <Filters.Content>
        <Filters.Filter
          value={UserSearchParams.Keys.SORT}
          label="Trier"
          count={visibleFilters.sort === UserSearchParams.Sort.NAME ? 0 : 1}
          hiddenContent={
            <input
              type="hidden"
              name={UserSearchParams.Keys.SORT}
              value={visibleFilters.sort}
            />
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={UserSearchParams.Keys.SORT}
              value={UserSearchParams.Sort.NAME}
              icon={<Icon id="arrowDownAZ" />}
              checked={visibleFilters.sort === UserSearchParams.Sort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Dernière activité"
              name={UserSearchParams.Keys.SORT}
              value={UserSearchParams.Sort.LAST_ACTIVITY}
              icon={<Icon id="wavePulse" />}
              checked={
                visibleFilters.sort === UserSearchParams.Sort.LAST_ACTIVITY
              }
              onChange={() => {}}
            />
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={UserSearchParams.Keys.DISPLAY_NAME}
          label="Nom"
          count={visibleFilters.displayName == null ? 0 : 1}
          hiddenContent={
            <input
              type="hidden"
              name={UserSearchParams.Keys.DISPLAY_NAME}
              value={visibleFilters.displayName ?? ""}
            />
          }
        >
          <ControlledInput
            name={UserSearchParams.Keys.DISPLAY_NAME}
            value={visibleFilters.displayName ?? ""}
            rightAdornment={
              visibleFilters.displayName != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams(userSearchParams.deleteDisplayName())
                  }
                >
                  <Icon id="xMark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>

        <Filters.Filter
          value={UserSearchParams.Keys.GROUP}
          label="Groupes"
          count={visibleFilters.groups.length}
          hiddenContent={visibleFilters.groups.map((group) => (
            <input
              key={group}
              type="hidden"
              name={UserSearchParams.Keys.GROUP}
              value={group}
            />
          ))}
        >
          <ToggleInputList>
            {SORTED_GROUPS.map((group) => (
              <ToggleInput
                key={group}
                type="checkbox"
                label={GROUP_TRANSLATION[group]}
                name={UserSearchParams.Keys.GROUP}
                value={group}
                icon={<Icon id={GROUP_ICON[group]} />}
                checked={visibleFilters.groups.includes(group)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={UserSearchParams.Keys.NO_ACTIVITY}
          label="Dernière activité"
          count={
            (visibleFilters.minActivity == null ? 0 : 1) +
            (visibleFilters.maxActivity == null ? 0 : 1) +
            (visibleFilters.noActivity ? 1 : 0)
          }
          hiddenContent={
            <>
              <input
                type="hidden"
                name={UserSearchParams.Keys.MIN_ACTIVITY}
                value={toIsoDateValue(visibleFilters.minActivity)}
              />
              <input
                type="hidden"
                name={UserSearchParams.Keys.MAX_ACTIVITY}
                value={toIsoDateValue(visibleFilters.maxActivity)}
              />
              {visibleFilters.noActivity ? (
                <input
                  type="hidden"
                  name={UserSearchParams.Keys.NO_ACTIVITY}
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
                  label="Aucune activité"
                  name={UserSearchParams.Keys.NO_ACTIVITY}
                  value={String(true)}
                  icon={<Icon id="wavePulse" />}
                  checked={visibleFilters.noActivity}
                  onChange={() => {}}
                />
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={UserSearchParams.Keys.MIN_ACTIVITY}>
                Après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={UserSearchParams.Keys.MIN_ACTIVITY}
                name={UserSearchParams.Keys.MIN_ACTIVITY}
                value={toIsoDateValue(visibleFilters.minActivity)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.minActivity != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(userSearchParams.deleteMinActivity())
                      }
                    >
                      <Icon id="xMark" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={UserSearchParams.Keys.MAX_ACTIVITY}>
                Avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={UserSearchParams.Keys.MAX_ACTIVITY}
                name={UserSearchParams.Keys.MAX_ACTIVITY}
                value={toIsoDateValue(visibleFilters.maxActivity)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon id="calendarDays" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  visibleFilters.maxActivity != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams(userSearchParams.deleteMaxActivity())
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
      </Filters.Content>
    </Filters>
  );
}
