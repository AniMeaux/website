import { RawCheckbox } from "core/formElements/checkbox";
import { RawRadio } from "core/formElements/radio";
import { ChildrenProp, StyleProps } from "core/types";
import { Children, isValidElement } from "react";
import styled, { css } from "styled-components";
import { theme } from "styles/theme";

export const Selectors = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing.x2};
`;

export const SelectorItem = styled.li`
  max-width: 100%;
`;

type SelectorProps = ChildrenProp & StyleProps;

export function Selector({ children, ...rest }: SelectorProps) {
  const checked = Children.toArray(children).some(
    (child) => isValidElement(child) && child.props.checked
  );

  return <SelectorElement {...rest} children={children} $isChecked={checked} />;
}

const SELECTOR_CHECKED_STYLES = css`
  border: 1px solid ${theme.colors.primary[50]};
  background: ${theme.colors.primary[50]};

  @media (hover: hover) {
    &:hover {
      background: ${theme.colors.primary[100]};
      border-color: ${theme.colors.primary[100]};
    }
  }

  &:active {
    background: ${theme.colors.primary[200]};
    border-color: ${theme.colors.primary[200]};
  }
`;

const SelectorElement = styled.label<{ $isChecked: boolean }>`
  position: relative;
  padding: ${theme.spacing.x2} ${theme.spacing.x4};
  border-radius: ${theme.borderRadius.l};
  border: 1px solid ${theme.colors.dark[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.x2};

  @media (hover: hover) {
    &:hover {
      background: ${theme.colors.dark[30]};
    }
  }

  &:active {
    background: ${theme.colors.dark[50]};
  }

  ${(props) => (props.$isChecked ? SELECTOR_CHECKED_STYLES : null)};
`;

const SELECTOR_INPUT_STYLES = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: ${theme.borderRadius.full};
  appearance: none;
`;

export const SelectorRadio = styled(RawRadio)`
  ${SELECTOR_INPUT_STYLES};
`;

export const SelectorCheckbox = styled(RawCheckbox)`
  ${SELECTOR_INPUT_STYLES};
`;

export const SelectorIcon = styled.span`
  flex: none;
  display: flex;
  align-items: center;
`;

export const SelectorLabel = styled.span`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: ${theme.typography.lineHeight.multiLine};
`;
