import cn from "classnames";
import { HtmlInputProps, StyleProps } from "core/types";
import { useRef } from "react";
import { Adornment } from "ui/formElements/adornment";
import { Input } from "ui/formElements/input";
import { InputWrapperProps } from "ui/formElements/inputWrapper";

function formatDate(day: string, month: string, year: string) {
  return [year, month, day].join("-");
}

type DateInputProps = Omit<
  InputWrapperProps,
  "leftAdornment" | "rightAdornment"
> &
  Omit<HtmlInputProps, "placeholder" | "type"> &
  StyleProps & {
    value?: string;
    onChange?: (value: string) => void;
  };

export function DateInput({
  value,
  onChange,
  id,
  name = "",
  hasError,
  className,
  ...rest
}: DateInputProps) {
  const [year = "", month = "", day = ""] = (value ?? "").split("-");

  const monthRef = useRef<HTMLInputElement>(null!);
  const yearRef = useRef<HTMLInputElement>(null!);

  function setDay(day: string) {
    if (day.length <= 2) {
      onChange?.(formatDate(day, month, year));

      // We only want to focus the next input if it is empty.
      if (day.length === 2 && month === "") {
        monthRef.current.focus();
      }
    }
  }

  function setMonth(month: string) {
    if (month.length <= 2) {
      onChange?.(formatDate(day, month, year));

      // We only want to focus the next input if it is empty.
      if (month.length === 2 && year === "") {
        yearRef.current.focus();
      }
    }
  }

  function setYear(year: string) {
    if (year.length <= 4) {
      onChange?.(formatDate(day, month, year));
    }
  }

  return (
    <span className={cn("DateInput", className)}>
      <Input
        {...rest}
        id={id}
        name={`${name}-day`}
        value={day}
        onChange={setDay}
        type="number"
        placeholder="00"
        hasError={hasError}
        leftAdornment={<Adornment>J</Adornment>}
        className="DateInput__day"
      />

      <Input
        {...rest}
        name={`${name}-month`}
        value={month}
        onChange={setMonth}
        type="number"
        placeholder="00"
        hasError={hasError}
        leftAdornment={<Adornment>M</Adornment>}
        ref={monthRef}
        className="DateInput__month"
      />

      <Input
        {...rest}
        name={`${name}-year`}
        value={year}
        onChange={setYear}
        type="number"
        placeholder="0000"
        hasError={hasError}
        leftAdornment={<Adornment>A</Adornment>}
        ref={yearRef}
        className="DateInput__year"
      />
    </span>
  );
}
