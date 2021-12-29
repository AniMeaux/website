import { RawCheckbox, RawCheckboxProps } from "core/formElements/checkbox";
import { RawRadio, RawRadioProps } from "core/formElements/radio";
import { ChildrenProp, StyleProps } from "core/types";
import { Children, isValidElement } from "react";
import styled, { css } from "styled-components/macro";
import { theme } from "styles/theme";

export type SelectorsProps = ChildrenProp &
  StyleProps & {
    isStretched?: boolean;
  };

export function Selectors({ isStretched = false, ...rest }: SelectorsProps) {
  return <SelectorsElement {...rest} $isStretched={isStretched} />;
}

const SelectorsElement = styled.ul<{ $isStretched: boolean }>`
  flex: ${(props) => (props.$isStretched ? "1" : "initial")};
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(${theme.spacing.x2} * -1);
  margin-left: calc(${theme.spacing.x2} * -1);
`;

export type SelectorItemProps = ChildrenProp & StyleProps;
export function SelectorItem(props: SelectorItemProps) {
  return <SelectorItemElement {...props} />;
}

const SelectorItemElement = styled.li`
  padding-top: calc(${theme.spacing.x2} * 1);
  padding-left: calc(${theme.spacing.x2} * 1);
  max-width: 100%;
`;

export type SelectorProps = ChildrenProp & StyleProps;
export function Selector({ children, ...rest }: SelectorProps) {
  const checked = Children.toArray(children).some(
    (child) => isValidElement(child) && child.props.checked
  );

  return <SelectorElement {...rest} children={children} $isChecked={checked} />;
}

const SelectorElement = styled.label<{ $isChecked: boolean }>`
  position: relative;
  padding: ${theme.spacing.x2} ${theme.spacing.x4};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$isChecked ? "inherit" : theme.colors.text.secondary};
  background: ${(props) =>
    props.$isChecked ? theme.colors.dark[30] : "transparent"};

  @media (hover: hover) {
    &:hover {
      background: ${(props) =>
        props.$isChecked ? theme.colors.dark[50] : theme.colors.dark[30]};
      color: inherit;
    }
  }

  &:active {
    background: ${(props) =>
      props.$isChecked ? theme.colors.dark[100] : theme.colors.dark[50]};
  }
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

export type SelectorRadioProps = RawRadioProps;
export function SelectorRadio(props: SelectorRadioProps) {
  return <SelectorRadioElement {...props} />;
}

const SelectorRadioElement = styled(RawRadio)`
  ${SELECTOR_INPUT_STYLES};
`;

export type SelectorCheckboxProps = RawCheckboxProps;
export function SelectorCheckbox(props: SelectorCheckboxProps) {
  return <SelectorCheckboxElement {...props} />;
}

const SelectorCheckboxElement = styled(RawCheckbox)`
  ${SELECTOR_INPUT_STYLES};
`;

export type SelectorIconProps = ChildrenProp & StyleProps;
export function SelectorIcon(props: SelectorIconProps) {
  return <SelectorIconElement {...props} />;
}

const SelectorIconElement = styled.span`
  margin-right: ${theme.spacing.x2};
  flex: none;
`;

export type SelectorLabelProps = ChildrenProp & StyleProps;
export function SelectorLabel(props: SelectorLabelProps) {
  return <SelectorLabelElement {...props} />;
}

const SelectorLabelElement = styled.span`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
