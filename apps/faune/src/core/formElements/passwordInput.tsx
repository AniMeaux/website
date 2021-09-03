import { ActionAdornment } from "core/formElements/adornment";
import { Input, InputProps } from "core/formElements/input";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export function PasswordInput(
  props: Omit<InputProps, "type" | "rightAdornment">
) {
  const [showPassword, setShowPassword] = useState(false);

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
