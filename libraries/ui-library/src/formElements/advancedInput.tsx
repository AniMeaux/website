import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { StyleProps } from "../core/types";
import { ensureArray } from "../ensureArray";
import { Modal } from "../popovers";
import { Adornment } from "./adornment";
import {
  getInputClassName,
  InputWrapper,
  InputWrapperProps,
} from "./inputWrapper";

type AdvancedInputProps = InputWrapperProps &
  StyleProps & {
    value?: string | null;
    placeholder?: string;
    modalContent: React.ReactElement;
  };

export function AdvancedInput({
  size,
  hasError,
  leftAdornment,
  rightAdornment,
  disabled,
  className,
  value,
  placeholder,
  modalContent,
}: AdvancedInputProps) {
  const [isOpened, setIsOpened] = React.useState(false);

  rightAdornment = [
    ...ensureArray(rightAdornment),
    <Adornment>
      <FaCaretDown />
    </Adornment>,
  ];

  return (
    <>
      <InputWrapper
        size={size}
        disabled={disabled}
        leftAdornment={leftAdornment}
        rightAdornment={rightAdornment}
        hasError={hasError}
        className={className}
      >
        <button
          // Use type button to make sure we don't submit a form.
          type="button"
          onClick={() => setIsOpened(true)}
          className={cn(
            getInputClassName({
              disabled,
              hasError,
              size,
              leftAdornment,
              rightAdornment,
            }),
            "text-left flex items-center"
          )}
        >
          {value ?? (
            <span className="text-black text-opacity-50">{placeholder}</span>
          )}
        </button>
      </InputWrapper>

      <Modal open={isOpened} onDismiss={() => setIsOpened(false)} isFullScreen>
        {modalContent}
      </Modal>
    </>
  );
}
