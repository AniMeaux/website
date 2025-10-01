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
  ApplicationStatusIcon,
  SORTED_STATUSES,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#show/exhibitors/applications/status";
import {
  ExhibitorSearchParams,
  ExhibitorSearchParamsN,
} from "#show/exhibitors/search-params";
import { ExhibitorStatus } from "#show/exhibitors/status";
import { ExhibitorStatusIcon } from "#show/exhibitors/status-icon.js";
import { InvoiceIcon } from "#show/invoice/icon.js";
import { InvoiceStatus } from "#show/invoice/status.js";
import {
  SponsorshipCategoryIcon,
  SponsorshipOptionalCategory,
} from "#show/sponsors/category";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";
import type { ShowDividerType, ShowStandSize } from "@prisma/client";

export function ExhibitorFilters({
  dividerTypes,
  standSizes,
}: {
  dividerTypes: Pick<ShowDividerType, "id" | "label">[];
  standSizes: Pick<ShowStandSize, "id" | "label">[];
}) {
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
        <FilterSort />
        <FilterName />
        <FilterVisibility />
        <FilterStatuses />
        <FilterInvoiceStatuses />
        <FilterActivity />
        <FilterSponsorship />
        <FilterStandSize standSizes={standSizes} />
        <FilterAnimations />
        <FilterDividerType dividerTypes={dividerTypes} />
      </Filters.Content>
    </Filters>
  );
}

function FilterActivity() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.targets}
      label="Activité"
      count={exhibitorSearchParams.targets.size}
      hiddenContent={Array.from(exhibitorSearchParams.targets).map((target) => (
        <input
          key={target}
          type="hidden"
          name={ExhibitorSearchParams.keys.targets}
          value={target}
        />
      ))}
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
                name={ExhibitorSearchParams.keys.targets}
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
                checked={exhibitorSearchParams.targets.has(activityTarget)}
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
                name={ExhibitorSearchParams.keys.fields}
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
                checked={exhibitorSearchParams.fields.has(activityField)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>
      </Form.Fields>
    </Filters.Filter>
  );
}

function FilterAnimations() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.animations}
      label="Animations"
      count={exhibitorSearchParams.animations.size}
      hiddenContent={Array.from(exhibitorSearchParams.animations).map(
        (animation) => (
          <input
            key={animation}
            type="hidden"
            name={ExhibitorSearchParams.keys.animations}
            value={animation}
          />
        ),
      )}
    >
      <ToggleInputList>
        {ExhibitorSearchParamsN.ANIMATION_VALUES.map((animation) => (
          <ToggleInput
            key={animation}
            type="checkbox"
            label={ExhibitorSearchParamsN.ANIMATION_TRANSLATIONS[animation]}
            name={ExhibitorSearchParams.keys.animations}
            value={animation}
            icon={
              <Icon
                href={ExhibitorSearchParamsN.ANIMATION_ICONS[animation].light}
              />
            }
            iconChecked={
              <Icon
                href={ExhibitorSearchParamsN.ANIMATION_ICONS[animation].solid}
              />
            }
            checked={exhibitorSearchParams.animations.has(animation)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterDividerType({
  dividerTypes,
}: {
  dividerTypes: Pick<ShowDividerType, "id" | "label">[];
}) {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.dividerTypesId}
      label="Type de cloison"
      count={exhibitorSearchParams.dividerTypesId.size}
      hiddenContent={Array.from(exhibitorSearchParams.dividerTypesId).map(
        (dividerTypeId) => (
          <input
            key={dividerTypeId}
            type="hidden"
            name={ExhibitorSearchParams.keys.dividerTypesId}
            value={dividerTypeId}
          />
        ),
      )}
    >
      <ToggleInputList>
        {dividerTypes.map((dividerType) => (
          <ToggleInput
            key={dividerType.id}
            type="checkbox"
            label={dividerType.label}
            name={ExhibitorSearchParams.keys.dividerTypesId}
            value={dividerType.id}
            icon={<Icon href="icon-fence-light" />}
            iconChecked={<Icon href="icon-fence-solid" />}
            checked={exhibitorSearchParams.dividerTypesId.has(dividerType.id)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterName() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.name}
      label="Nom"
      count={exhibitorSearchParams.name == null ? 0 : 1}
      hiddenContent={
        exhibitorSearchParams.name != null ? (
          <input
            type="hidden"
            name={ExhibitorSearchParams.keys.name}
            value={exhibitorSearchParams.name}
          />
        ) : null
      }
    >
      <ControlledInput
        name={ExhibitorSearchParams.keys.name}
        value={exhibitorSearchParams.name ?? ""}
        rightAdornment={
          exhibitorSearchParams.name != null ? (
            <ControlledInput.ActionAdornment
              onClick={() =>
                setSearchParams((searchParams) => {
                  return ExhibitorSearchParams.set(
                    searchParams,
                    (exhibitorSearchParams) => ({
                      ...exhibitorSearchParams,
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
  );
}

function FilterSponsorship() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.sponsorshipCategories}
      label="Catégorie de sponsor"
      count={exhibitorSearchParams.sponsorshipCategories.size}
      hiddenContent={Array.from(
        exhibitorSearchParams.sponsorshipCategories,
      ).map((category) => (
        <input
          key={category}
          type="hidden"
          name={ExhibitorSearchParams.keys.sponsorshipCategories}
          value={category}
        />
      ))}
    >
      <ToggleInputList>
        {SponsorshipOptionalCategory.values.map((category) => (
          <ToggleInput
            key={category}
            type="checkbox"
            label={SponsorshipOptionalCategory.translation[category]}
            name={ExhibitorSearchParams.keys.sponsorshipCategories}
            value={category}
            icon={
              <SponsorshipCategoryIcon category={category} variant="light" />
            }
            iconChecked={
              <SponsorshipCategoryIcon category={category} variant="solid" />
            }
            checked={exhibitorSearchParams.sponsorshipCategories.has(category)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterInvoiceStatuses() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.invoiceStatuses}
      label="Factures"
      count={exhibitorSearchParams.invoiceStatuses.size}
      hiddenContent={Array.from(exhibitorSearchParams.invoiceStatuses).map(
        (status) => (
          <input
            key={status}
            type="hidden"
            name={ExhibitorSearchParams.keys.invoiceStatuses}
            value={status}
          />
        ),
      )}
    >
      <ToggleInputList>
        {InvoiceStatus.values.map((status) => (
          <ToggleInput
            key={status}
            type="checkbox"
            label={InvoiceStatus.translation[status]}
            name={ExhibitorSearchParams.keys.invoiceStatuses}
            value={status}
            icon={<InvoiceIcon status={status} />}
            checked={exhibitorSearchParams.invoiceStatuses.has(status)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterSort() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.sort}
      label="Trier"
      count={
        exhibitorSearchParams.sort === ExhibitorSearchParamsN.SORT_DEFAULT_VALUE
          ? 0
          : 1
      }
      hiddenContent={
        exhibitorSearchParams.sort !==
        ExhibitorSearchParamsN.SORT_DEFAULT_VALUE ? (
          <input
            type="hidden"
            name={ExhibitorSearchParams.keys.sort}
            value={exhibitorSearchParams.sort}
          />
        ) : null
      }
    >
      <ToggleInputList>
        {ExhibitorSearchParamsN.SORT_VALUES.map((sort) => (
          <ToggleInput
            key={sort}
            type="radio"
            label={ExhibitorSearchParamsN.SORT_TRANSLATIONS[sort]}
            name={ExhibitorSearchParams.keys.sort}
            value={sort}
            icon={<Icon href={ExhibitorSearchParamsN.SORT_ICONS[sort].light} />}
            iconChecked={
              <Icon href={ExhibitorSearchParamsN.SORT_ICONS[sort].solid} />
            }
            checked={sort === exhibitorSearchParams.sort}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterStandSize({
  standSizes,
}: {
  standSizes: Pick<ShowStandSize, "id" | "label">[];
}) {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.standSizesId}
      label="Taille du stand"
      count={exhibitorSearchParams.standSizesId.size}
      hiddenContent={Array.from(exhibitorSearchParams.standSizesId).map(
        (standSizeId) => (
          <input
            key={standSizeId}
            type="hidden"
            name={ExhibitorSearchParams.keys.standSizesId}
            value={standSizeId}
          />
        ),
      )}
    >
      <ToggleInputList>
        {standSizes.map((standSize) => (
          <ToggleInput
            key={standSize.id}
            type="checkbox"
            label={standSize.label}
            name={ExhibitorSearchParams.keys.standSizesId}
            value={standSize.id}
            icon={<Icon href="icon-expand-light" />}
            iconChecked={<Icon href="icon-expand-solid" />}
            checked={exhibitorSearchParams.standSizesId.has(standSize.id)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterStatuses() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.applicationStatuses}
      label="Statut"
      count={
        exhibitorSearchParams.applicationStatuses.size +
        exhibitorSearchParams.descriptionStatuses.size +
        exhibitorSearchParams.documentsStatuses.size +
        exhibitorSearchParams.dogsConfigurationStatuses.size +
        exhibitorSearchParams.onStandAnimationsStatuses.size +
        exhibitorSearchParams.publicProfileStatuses.size +
        exhibitorSearchParams.standConfigurationStatuses.size
      }
      hiddenContent={
        <>
          {Array.from(exhibitorSearchParams.applicationStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.keys.applicationStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.descriptionStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.keys.descriptionStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.documentsStatuses).map((status) => (
            <input
              key={status}
              type="hidden"
              name={ExhibitorSearchParams.keys.documentsStatuses}
              value={status}
            />
          ))}

          {Array.from(exhibitorSearchParams.dogsConfigurationStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.keys.dogsConfigurationStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.onStandAnimationsStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.keys.onStandAnimationsStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.publicProfileStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.keys.publicProfileStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.standConfigurationStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.keys.standConfigurationStatuses}
                value={status}
              />
            ),
          )}
        </>
      }
    >
      <Form.Fields>
        <Form.Field>
          <Form.Label>Profil public</Form.Label>

          <ToggleInputList>
            {ExhibitorStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ExhibitorStatus.translation[status]}
                name={ExhibitorSearchParams.keys.publicProfileStatuses}
                value={status}
                icon={<ExhibitorStatusIcon status={status} />}
                checked={exhibitorSearchParams.publicProfileStatuses.has(
                  status,
                )}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Description</Form.Label>

          <ToggleInputList>
            {ExhibitorStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ExhibitorStatus.translation[status]}
                name={ExhibitorSearchParams.keys.descriptionStatuses}
                value={status}
                icon={<ExhibitorStatusIcon status={status} />}
                checked={exhibitorSearchParams.descriptionStatuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Animations sur stand</Form.Label>

          <ToggleInputList>
            {ExhibitorStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ExhibitorStatus.translation[status]}
                name={ExhibitorSearchParams.keys.onStandAnimationsStatuses}
                value={status}
                icon={<ExhibitorStatusIcon status={status} />}
                checked={exhibitorSearchParams.onStandAnimationsStatuses.has(
                  status,
                )}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Documents</Form.Label>

          <ToggleInputList>
            {ExhibitorStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ExhibitorStatus.translation[status]}
                name={ExhibitorSearchParams.keys.documentsStatuses}
                value={status}
                icon={<ExhibitorStatusIcon status={status} />}
                checked={exhibitorSearchParams.documentsStatuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Configuration de stand</Form.Label>

          <ToggleInputList>
            {ExhibitorStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ExhibitorStatus.translation[status]}
                name={ExhibitorSearchParams.keys.standConfigurationStatuses}
                value={status}
                icon={<ExhibitorStatusIcon status={status} />}
                checked={exhibitorSearchParams.standConfigurationStatuses.has(
                  status,
                )}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Chiens sur stand</Form.Label>

          <ToggleInputList>
            {ExhibitorStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ExhibitorStatus.translation[status]}
                name={ExhibitorSearchParams.keys.dogsConfigurationStatuses}
                value={status}
                icon={<ExhibitorStatusIcon status={status} />}
                checked={exhibitorSearchParams.dogsConfigurationStatuses.has(
                  status,
                )}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Candidature</Form.Label>

          <ToggleInputList>
            {SORTED_STATUSES.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={TRANSLATION_BY_APPLICATION_STATUS[status]}
                name={ExhibitorSearchParams.keys.applicationStatuses}
                value={status}
                icon={<ApplicationStatusIcon status={status} />}
                checked={exhibitorSearchParams.applicationStatuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>
      </Form.Fields>
    </Filters.Filter>
  );
}

function FilterVisibility() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.visibility}
      label="Visibilité"
      count={exhibitorSearchParams.visibility.size}
      hiddenContent={Array.from(exhibitorSearchParams.visibility).map(
        (visibility) => (
          <input
            key={visibility}
            type="hidden"
            name={ExhibitorSearchParams.keys.visibility}
            value={visibility}
          />
        ),
      )}
    >
      <ToggleInputList>
        {Visibility.values.map((visibility) => (
          <ToggleInput
            key={visibility}
            type="checkbox"
            label={Visibility.translation[visibility]}
            name={ExhibitorSearchParams.keys.visibility}
            value={visibility}
            icon={<VisibilityIcon variant="light" visibility={visibility} />}
            iconChecked={
              <VisibilityIcon variant="solid" visibility={visibility} />
            }
            checked={exhibitorSearchParams.visibility.has(visibility)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}
