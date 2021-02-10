import * as React from "react";
import { FaFilter } from "react-icons/fa";
import { Badge } from "./badge";
import { Button } from "./button";
import { ChildrenProp } from "./core/types";
import { HeaderTitle } from "./layouts";
import { Modal, ModalHeader } from "./popovers";

type ActionFilterProps = ChildrenProp & {
  actionElement: React.ElementType;
  activeFilterCount: number;
  clearAllFilters: () => void;
};

export function ActionFilter({
  actionElement: Action,
  activeFilterCount,
  clearAllFilters,
  children,
}: ActionFilterProps) {
  const [areFiltersOpened, setAreFiltersOpened] = React.useState(false);

  return (
    <>
      <Action onClick={() => setAreFiltersOpened(true)}>
        <Badge isVisible={activeFilterCount > 0}>
          <FaFilter />
        </Badge>
      </Action>

      <Modal
        open={areFiltersOpened}
        onDismiss={() => setAreFiltersOpened(false)}
      >
        <ModalHeader>
          <HeaderTitle align="left" className="pl-4">
            Filtres
          </HeaderTitle>

          <Button
            size="small"
            variant="outlined"
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
