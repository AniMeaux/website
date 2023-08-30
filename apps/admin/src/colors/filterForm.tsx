import {
  COLOR_DEFAULT_SORT,
  ColorSearchParams,
  ColorSort,
} from "#colors/searchParams.ts";
import { Action } from "#core/actions.tsx";
import { BaseLink } from "#core/baseLink.tsx";
import { Filters } from "#core/controllers/filters.tsx";
import { ControlledInput } from "#core/formElements/controlledInput.tsx";
import {
  ToggleInput,
  ToggleInputList,
} from "#core/formElements/toggleInput.tsx";
import { Icon } from "#generated/icon.tsx";
import { useOptimisticSearchParams } from "@animeaux/form-data";

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
              icon={<Icon id="arrowDownAZ" />}
              checked={colorSearchParams.sort === ColorSort.NAME}
              onChange={() => {}}
            />

            <ToggleInput
              type="radio"
              label="Nombre d’animaux"
              name={ColorSearchParams.keys.sort}
              value={ColorSort.ANIMAL_COUNT}
              icon={<Icon id="arrowDown91" />}
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
                      const copy = new URLSearchParams(searchParams);
                      ColorSearchParams.set(copy, { name: undefined });
                      return copy;
                    });
                  }}
                >
                  <Icon id="xMark" />
                </ControlledInput.ActionAdornment>
              ) : null
            }
          />
        </Filters.Filter>
      </Filters.Content>
    </Filters>
  );
}
