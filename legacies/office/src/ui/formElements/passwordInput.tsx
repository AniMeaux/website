import * as React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ActionAdornment } from "./adornment";
import { Input, InputProps } from "./input";

export function PasswordInput(props: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      rightAdornment={
        <ActionAdornment onClick={() => setShowPassword((s) => !s)}>
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </ActionAdornment>
      }
    />
  );
}
