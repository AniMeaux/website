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
  DocumentsStatus,
  DocumentsStatusIcon,
} from "#show/exhibitors/documents/status";
import {
  DOGS_CONFIGURATION_STATUS_TRANSLATION,
  DOGS_CONFIGURATION_STATUS_VALUES,
  DogsConfigurationStatusIcon,
} from "#show/exhibitors/dogs-configuration/status";
import { Payment, PaymentIcon } from "#show/exhibitors/payment";
import {
  ProfileStatus,
  ProfileStatusIcon,
} from "#show/exhibitors/profile/status";
import {
  ExhibitorSearchParams,
  ExhibitorSearchParamsN,
} from "#show/exhibitors/search-params";
import {
  StandConfigurationStatus,
  StandConfigurationStatusIcon,
} from "#show/exhibitors/stand-configuration/status";
import {
  PartnershipCategory,
  PartnershipCategoryIcon,
} from "#show/partners/category";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function ExhibitorFilters() {
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
        <FilterPayment />
        <FilterActivity />
        <FilterPartnership />
        <FilterAnimations />
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

function FilterPartnership() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.partnershipCategories}
      label="Catégorie de partenariat"
      count={exhibitorSearchParams.partnershipCategories.size}
      hiddenContent={Array.from(
        exhibitorSearchParams.partnershipCategories,
      ).map((category) => (
        <input
          key={category}
          type="hidden"
          name={ExhibitorSearchParams.keys.partnershipCategories}
          value={category}
        />
      ))}
    >
      <ToggleInputList>
        {PartnershipCategory.values.map((category) => (
          <ToggleInput
            key={category}
            type="checkbox"
            label={PartnershipCategory.translation[category]}
            name={ExhibitorSearchParams.keys.partnershipCategories}
            value={category}
            icon={
              <PartnershipCategoryIcon category={category} variant="light" />
            }
            iconChecked={
              <PartnershipCategoryIcon category={category} variant="solid" />
            }
            checked={exhibitorSearchParams.partnershipCategories.has(category)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterPayment() {
  const [searchParams] = useOptimisticSearchParams();
  const exhibitorSearchParams = ExhibitorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={ExhibitorSearchParams.keys.payment}
      label="Paiement"
      count={exhibitorSearchParams.payment.size}
      hiddenContent={Array.from(exhibitorSearchParams.payment).map(
        (payment) => (
          <input
            key={payment}
            type="hidden"
            name={ExhibitorSearchParams.keys.payment}
            value={payment}
          />
        ),
      )}
    >
      <ToggleInputList>
        {Payment.values.map((payment) => (
          <ToggleInput
            key={payment}
            type="checkbox"
            label={Payment.translation[payment]}
            name={ExhibitorSearchParams.keys.payment}
            value={payment}
            icon={<PaymentIcon variant="light" payment={payment} />}
            iconChecked={<PaymentIcon variant="solid" payment={payment} />}
            checked={exhibitorSearchParams.payment.has(payment)}
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
            {ProfileStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ProfileStatus.translation[status]}
                name={ExhibitorSearchParams.keys.publicProfileStatuses}
                value={status}
                icon={<ProfileStatusIcon status={status} />}
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
            {ProfileStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ProfileStatus.translation[status]}
                name={ExhibitorSearchParams.keys.descriptionStatuses}
                value={status}
                icon={<ProfileStatusIcon status={status} />}
                checked={exhibitorSearchParams.descriptionStatuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Animations sur stand</Form.Label>

          <ToggleInputList>
            {ProfileStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={ProfileStatus.translation[status]}
                name={ExhibitorSearchParams.keys.onStandAnimationsStatuses}
                value={status}
                icon={<ProfileStatusIcon status={status} />}
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
            {DocumentsStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={DocumentsStatus.translation[status]}
                name={ExhibitorSearchParams.keys.documentsStatuses}
                value={status}
                icon={<DocumentsStatusIcon status={status} />}
                checked={exhibitorSearchParams.documentsStatuses.has(status)}
                onChange={() => {}}
              />
            ))}
          </ToggleInputList>
        </Form.Field>

        <Form.Field>
          <Form.Label>Configuration de stand</Form.Label>

          <ToggleInputList>
            {StandConfigurationStatus.values.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={StandConfigurationStatus.translation[status]}
                name={ExhibitorSearchParams.keys.standConfigurationStatuses}
                value={status}
                icon={<StandConfigurationStatusIcon status={status} />}
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
            {DOGS_CONFIGURATION_STATUS_VALUES.map((status) => (
              <ToggleInput
                key={status}
                type="checkbox"
                label={DOGS_CONFIGURATION_STATUS_TRANSLATION[status]}
                name={ExhibitorSearchParams.keys.dogsConfigurationStatuses}
                value={status}
                icon={<DogsConfigurationStatusIcon status={status} />}
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
