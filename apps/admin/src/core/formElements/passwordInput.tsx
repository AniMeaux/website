import { Input } from "#core/formElements/input.tsx";
import { Icon } from "#generated/icon.tsx";
import { forwardRef, useState } from "react";

export const PasswordInput = Object.assign(
  forwardRef<
    React.ComponentRef<typeof Input>,
    Omit<
      React.ComponentPropsWithoutRef<typeof Input>,
      "type" | "rightAdornment" | "spellCheck"
    >
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
  },
);
