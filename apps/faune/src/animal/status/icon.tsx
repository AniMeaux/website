import { AnimalStatus } from "@animeaux/shared";
import styled from "styled-components";
import { BadgeElement } from "~/animal/status/badge";
import { ANIMAL_STATUS_LABELS } from "~/animal/status/labels";
import { StyleProps } from "~/core/types";

type StatusIconProps = StyleProps & {
  status: AnimalStatus;
};

export function StatusIcon({ status, ...rest }: StatusIconProps) {
  return (
    <IconElement {...rest} $isSmall $status={status}>
      {ANIMAL_STATUS_LABELS[status][0]}
    </IconElement>
  );
}

const IconElement = styled(BadgeElement)`
  width: 16px;
  height: 16px;
  padding: 0;
`;
