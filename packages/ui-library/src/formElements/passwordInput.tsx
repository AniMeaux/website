import * as React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ActionAdornment } from "./adornment";
import { Input, InputProps } from "./input";

export function PasswordInput(props: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputElement = React.useRef<HTMLInputElement>(null!);

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      rightAdornment={
        <ActionAdornment
          onClick={() => {
            setShowPassword((s) => !s);

            // Give the focus {back} to the input to avoid loosing the keyboard
            // on mobile apps
            inputElement.current.focus();
          }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </ActionAdornment>
      }
      refProp={inputElement}
    />
  );
}
