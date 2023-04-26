import { Action } from "~/core/actions";
import { BaseLink } from "~/core/baseLink";
import { Filters } from "~/core/controllers/filters";
import { toIsoDateValue } from "~/core/dates";
import { ActionAdornment, Adornment } from "~/core/formElements/adornment";
import { ControlledInput } from "~/core/formElements/controlledInput";
import {
  Suggestion,
  SuggestionInput,
  SuggestionLabel,
  Suggestions,
} from "~/core/formElements/filterSuggestions";
import { Form } from "~/core/formElements/form";
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
          count={
            visibleFilters.sort === UserSearchParams.Sort.RELEVANCE ? 0 : 1
          }
          hiddenContent={
            <input
              type="hidden"
              name={UserSearchParams.Keys.SORT}
              value={visibleFilters.sort}
            />
          }
        >
          <Suggestions>
            <Suggestion>
              <SuggestionInput
                type="radio"
                name={UserSearchParams.Keys.SORT}
                value={UserSearchParams.Sort.RELEVANCE}
                checked={
                  visibleFilters.sort === UserSearchParams.Sort.RELEVANCE
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
                name={UserSearchParams.Keys.SORT}
                value={UserSearchParams.Sort.NAME}
                checked={visibleFilters.sort === UserSearchParams.Sort.NAME}
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="arrowDownAZ" />}>
                Alphabétique
              </SuggestionLabel>
            </Suggestion>

            <Suggestion>
              <SuggestionInput
                type="radio"
                name={UserSearchParams.Keys.SORT}
                value={UserSearchParams.Sort.LAST_ACTIVITY}
                checked={
                  visibleFilters.sort === UserSearchParams.Sort.LAST_ACTIVITY
                }
                onChange={() => {}}
              />

              <SuggestionLabel icon={<Icon id="wavePulse" />}>
                Dernière activité
              </SuggestionLabel>
            </Suggestion>
          </Suggestions>
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
                <ActionAdornment
                  onClick={() =>
                    setSearchParams(userSearchParams.deleteDisplayName())
                  }
                >
                  <Icon id="xMark" />
                </ActionAdornment>
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
          <Suggestions>
            {SORTED_GROUPS.map((group) => (
              <Suggestion key={group}>
                <SuggestionInput
                  type="checkbox"
                  name={UserSearchParams.Keys.GROUP}
                  value={group}
                  checked={visibleFilters.groups.includes(group)}
                  onChange={() => {}}
                />

                <SuggestionLabel icon={<Icon id={GROUP_ICON[group]} />}>
                  {GROUP_TRANSLATION[group]}
                </SuggestionLabel>
              </Suggestion>
            ))}
          </Suggestions>
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
              <Suggestions>
                <Suggestion>
                  <SuggestionInput
                    type="checkbox"
                    name={UserSearchParams.Keys.NO_ACTIVITY}
                    value={String(true)}
                    checked={visibleFilters.noActivity}
                    onChange={() => {}}
                  />

                  <SuggestionLabel icon={<Icon id="wavePulse" />}>
                    Aucune activité
                  </SuggestionLabel>
                </Suggestion>
              </Suggestions>
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
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.minActivity != null ? (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(userSearchParams.deleteMinActivity())
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
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
                  <Adornment>
                    <Icon id="calendarDays" />
                  </Adornment>
                }
                rightAdornment={
                  visibleFilters.maxActivity != null ? (
                    <ActionAdornment
                      onClick={() =>
                        setSearchParams(userSearchParams.deleteMaxActivity())
                      }
                    >
                      <Icon id="xMark" />
                    </ActionAdornment>
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
