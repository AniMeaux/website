import * as React from "react";
import { FaFilter } from "react-icons/fa";
import { ChildrenProp } from "../core";
import { Badge } from "../dataDisplay";
import { ActionAdornment } from "../formElements";
import { Modal, ModalHeader, ModalHeaderTitle } from "../popovers";
import { Button } from "./button";

type ActionFilterProps = ChildrenProp & {
  inputRef: React.MutableRefObject<HTMLInputElement>;
  activeFilterCount: number;
  clearAllFilters: () => void;
};

export function ActionFilter({
  inputRef,
  activeFilterCount,
  clearAllFilters,
  children,
}: ActionFilterProps) {
  const [areFiltersOpened, setAreFiltersOpened] = React.useState(false);

  return (
    <>
      <ActionAdornment onClick={() => setAreFiltersOpened(true)}>
        <Badge isVisible={activeFilterCount > 0}>
          <FaFilter />
        </Badge>
      </ActionAdornment>

      <Modal
        open={areFiltersOpened}
        onDismiss={() => setAreFiltersOpened(false)}
        dismissLabel="Fermer"
        referenceElement={inputRef}
        matchReferenceWidth
        placement="bottom"
      >
        <ModalHeader>
          <ModalHeaderTitle>Filtres</ModalHeaderTitle>

          <Button
            size="small"
            disabled={activeFilterCount === 0}
            onClick={() => clearAllFilters()}
          >
            Tout effacer
          </Button>
        </ModalHeader>

        {children}
      </Modal>
    </>
  );
}
