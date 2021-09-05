import { AnimalStatus, AnimalStatusLabels } from "@animeaux/shared-entities";
import { StyleProps } from "core/types";
import styled, { css } from "styled-components/macro";
import { Styles, theme } from "styles/theme";

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
      {AnimalStatusLabels[status]}
    </BadgeElement>
  );
}

const SMALL_SIZE_BADGE_ELEMENT_STYLES = css`
  padding: ${theme.spacing.x1} ${theme.spacing.x3};
  font-size: 12px;
  line-height: ${theme.typography.lineHeight.monoLine};
`;

const NORMAL_SIZE_BADGE_ELEMENT_STYLES = css`
  padding: ${theme.spacing.x1} ${theme.spacing.x6};
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
  [AnimalStatus.UNAVAILABLE]: css`
    background: ${theme.colors.dark[700]};
    color: ${theme.colors.text.contrast};
  `,
};

const BadgeElement = styled.span<{ $isSmall: boolean; $status: AnimalStatus }>`
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

type StatusIconProps = StyleProps & {
  status: AnimalStatus;
};

export function StatusIcon({ status, ...rest }: StatusIconProps) {
  return (
    <IconElement {...rest} $isSmall $status={status}>
      {AnimalStatusLabels[status][0]}
    </IconElement>
  );
}

const IconElement = styled(BadgeElement)`
  width: 16px;
  height: 16px;
  padding: 0;
`;
