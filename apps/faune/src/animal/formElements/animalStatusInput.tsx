import {
  AnimalStatus,
  AnimalStatusLabels,
  ANIMAL_STATUSES_ORDER,
} from "@animeaux/shared-entities";
import {
  Selector,
  SelectorItem,
  SelectorLabel,
  SelectorRadio,
  Selectors,
} from "core/formElements/selector";

type AnimalStatusInputProps = {
  value?: AnimalStatus | null;
  onChange: React.Dispatch<AnimalStatus>;
};

export function AnimalStatusInput({ value, onChange }: AnimalStatusInputProps) {
  return (
    <Selectors>
      {ANIMAL_STATUSES_ORDER.map((status) => (
        <SelectorItem key={status}>
          <Selector>
            <SelectorRadio
              name="status"
              checked={value === status}
              onChange={() => onChange(status)}
            />

            <SelectorLabel>{AnimalStatusLabels[status]}</SelectorLabel>
          </Selector>
        </SelectorItem>
      ))}
    </Selectors>
  );
}
