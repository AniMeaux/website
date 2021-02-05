import * as React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ActionAdornment } from "./adornment";
import { Input, InputProps } from "./input";

export function PasswordInput(props: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const previousFocusOwner = React.useRef<HTMLElement | null>(null);
  const inputElement = React.useRef<HTMLInputElement>(null!);

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      rightAdornment={
        <ActionAdornment
          onFocus={(event) => {
            // Get the element which just lost the focus.
            previousFocusOwner.current = event.relatedTarget as HTMLElement;
          }}
          onClick={() => {
            setShowPassword((s) => !s);

            // Give the focus back to the input to avoid loosing the keyboard
            // on mobile apps
            if (previousFocusOwner.current === inputElement.current) {
              inputElement.current.focus();
            }
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </ActionAdornment>
      }
      refProp={inputElement}
    />
  );
}
