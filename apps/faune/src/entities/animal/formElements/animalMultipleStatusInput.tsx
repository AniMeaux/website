import {
  AnimalStatus,
  AnimalStatusLabels,
  ANIMAL_STATUSES_ORDER,
} from "@animeaux/shared-entities";
import * as React from "react";
import {
  Selector,
  SelectorCheckbox,
  SelectorItem,
  SelectorLabel,
  Selectors,
} from "ui/formElements/selector";

type AnimalMultipleStatusInputProps = {
  value?: AnimalStatus[] | null;
  onChange: React.Dispatch<React.SetStateAction<AnimalStatus[]>>;
};

export function AnimalMultipleStatusInput({
  value: valueProp,
  onChange,
}: AnimalMultipleStatusInputProps) {
  // Default parameter value isn't used for `null`.
  const value = valueProp ?? [];

  return (
    <Selectors>
      {ANIMAL_STATUSES_ORDER.map((status) => (
        <SelectorItem key={status}>
          <Selector>
            <SelectorCheckbox
              name={`status-${status}`}
              checked={value.includes(status)}
              onChange={() =>
                onChange((selectedStatus) =>
                  selectedStatus.includes(status)
                    ? value.filter((v) => v !== status)
                    : value.concat([status])
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
