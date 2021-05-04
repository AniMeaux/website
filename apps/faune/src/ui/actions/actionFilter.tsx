import { ChildrenProp } from "core/types";
import * as React from "react";
import { FaFilter } from "react-icons/fa";
import { Button } from "ui/actions/button";
import { Badge } from "ui/dataDisplay/badge";
import { ActionAdornment } from "ui/formElements/adornment";
import { Modal, ModalHeader, ModalHeaderTitle } from "ui/popovers/modal";

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
