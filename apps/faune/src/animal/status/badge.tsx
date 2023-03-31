import { AnimalStatus } from "@animeaux/shared";
import styled, { css } from "styled-components";
import { ANIMAL_STATUS_LABELS } from "~/animal/status/labels";
import { StyleProps } from "~/core/types";
import { Styles, theme } from "~/styles/theme";

type StatusBadgeProps = StyleProps & {
  status: AnimalStatus;
  isSmall?: boolean;
};

export function StatusBadge({
  status,
  isSmall = false,
  ...rest
}: StatusBadgeProps) {
  return (
    <BadgeElement {...rest} $isSmall={isSmall} $status={status}>
      {ANIMAL_STATUS_LABELS[status]}
    </BadgeElement>
  );
}

const SMALL_SIZE_BADGE_ELEMENT_STYLES = css`
  padding: ${theme.spacing.x1} ${theme.spacing.x3};
  font-size: 12px;
`;

const NORMAL_SIZE_BADGE_ELEMENT_STYLES = css`
  padding: ${theme.spacing.x1} ${theme.spacing.x6};
  line-height: ${theme.typography.lineHeight.multiLine};
`;

const BADGE_ELEMENT_STATUS_STYLES: Record<AnimalStatus, Styles> = {
  [AnimalStatus.ADOPTED]: css`
    background: ${theme.colors.success[500]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.DECEASED]: css`
    background: ${theme.colors.dark[700]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.FREE]: css`
    background: ${theme.colors.dark[700]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.LOST]: css`
    background: ${theme.colors.red[500]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.OPEN_TO_ADOPTION]: css`
    background: ${theme.colors.primary[500]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.OPEN_TO_RESERVATION]: css`
    background: ${theme.colors.primary[500]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.RESERVED]: css`
    background: ${theme.colors.warning[500]};
  `,
  [AnimalStatus.RETIRED]: css`
    background: ${theme.colors.dark[700]};
    color: ${theme.colors.text.contrast};
  `,
  [AnimalStatus.UNAVAILABLE]: css`
    background: ${theme.colors.red[500]};
    color: ${theme.colors.text.contrast};
  `,
};

export const BadgeElement = styled.span<{
  $isSmall: boolean;
  $status: AnimalStatus;
}>`
  ${(props) => BADGE_ELEMENT_STATUS_STYLES[props.$status]};
  ${(props) =>
    props.$isSmall
      ? SMALL_SIZE_BADGE_ELEMENT_STYLES
      : NORMAL_SIZE_BADGE_ELEMENT_STYLES};
  font-family: ${theme.typography.fontFamily.title};
  font-weight: 700;
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
`;
