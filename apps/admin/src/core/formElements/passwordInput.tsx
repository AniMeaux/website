import { forwardRef, useState } from "react";
import { Input, InputProps } from "~/core/formElements/input";
import { Icon } from "~/generated/icon";

export const PasswordInput = Object.assign(
  forwardRef<
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
          <Input.ActionAdornment
            onClick={() => setShowPassword((showPassword) => !showPassword)}
          >
            <Icon id={showPassword ? "eyeSlash" : "eye"} />
          </Input.ActionAdornment>
        }
        // Prevent Spell-jacking passwords.
        spellCheck="false"
      />
    );
  }),
  {
    Adornment: Input.Adornment,
    ActionAdornment: Input.ActionAdornment,
  }
);
