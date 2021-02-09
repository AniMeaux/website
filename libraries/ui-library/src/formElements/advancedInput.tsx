import cn from "classnames";
import * as React from "react";
import { FaCaretDown } from "react-icons/fa";
import { ensureArray } from "../ensureArray";
import { Modal } from "../popovers";
import { Adornment } from "./adornment";
import { BaseInput, BaseInputProps, getInputClassName } from "./baseInput";

type AdvancedInputProps = BaseInputProps & {
  value?: string | null;
  className?: string;
  placeholder?: string;
  modalContent: React.ReactElement;
};

export function AdvancedInput({
  size,
  errorMessage,
  hasError,
  infoMessage,
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
      <BaseInput
        size={size}
        disabled={disabled}
        leftAdornment={leftAdornment}
        rightAdornment={rightAdornment}
        hasError={hasError}
        errorMessage={errorMessage}
        infoMessage={infoMessage}
        className={className}
      >
        <button
          // Use type button to make sure we don't submit a form.
          type="button"
          onClick={() => setIsOpened(true)}
          className={cn(
            getInputClassName({
              errorMessage,
              hasError,
              size,
              leftAdornment,
              rightAdornment,
            }),
            { "text-black text-opacity-50": value == null },
            "text-left flex items-center"
          )}
        >
          {value ?? placeholder}
        </button>
      </BaseInput>

      <Modal open={isOpened} onDismiss={() => setIsOpened(false)} isFullScreen>
        {modalContent}
      </Modal>
    </>
  );
}
