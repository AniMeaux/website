import {
  AnimalStatus,
  AnimalStatusLabels,
  ANIMAL_STATUSES_ORDER,
} from "@animeaux/shared-entities";
import {
  Selector,
  SelectorCheckbox,
  SelectorItem,
  SelectorLabel,
  Selectors,
} from "@animeaux/ui-library";
import * as React from "react";

type AnimalMultipleStatusInputProps = {
  value?: AnimalStatus[] | null;
  onChange: React.Dispatch<AnimalStatus[]>;
};

export function AnimalMultipleStatusInput({
  value: valueProp,
  onChange,
}: AnimalMultipleStatusInputProps) {
  const value = valueProp ?? [];

  return (
    <Selectors>
      {ANIMAL_STATUSES_ORDER.map((status) => (
        <SelectorItem key={status}>
          <Selector>
            <SelectorCheckbox
              name={`status-${status}`}
              checked={value.includes(status)}
              onChange={(checked) =>
                onChange(
                  checked
                    ? value.concat([status])
                    : value.filter((v) => v !== status)
                )
              }
            />

            <SelectorLabel>{AnimalStatusLabels[status]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}
