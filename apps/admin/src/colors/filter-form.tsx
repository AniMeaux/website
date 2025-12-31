import {
  COLOR_DEFAULT_SORT,
  ColorSearchParams,
  ColorSort,
} from "#i/colors/search-params";
import { Action } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import { Filters } from "#i/core/controllers/filters";
import { ControlledInput } from "#i/core/form-elements/controlled-input";
import {
  ToggleInput,
  ToggleInputList,
} from "#i/core/form-elements/toggle-input";
import { Icon } from "#i/generated/icon";
import { useOptimisticSearchParams } from "@animeaux/search-params-io";

export function ColorFilterForm() {
  const [searchParams, setSearchParams] = useOptimisticSearchParams();
  const colorSearchParams = ColorSearchParams.parse(searchParams);

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
          value={ColorSearchParams.keys.sort}
          label="Trier"
          count={colorSearchParams.sort === COLOR_DEFAULT_SORT ? 0 : 1}
          hiddenContent={
            colorSearchParams.sort !== COLOR_DEFAULT_SORT ? (
              <input
                type="hidden"
                name={ColorSearchParams.keys.sort}
                value={colorSearchParams.sort}
              />
            ) : null
          }
        >
          <ToggleInputList>
            <ToggleInput
              type="radio"
              label="Alphabétique"
              name={ColorSearchParams.keys.sort}
              value={ColorSort.NAME}
              icon={<Icon href="icon-arrow-down-a-z-solid" />}
              checked={colorSearchParams.sort === ColorSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Nombre d’animaux"
              name={ColorSearchParams.keys.sort}
              value={ColorSort.ANIMAL_COUNT}
              icon={<Icon href="icon-arrow-down-9-1-solid" />}
              checked={colorSearchParams.sort === ColorSort.ANIMAL_COUNT}
              onChange={() => {}}
            />
          </ToggleInputList>
        </Filters.Filter>

        <Filters.Filter
          value={ColorSearchParams.keys.name}
          label="Nom"
          count={colorSearchParams.name == null ? 0 : 1}
          hiddenContent={
            colorSearchParams.name != null ? (
              <input
                type="hidden"
                name={ColorSearchParams.keys.name}
                value={colorSearchParams.name}
              />
            ) : null
          }
        >
          <ControlledInput
            name={ColorSearchParams.keys.name}
            value={colorSearchParams.name ?? ""}
            rightAdornment={
              colorSearchParams.name != null ? (
                <ControlledInput.ActionAdornment
                  onClick={() => {
                    setSearchParams((searchParams) => {
                      return ColorSearchParams.set(
                        searchParams,
                        (colorSearchParams) => ({
                          ...colorSearchParams,
                          name: undefined,
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
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
}
