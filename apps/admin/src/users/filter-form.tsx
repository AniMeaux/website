import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { toIsoDateValue } from "#core/dates";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { Form } from "#core/form-elements/form";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import { Icon } from "#generated/icon";
import { GROUP_ICON, GROUP_TRANSLATION, SORTED_GROUPS } from "#users/groups";
import {
  USER_DEFAULT_SORT,
  UserSearchParams,
  UserSort,
} from "#users/search-params";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function UserFilterForm() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const userSearchParams = UserSearchParams.parse(searchParams);

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
          value={UserSearchParams.keys.sort}
          label="Trier"
          count={userSearchParams.sort === USER_DEFAULT_SORT ? 0 : 1}
          hiddenContent={
            userSearchParams.sort !== USER_DEFAULT_SORT ? (
              <input
                type="hidden"
                name={UserSearchParams.keys.sort}
                value={userSearchParams.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={UserSearchParams.keys.sort}
              value={UserSort.NAME}
              icon={<Icon href="icon-arrow-down-a-z-solid" />}
              checked={userSearchParams.sort === UserSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Dernière activité"
              name={UserSearchParams.keys.sort}
              value={UserSort.LAST_ACTIVITY}
              icon={<Icon href="icon-wave-pulse-solid" />}
              checked={userSearchParams.sort === UserSort.LAST_ACTIVITY}
              onChange={() => {}}
            />
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={UserSearchParams.keys.displayName}
          label="Nom"
          count={userSearchParams.displayName == null ? 0 : 1}
          hiddenContent={
            userSearchParams.displayName != null ? (
              <input
                type="hidden"
                name={UserSearchParams.keys.displayName}
                value={userSearchParams.displayName}
              />
            ) : null
          }
        >
          <ControlledInput
            name={UserSearchParams.keys.displayName}
            value={userSearchParams.displayName ?? ""}
            rightAdornment={
              userSearchParams.displayName != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams((searchParams) => {
                      return UserSearchParams.set(
                        searchParams,
                        (userSearchParams) => ({
                          ...userSearchParams,
                          displayName: undefined,
                        }),
                      );
                    })
                  }
                >
                  <Icon href="icon-x-mark-solid" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>

        <Filters.Filter
          value={UserSearchParams.keys.groups}
          label="Groupes"
          count={userSearchParams.groups.size}
          hiddenContent={Array.from(userSearchParams.groups).map((group) => (
            <input
              key={group}
              type="hidden"
              name={UserSearchParams.keys.groups}
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
                name={UserSearchParams.keys.groups}
                value={group}
                icon={<Icon href={GROUP_ICON[group]} />}
                checked={userSearchParams.groups.has(group)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={UserSearchParams.keys.noActivity}
          label="Dernière activité"
          count={
            (userSearchParams.lastActivityStart == null ? 0 : 1) +
            (userSearchParams.lastActivityEnd == null ? 0 : 1) +
            (userSearchParams.noActivity ? 1 : 0)
          }
          hiddenContent={
            <>
              {userSearchParams.lastActivityStart != null ? (
                <input
                  type="hidden"
                  name={UserSearchParams.keys.lastActivityStart}
                  value={toIsoDateValue(userSearchParams.lastActivityStart)}
                />
              ) : null}
              {userSearchParams.lastActivityEnd != null ? (
                <input
                  type="hidden"
                  name={UserSearchParams.keys.lastActivityEnd}
                  value={toIsoDateValue(userSearchParams.lastActivityEnd)}
                />
              ) : null}
              {userSearchParams.noActivity ? (
                <input
                  type="hidden"
                  name={UserSearchParams.keys.noActivity}
                  value="on"
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
                  name={UserSearchParams.keys.noActivity}
                  icon={<Icon href="icon-wave-pulse-solid" />}
                  checked={userSearchParams.noActivity}
                  onChange={() => {}}
                />
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={UserSearchParams.keys.lastActivityStart}>
                Après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={UserSearchParams.keys.lastActivityStart}
                name={UserSearchParams.keys.lastActivityStart}
                value={toIsoDateValue(userSearchParams.lastActivityStart)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  userSearchParams.lastActivityStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams((searchParams) => {
                          return UserSearchParams.set(
                            searchParams,
                            (userSearchParams) => ({
                              ...userSearchParams,
                              lastActivityStart: undefined,
                            }),
                          );
                        })
                      }
                    >
                      <Icon href="icon-x-mark-solid" />
                    </ControlledInput.ActionAdornment>
                  ) : null
                }
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={UserSearchParams.keys.lastActivityEnd}>
                Avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={UserSearchParams.keys.lastActivityEnd}
                name={UserSearchParams.keys.lastActivityEnd}
                value={toIsoDateValue(userSearchParams.lastActivityEnd)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  userSearchParams.lastActivityEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() =>
                        setSearchParams((searchParams) => {
                          return UserSearchParams.set(
                            searchParams,
                            (userSearchParams) => ({
                              ...userSearchParams,
                              lastActivityEnd: undefined,
                            }),
                          );
                        })
                      }
                    >
                      <Icon href="icon-x-mark-solid" />
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
