import { AnimalStatus } from "@animeaux/shared";
import { ANIMAL_STATUS_LABELS } from "~/animal/status/labels";
import {
  Selector,
  SelectorCheckbox,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "~/core/formElements/selector";
import { SetStateAction } from "~/core/types";

type AnimalStatusInputProps = {
  value?: AnimalStatus | null;
  onChange: React.Dispatch<AnimalStatus>;
};

export function AnimalStatusInput({ value, onChange }: AnimalStatusInputProps) {
  return (
    <Selectors>
      {Object.values(AnimalStatus).map((status) => (
        <SelectorItem key={status}>
          <Selector>
            <SelectorRadio
              name="status"
              checked={value === status}
              onChange={() => onChange(status)}
            />

            <SelectorLabel>{ANIMAL_STATUS_LABELS[status]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}

type AnimalMultipleStatusInputProps = {
  value?: AnimalStatus[] | null;
  onChange: React.Dispatch<SetStateAction<AnimalStatus[]>>;
};

export function AnimalMultipleStatusInput({
  value: valueProp,
  onChange,
}: AnimalMultipleStatusInputProps) {
  // Default parameter value isn't used for `null`.
  const value = valueProp ?? [];

  return (
    <Selectors>
      {Object.values(AnimalStatus).map((status) => (
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

            <SelectorLabel>{ANIMAL_STATUS_LABELS[status]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}
