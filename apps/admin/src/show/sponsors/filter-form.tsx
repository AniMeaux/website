import { Action } from "#core/actions";
import { BaseLink } from "#core/base-link";
import { Filters } from "#core/controllers/filters";
import { ControlledInput } from "#core/form-elements/controlled-input";
import { ToggleInput, ToggleInputList } from "#core/form-elements/toggle-input";
import { Icon } from "#generated/icon";
import {
  SponsorshipCategory,
  SponsorshipCategoryIcon,
} from "#show/sponsors/category";
import {
  SponsorSearchParams,
  SponsorSearchParamsN,
} from "#show/sponsors/search-params";
import { Visibility, VisibilityIcon } from "#show/visibility";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function SponsorFilters() {
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
  const sponsorSearchParams = SponsorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={SponsorSearchParams.keys.categories}
      label="Catégorie de sponsor"
      count={sponsorSearchParams.categories.size}
      hiddenContent={Array.from(sponsorSearchParams.categories).map(
        (category) => (
          <input
            key={category}
            type="hidden"
            name={SponsorSearchParams.keys.categories}
            value={category}
          />
        ),
      )}
    >
      <ToggleInputList>
        {SponsorshipCategory.values.map((category) => (
          <ToggleInput
            key={category}
            type="checkbox"
            label={SponsorshipCategory.translation[category]}
            name={SponsorSearchParams.keys.categories}
            value={category}
            icon={
              <SponsorshipCategoryIcon category={category} variant="light" />
            }
            iconChecked={
              <SponsorshipCategoryIcon category={category} variant="solid" />
            }
            checked={sponsorSearchParams.categories.has(category)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterExhibitor() {
  const [searchParams] = useOptimisticSearchParams();
  const sponsorSearchParams = SponsorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={SponsorSearchParams.keys.exhibitor}
      label="Exposant"
      count={sponsorSearchParams.exhibitor.size}
      hiddenContent={Array.from(sponsorSearchParams.exhibitor).map(
        (exhibitor) => (
          <input
            key={exhibitor}
            type="hidden"
            name={SponsorSearchParams.keys.exhibitor}
            value={exhibitor}
          />
        ),
      )}
    >
      <ToggleInputList>
        {SponsorSearchParamsN.Exhibitor.values.map((exhibitor) => (
          <ToggleInput
            key={exhibitor}
            type="checkbox"
            label={SponsorSearchParamsN.Exhibitor.translation[exhibitor]}
            name={SponsorSearchParams.keys.exhibitor}
            value={exhibitor}
            icon={
              <Icon
                href={SponsorSearchParamsN.Exhibitor.icon[exhibitor].light}
              />
            }
            iconChecked={
              <Icon
                href={SponsorSearchParamsN.Exhibitor.icon[exhibitor].solid}
              />
            }
            checked={sponsorSearchParams.exhibitor.has(exhibitor)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}

function FilterName() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const sponsorSearchParams = SponsorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={SponsorSearchParams.keys.name}
      label="Nom"
      count={sponsorSearchParams.name == null ? 0 : 1}
      hiddenContent={
        sponsorSearchParams.name != null ? (
          <input
            type="hidden"
            name={SponsorSearchParams.keys.name}
            value={sponsorSearchParams.name}
          />
        ) : null
      }
    >
      <ControlledInput
        name={SponsorSearchParams.keys.name}
        value={sponsorSearchParams.name ?? ""}
        rightAdornment={
          sponsorSearchParams.name != null ? (
            <ControlledInput.ActionAdornment
              onClick={() =>
                setSearchParams((searchParams) => {
                  return SponsorSearchParams.set(
                    searchParams,
                    (sponsorSearchParams) => ({
                      ...sponsorSearchParams,
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
  const sponsorSearchParams = SponsorSearchParams.parse(searchParams);

  return (
    <Filters.Filter
      value={SponsorSearchParams.keys.visibility}
      label="Visibilité"
      count={sponsorSearchParams.visibility.size}
      hiddenContent={Array.from(sponsorSearchParams.visibility).map(
        (visibility) => (
          <input
            key={visibility}
            type="hidden"
            name={SponsorSearchParams.keys.visibility}
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
            name={SponsorSearchParams.keys.visibility}
            value={visibility}
            icon={<VisibilityIcon variant="light" visibility={visibility} />}
            iconChecked={
              <VisibilityIcon variant="solid" visibility={visibility} />
            }
            checked={sponsorSearchParams.visibility.has(visibility)}
            onChange={() => {}}
          />
        ))}
      </ToggleInputList>
    </Filters.Filter>
  );
}
