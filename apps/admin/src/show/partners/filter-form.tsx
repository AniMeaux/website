import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import { Icon } from "#generated/icon";
import {
  PartnershipCategory,
  PartnershipCategoryIcon,
} from "#show/partners/category";
import {
  PartnerSearchParams,
  PartnerSearchParamsN,
} from "#show/partners/search-params";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function PartnerFilters() {
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
        <FilterName />
        <FilterCategory />
        <FilterVisibility />
        <FilterExhibitor />
      </Filters.Content>
    </Filters>
  );
}

function FilterCategory() {
  const [searchParams] = useOptimisticSearchParams();
  const partnerSearchParams = PartnerSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={PartnerSearchParams.keys.categories}
      label="Catégorie de sponsor"
      count={partnerSearchParams.categories.size}
      hiddenContent={Array.from(partnerSearchParams.categories).map(
        (category) => (
          <input
            key={category}
            type="hidden"
            name={PartnerSearchParams.keys.categories}
            value={category}
          />
        ),
      )}
    >
      <ToggleInputList>
        {PartnershipCategory.values.map((category) => (
          <ToggleInput
            key={category}
            type="checkbox"
            label={PartnershipCategory.translation[category]}
            name={PartnerSearchParams.keys.categories}
            value={category}
            icon={
              <PartnershipCategoryIcon category={category} variant="light" />
            }
            iconChecked={
              <PartnershipCategoryIcon category={category} variant="solid" />
            }
            checked={partnerSearchParams.categories.has(category)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterExhibitor() {
  const [searchParams] = useOptimisticSearchParams();
  const partnerSearchParams = PartnerSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={PartnerSearchParams.keys.exhibitor}
      label="Exposant"
      count={partnerSearchParams.exhibitor.size}
      hiddenContent={Array.from(partnerSearchParams.exhibitor).map(
        (exhibitor) => (
          <input
            key={exhibitor}
            type="hidden"
            name={PartnerSearchParams.keys.exhibitor}
            value={exhibitor}
          />
        ),
      )}
    >
      <ToggleInputList>
        {PartnerSearchParamsN.Exhibitor.values.map((exhibitor) => (
          <ToggleInput
            key={exhibitor}
            type="checkbox"
            label={PartnerSearchParamsN.Exhibitor.translation[exhibitor]}
            name={PartnerSearchParams.keys.exhibitor}
            value={exhibitor}
            icon={
              <Icon
                href={PartnerSearchParamsN.Exhibitor.icon[exhibitor].light}
              />
            }
            iconChecked={
              <Icon
                href={PartnerSearchParamsN.Exhibitor.icon[exhibitor].solid}
              />
            }
            checked={partnerSearchParams.exhibitor.has(exhibitor)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterName() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const partnerSearchParams = PartnerSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={PartnerSearchParams.keys.name}
      label="Nom"
      count={partnerSearchParams.name == null ? 0 : 1}
      hiddenContent={
        partnerSearchParams.name != null ? (
          <input
            type="hidden"
            name={PartnerSearchParams.keys.name}
            value={partnerSearchParams.name}
          />
        ) : null
      }
    >
      <ControlledInput
        name={PartnerSearchParams.keys.name}
        value={partnerSearchParams.name ?? ""}
        rightAdornment={
          partnerSearchParams.name != null ? (
            <ControlledInput.ActionAdornment
              onClick={() =>
                setSearchParams((searchParams) => {
                  return PartnerSearchParams.set(
                    searchParams,
                    (partnerSearchParams) => ({
                      ...partnerSearchParams,
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

function FilterVisibility() {
  const [searchParams] = useOptimisticSearchParams();
  const partnerSearchParams = PartnerSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={PartnerSearchParams.keys.visibility}
      label="Visibilité"
      count={partnerSearchParams.visibility.size}
      hiddenContent={Array.from(partnerSearchParams.visibility).map(
        (visibility) => (
          <input
            key={visibility}
            type="hidden"
            name={PartnerSearchParams.keys.visibility}
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
            name={PartnerSearchParams.keys.visibility}
            value={visibility}
            icon={<VisibilityIcon variant="light" visibility={visibility} />}
            iconChecked={
              <VisibilityIcon variant="solid" visibility={visibility} />
            }
            checked={partnerSearchParams.visibility.has(visibility)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}
