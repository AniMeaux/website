import { ActivityAction } from "#activity/action";
import { ActivityResource } from "#activity/resource";
import { ActivitySearchParams } from "#activity/search-params";
import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { toIsoDateValue } from "#core/dates";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { Form } from "#core/form-elements/form";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import { Icon } from "#generated/icon";
import { UserAvatar } from "#users/avatar";
import type { User } from "@animeaux/prisma/client";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function ActivityFilters({
  users,
}: {
  users: Pick<User, "displayName" | "id">[];
}) {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const activitySearchParams = ActivitySearchParams.io.parse(searchParams);

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
          value={ActivitySearchParams.io.keys.usersId}
          label="Utilisateurs"
          count={activitySearchParams.usersId.size}
          hiddenContent={Array.from(activitySearchParams.usersId).map(
            (userId) => (
              <input
                key={userId}
                type="hidden"
                name={ActivitySearchParams.io.keys.usersId}
                value={userId}
              />
            ),
          )}
        >
          <ToggleInputList>
            {users.map((user) => (
              <ToggleInput
                key={user.id}
                type="checkbox"
                label={user.displayName}
                name={ActivitySearchParams.io.keys.usersId}
                value={user.id}
                icon={<UserAvatar user={user} size="sm" />}
                checked={activitySearchParams.usersId.has(user.id)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={ActivitySearchParams.io.keys.actions}
          label="Actions"
          count={activitySearchParams.actions.size}
          hiddenContent={Array.from(activitySearchParams.actions).map(
            (action) => (
              <input
                key={action}
                type="hidden"
                name={ActivitySearchParams.io.keys.actions}
                value={action}
              />
            ),
          )}
        >
          <ToggleInputList>
            {ActivityAction.values.map((action) => (
              <ToggleInput
                key={action}
                type="checkbox"
                label={ActivityAction.translations[action]}
                name={ActivitySearchParams.io.keys.actions}
                value={action}
                icon={<Icon href={ActivityAction.icon[action]} />}
                checked={activitySearchParams.actions.has(action)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={ActivitySearchParams.io.keys.resources}
          label="Resources"
          count={
            activitySearchParams.resources.size +
            (activitySearchParams.resourceId == null ? 0 : 1)
          }
          hiddenContent={
            <>
              {Array.from(activitySearchParams.resources).map((resource) => (
                <input
                  key={resource}
                  type="hidden"
                  name={ActivitySearchParams.io.keys.resources}
                  value={resource}
                />
              ))}

              {activitySearchParams.resourceId == null ? null : (
                <input
                  type="hidden"
                  name={ActivitySearchParams.io.keys.resourceId}
                  value={activitySearchParams.resourceId}
                />
              )}
            </>
          }
        >
          <Form.Fields>
            <Form.Field>
              <ToggleInputList>
                {ActivityResource.values.map((resource) => (
                  <ToggleInput
                    key={resource}
                    type="checkbox"
                    label={ActivityResource.translations[resource]}
                    name={ActivitySearchParams.io.keys.resources}
                    value={resource}
                    icon={<Icon href={ActivityResource.icon[resource]} />}
                    checked={activitySearchParams.resources.has(resource)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor={ActivitySearchParams.io.keys.resourceId}>
                Identifant
              </Form.Label>

              <ControlledInput
                id={ActivitySearchParams.io.keys.resourceId}
                name={ActivitySearchParams.io.keys.resourceId}
                value={activitySearchParams.resourceId ?? ""}
                rightAdornment={
                  activitySearchParams.resourceId != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return ActivitySearchParams.io.set(
                            searchParams,
                            (activitySearchParams) => ({
                              ...activitySearchParams,
                              resourceId: undefined,
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
          value={ActivitySearchParams.io.keys.dateStart}
          label="Date"
          count={
            (activitySearchParams.dateStart == null ? 0 : 1) +
            (activitySearchParams.dateEnd == null ? 0 : 1)
          }
          hiddenContent={
            <>
              {activitySearchParams.dateStart == null ? null : (
                <input
                  type="hidden"
                  name={ActivitySearchParams.io.keys.dateStart}
                  value={toIsoDateValue(activitySearchParams.dateStart)}
                />
              )}
              {activitySearchParams.dateEnd == null ? null : (
                <input
                  type="hidden"
                  name={ActivitySearchParams.io.keys.dateEnd}
                  value={toIsoDateValue(activitySearchParams.dateEnd)}
                />
              )}
            </>
          }
        >
          <Form.Fields>
            <Form.Field>
              <Form.Label htmlFor={ActivitySearchParams.io.keys.dateStart}>
                Après le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={ActivitySearchParams.io.keys.dateStart}
                name={ActivitySearchParams.io.keys.dateStart}
                value={toIsoDateValue(activitySearchParams.dateStart)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  activitySearchParams.dateStart != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return ActivitySearchParams.io.set(
                            searchParams,
                            (activitySearchParams) => ({
                              ...activitySearchParams,
                              dateStart: undefined,
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
              <Form.Label htmlFor={ActivitySearchParams.io.keys.dateEnd}>
                Avant le et incluant
              </Form.Label>

              <ControlledInput
                type="date"
                id={ActivitySearchParams.io.keys.dateEnd}
                name={ActivitySearchParams.io.keys.dateEnd}
                value={toIsoDateValue(activitySearchParams.dateEnd)}
                leftAdornment={
                  <ControlledInput.Adornment>
                    <Icon href="icon-calendar-days-solid" />
                  </ControlledInput.Adornment>
                }
                rightAdornment={
                  activitySearchParams.dateEnd != null ? (
                    <ControlledInput.ActionAdornment
                      onClick={() => {
                        setSearchParams((searchParams) => {
                          return ActivitySearchParams.io.set(
                            searchParams,
                            (activitySearchParams) => ({
                              ...activitySearchParams,
                              dateEnd: undefined,
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
      </Filters.Content>
    </Filters>
  );
}
