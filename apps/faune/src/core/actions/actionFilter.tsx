import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Badge } from "~/core/dataDisplay/badge";
import { ActionAdornment } from "~/core/formElements/adornment";
import { Modal } from "~/core/popovers/modal";
import { ChildrenProp } from "~/core/types";

type ActionFilterProps = ChildrenProp & {
  inputRef: React.MutableRefObject<HTMLInputElement>;
  hasFilters: boolean;
};

export function ActionFilter({
  inputRef,
  hasFilters,
  children,
}: ActionFilterProps) {
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);

  return (
    <>
      <ActionAdornment onClick={() => setAreFiltersOpened(true)}>
        <Badge isVisible={hasFilters}>
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
        {children}
      </Modal>
    </>
  );
}
