import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { Form } from "#core/form-elements/form";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import { Icon } from "#generated/icon";
import { ActivityField } from "#show/exhibitors/activity-field/activity-field";
import { ActivityFieldIcon } from "#show/exhibitors/activity-field/icon";
import { ActivityTarget } from "#show/exhibitors/activity-target/activity-target";
import { ActivityTargetIcon } from "#show/exhibitors/activity-target/icon";
import {
  ApplicationPartnershipCategory,
  ApplicationPartnershipCategoryIcon,
} from "#show/exhibitors/applications/partnership-category";
import {
  ApplicationSearchParams,
  ApplicationSearchParamsN,
} from "#show/exhibitors/applications/search-params";
import {
  ApplicationStatusIcon,
  SORTED_STATUSES,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#show/exhibitors/applications/status";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function ApplicationFilters() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const applicationSearchParams = ApplicationSearchParams.parse(searchParams);

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
          value={ApplicationSearchParams.keys.sort}
          label="Trier"
          count={
            applicationSearchParams.sort ===
            ApplicationSearchParamsN.DEFAULT_SORT
              ? 0
              : 1
          }
          hiddenContent={
            applicationSearchParams.sort !==
            ApplicationSearchParamsN.DEFAULT_SORT ? (
              <input
                type="hidden"
                name={ApplicationSearchParams.keys.sort}
                value={applicationSearchParams.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Date de candidature"
              name={ApplicationSearchParams.keys.sort}
              value={ApplicationSearchParamsN.Sort.CREATED_AT}
              icon={<Icon href="icon-clock-light" />}
              iconChecked={<Icon href="icon-clock-solid" />}
              checked={
                applicationSearchParams.sort ===
                ApplicationSearchParamsN.Sort.CREATED_AT
              }
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={ApplicationSearchParams.keys.sort}
              value={ApplicationSearchParamsN.Sort.NAME}
              icon={<Icon href="icon-arrow-down-a-z-light" />}
              iconChecked={<Icon href="icon-arrow-down-a-z-solid" />}
              checked={
                applicationSearchParams.sort ===
                ApplicationSearchParamsN.Sort.NAME
              }
              onChange={() => {}}
            />
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={ApplicationSearchParams.keys.name}
          label="Nom"
          count={applicationSearchParams.name == null ? 0 : 1}
          hiddenContent={
            applicationSearchParams.name != null ? (
              <input
                type="hidden"
                name={ApplicationSearchParams.keys.name}
                value={applicationSearchParams.name}
              />
            ) : null
          }
        >
          <ControlledInput
            name={ApplicationSearchParams.keys.name}
            value={applicationSearchParams.name ?? ""}
            rightAdornment={
              applicationSearchParams.name != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() =>
                    setSearchParams((searchParams) => {
                      return ApplicationSearchParams.set(
                        searchParams,
                        (applicationSearchParams) => ({
                          ...applicationSearchParams,
                          name: undefined,
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
          value={ApplicationSearchParams.keys.statuses}
          label="Statut"
          count={applicationSearchParams.statuses.size}
          hiddenContent={Array.from(applicationSearchParams.statuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ApplicationSearchParams.keys.statuses}
                value={status}
              />
            ),
          )}
        >
          <ToggleInputList>
            {SORTED_STATUSES.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={TRANSLATION_BY_APPLICATION_STATUS[status]}
                name={ApplicationSearchParams.keys.statuses}
                value={status}
                icon={<ApplicationStatusIcon status={status} />}
                checked={applicationSearchParams.statuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={ApplicationSearchParams.keys.targets}
          label="Activité"
          count={applicationSearchParams.targets.size}
          hiddenContent={Array.from(applicationSearchParams.targets).map(
            (target) => (
              <input
                key={target}
                type="hidden"
                name={ApplicationSearchParams.keys.targets}
                value={target}
              />
            ),
          )}
        >
          <Form.Fields>
            <Form.Field>
              <Form.Label>Cibles</Form.Label>

              <ToggleInputList>
                {ActivityTarget.values.map((activityTarget) => (
                  <ToggleInput
                    key={activityTarget}
                    type="checkbox"
                    label={ActivityTarget.translation[activityTarget]}
                    name={ApplicationSearchParams.keys.targets}
                    value={activityTarget}
                    icon={
                      <ActivityTargetIcon
                        activityTarget={activityTarget}
                        variant="light"
                      />
                    }
                    iconChecked={
                      <ActivityTargetIcon
                        activityTarget={activityTarget}
                        variant="solid"
                      />
                    }
                    checked={applicationSearchParams.targets.has(
                      activityTarget,
                    )}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>

            <Form.Field>
              <Form.Label>Domaines d’activités</Form.Label>

              <ToggleInputList>
                {ActivityField.values.map((activityField) => (
                  <ToggleInput
                    key={activityField}
                    type="checkbox"
                    label={ActivityField.translation[activityField]}
                    name={ApplicationSearchParams.keys.fields}
                    value={activityField}
                    icon={
                      <ActivityFieldIcon
                        activityField={activityField}
                        variant="light"
                      />
                    }
                    iconChecked={
                      <ActivityFieldIcon
                        activityField={activityField}
                        variant="solid"
                      />
                    }
                    checked={applicationSearchParams.fields.has(activityField)}
                    onChange={() => {}}
                  />
                ))}
              </ToggleInputList>
            </Form.Field>
          </Form.Fields>
        </Filters.Filter>

        <Filters.Filter
          value={ApplicationSearchParams.keys.partnershipCategories}
          label="Catégorie de partenariat"
          count={applicationSearchParams.partnershipCategories.size}
          hiddenContent={Array.from(
            applicationSearchParams.partnershipCategories,
          ).map((category) => (
            <input
              key={category}
              type="hidden"
              name={ApplicationSearchParams.keys.partnershipCategories}
              value={category}
            />
          ))}
        >
          <ToggleInputList>
            {ApplicationPartnershipCategory.values.map((category) => (
              <ToggleInput
                key={category}
                type="checkbox"
                label={ApplicationPartnershipCategory.translation[category]}
                name={ApplicationSearchParams.keys.partnershipCategories}
                value={category}
                icon={
                  <ApplicationPartnershipCategoryIcon
                    category={category}
                    variant="light"
                  />
                }
                iconChecked={
                  <ApplicationPartnershipCategoryIcon
                    category={category}
                    variant="solid"
                  />
                }
                checked={applicationSearchParams.partnershipCategories.has(
                  category,
                )}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
}
