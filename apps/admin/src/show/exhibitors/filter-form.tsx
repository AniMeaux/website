import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { Filters } from "#i/core/controllers/filters";
import { ControlledInput } from "#i/core/form-elements/controlled-input";
import { Form } from "#i/core/form-elements/form";
import {
  ToggleInput,
  ToggleInputList,
} from "#i/core/form-elements/toggle-input";
import { Icon } from "#i/generated/icon";
import { ActivityField } from "#i/show/exhibitors/activity-field/activity-field";
import { ActivityFieldIcon } from "#i/show/exhibitors/activity-field/icon";
import { ActivityTarget } from "#i/show/exhibitors/activity-target/activity-target";
import { ActivityTargetIcon } from "#i/show/exhibitors/activity-target/icon";
import {
  ApplicationStatusIcon,
  SORTED_STATUSES,
  TRANSLATION_BY_APPLICATION_STATUS,
} from "#i/show/exhibitors/applications/status";
import { ExhibitorSearchParams } from "#i/show/exhibitors/search-params";
import { ExhibitorStatus } from "#i/show/exhibitors/status";
import { ExhibitorStatusIcon } from "#i/show/exhibitors/status-icon.js";
import { InvoiceIcon } from "#i/show/invoice/icon.js";
import { InvoiceStatus } from "#i/show/invoice/status.js";
import {
  SponsorshipCategoryIcon,
  SponsorshipOptionalCategory,
} from "#i/show/sponsors/category";
import { Visibility, VisibilityIcon } from "#i/show/visibility";
import type { ShowDividerType, ShowStandSize } from "@animeaux/prisma";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

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
        <FilterLaureates />
        <FilterStandSize standSizes={standSizes} />
        <FilterAnimations />
        <FilterDividerType dividerTypes={dividerTypes} />
      </Filters.Content>
    </Filters>
  );
}

function FilterActivity() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.targets}
      label="Activité"
      count={exhibitorSearchParams.targets.size}
      hiddenContent={Array.from(exhibitorSearchParams.targets).map((target) => (
        <input
          key={target}
          type="hidden"
          name={ExhibitorSearchParams.io.keys.targets}
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
                name={ExhibitorSearchParams.io.keys.targets}
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
                name={ExhibitorSearchParams.io.keys.fields}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.animations}
      label="Animations"
      count={exhibitorSearchParams.animations.size}
      hiddenContent={Array.from(exhibitorSearchParams.animations).map(
        (animation) => (
          <input
            key={animation}
            type="hidden"
            name={ExhibitorSearchParams.io.keys.animations}
            value={animation}
          />
        ),
      )}
    >
      <ToggleInputList>
        {ExhibitorSearchParams.Animation.values.map((animation) => (
          <ToggleInput
            key={animation}
            type="checkbox"
            label={ExhibitorSearchParams.Animation.translations[animation]}
            name={ExhibitorSearchParams.io.keys.animations}
            value={animation}
            icon={
              <Icon
                href={ExhibitorSearchParams.Animation.icons[animation].light}
              />
            }
            iconChecked={
              <Icon
                href={ExhibitorSearchParams.Animation.icons[animation].solid}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.dividerTypesId}
      label="Type de cloison"
      count={exhibitorSearchParams.dividerTypesId.size}
      hiddenContent={Array.from(exhibitorSearchParams.dividerTypesId).map(
        (dividerTypeId) => (
          <input
            key={dividerTypeId}
            type="hidden"
            name={ExhibitorSearchParams.io.keys.dividerTypesId}
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
            name={ExhibitorSearchParams.io.keys.dividerTypesId}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.name}
      label="Nom"
      count={exhibitorSearchParams.name == null ? 0 : 1}
      hiddenContent={
        exhibitorSearchParams.name != null ? (
          <input
            type="hidden"
            name={ExhibitorSearchParams.io.keys.name}
            value={exhibitorSearchParams.name}
          />
        ) : null
      }
    >
      <ControlledInput
        name={ExhibitorSearchParams.io.keys.name}
        value={exhibitorSearchParams.name ?? ""}
        rightAdornment={
          exhibitorSearchParams.name != null ? (
            <ControlledInput.ActionAdornment
              onClick={() =>
                setSearchParams((searchParams) => {
                  return ExhibitorSearchParams.io.set(
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

function FilterLaureates() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.laureats}
      label="Lauréats"
      count={exhibitorSearchParams.laureats.size}
      hiddenContent={Array.from(exhibitorSearchParams.laureats).map(
        (laureat) => (
          <input
            key={laureat}
            type="hidden"
            name={ExhibitorSearchParams.io.keys.laureats}
            value={laureat}
          />
        ),
      )}
    >
      <ToggleInputList>
        {ExhibitorSearchParams.Laureat.values.map((laureat) => (
          <ToggleInput
            key={laureat}
            type="checkbox"
            label={ExhibitorSearchParams.Laureat.translations[laureat]}
            name={ExhibitorSearchParams.io.keys.laureats}
            value={laureat}
            icon={
              <Icon href={ExhibitorSearchParams.Laureat.icons[laureat].light} />
            }
            iconChecked={
              <Icon href={ExhibitorSearchParams.Laureat.icons[laureat].solid} />
            }
            checked={exhibitorSearchParams.laureats.has(laureat)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterSponsorship() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.sponsorshipCategories}
      label="Catégorie de sponsor"
      count={exhibitorSearchParams.sponsorshipCategories.size}
      hiddenContent={Array.from(
        exhibitorSearchParams.sponsorshipCategories,
      ).map((category) => (
        <input
          key={category}
          type="hidden"
          name={ExhibitorSearchParams.io.keys.sponsorshipCategories}
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
            name={ExhibitorSearchParams.io.keys.sponsorshipCategories}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.invoiceStatuses}
      label="Factures"
      count={exhibitorSearchParams.invoiceStatuses.size}
      hiddenContent={Array.from(exhibitorSearchParams.invoiceStatuses).map(
        (status) => (
          <input
            key={status}
            type="hidden"
            name={ExhibitorSearchParams.io.keys.invoiceStatuses}
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
            name={ExhibitorSearchParams.io.keys.invoiceStatuses}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.sort}
      label="Trier"
      count={
        exhibitorSearchParams.sort === ExhibitorSearchParams.Sort.defaultValue
          ? 0
          : 1
      }
      hiddenContent={
        exhibitorSearchParams.sort !==
        ExhibitorSearchParams.Sort.defaultValue ? (
          <input
            type="hidden"
            name={ExhibitorSearchParams.io.keys.sort}
            value={exhibitorSearchParams.sort}
          />
        ) : null
      }
    >
      <ToggleInputList>
        {ExhibitorSearchParams.Sort.values.map((sort) => (
          <ToggleInput
            key={sort}
            type="radio"
            label={ExhibitorSearchParams.Sort.translations[sort]}
            name={ExhibitorSearchParams.io.keys.sort}
            value={sort}
            icon={<Icon href={ExhibitorSearchParams.Sort.icons[sort].light} />}
            iconChecked={
              <Icon href={ExhibitorSearchParams.Sort.icons[sort].solid} />
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.standSizesId}
      label="Taille du stand"
      count={exhibitorSearchParams.standSizesId.size}
      hiddenContent={Array.from(exhibitorSearchParams.standSizesId).map(
        (standSizeId) => (
          <input
            key={standSizeId}
            type="hidden"
            name={ExhibitorSearchParams.io.keys.standSizesId}
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
            name={ExhibitorSearchParams.io.keys.standSizesId}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.applicationStatuses}
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
                name={ExhibitorSearchParams.io.keys.applicationStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.descriptionStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.io.keys.descriptionStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.documentsStatuses).map((status) => (
            <input
              key={status}
              type="hidden"
              name={ExhibitorSearchParams.io.keys.documentsStatuses}
              value={status}
            />
          ))}

          {Array.from(exhibitorSearchParams.dogsConfigurationStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.io.keys.dogsConfigurationStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.onStandAnimationsStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.io.keys.onStandAnimationsStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.publicProfileStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.io.keys.publicProfileStatuses}
                value={status}
              />
            ),
          )}

          {Array.from(exhibitorSearchParams.standConfigurationStatuses).map(
            (status) => (
              <input
                key={status}
                type="hidden"
                name={ExhibitorSearchParams.io.keys.standConfigurationStatuses}
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
                name={ExhibitorSearchParams.io.keys.publicProfileStatuses}
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
                name={ExhibitorSearchParams.io.keys.descriptionStatuses}
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
                name={ExhibitorSearchParams.io.keys.onStandAnimationsStatuses}
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
                name={ExhibitorSearchParams.io.keys.documentsStatuses}
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
                name={ExhibitorSearchParams.io.keys.standConfigurationStatuses}
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
                name={ExhibitorSearchParams.io.keys.dogsConfigurationStatuses}
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
                name={ExhibitorSearchParams.io.keys.applicationStatuses}
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
  const exhibitorSearchParams = ExhibitorSearchParams.io.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.io.keys.visibility}
      label="Visibilité"
      count={exhibitorSearchParams.visibility.size}
      hiddenContent={Array.from(exhibitorSearchParams.visibility).map(
        (visibility) => (
          <input
            key={visibility}
            type="hidden"
            name={ExhibitorSearchParams.io.keys.visibility}
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
            name={ExhibitorSearchParams.io.keys.visibility}
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
