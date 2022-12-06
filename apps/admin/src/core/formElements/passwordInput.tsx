import { forwardRef, useState } from "react";
import { ActionAdornment } from "~/core/formElements/adornment";
import { Input, InputProps } from "~/core/formElements/input";
import { Icon } from "~/generated/icon";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type" | "rightAdornment" | "spellCheck">
>(function PasswordInput(props, ref) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightAdornment={
        <ActionAdornment
          onClick={() => setShowPassword((showPassword) => !showPassword)}
        >
          <Icon id={showPassword ? "eyeSlash" : "eye"} />
        </ActionAdornment>
      }
      // Prevent Spell-jacking passwords.
      spellCheck="false"
    />
  );
});
