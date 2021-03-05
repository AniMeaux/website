import cn from "classnames";
import * as React from "react";
import { HtmlInputProps, StyleProps } from "../core";
import { Adornment } from "./adornment";
import { Input } from "./input";
import { InputWrapperProps } from "./inputWrapper";

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

  const monthRef = React.useRef<HTMLInputElement>(null!);
  const yearRef = React.useRef<HTMLInputElement>(null!);

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
    <span className={cn("flex items-center space-x-2", className)}>
      <Input
        {...rest}
        id={id}
        name={`${name}-day`}
        value={day}
        onChange={setDay}
        type="number"
        placeholder="00"
        hasError={hasError}
        leftAdornment={
          <Adornment className="font-serif font-bold">J</Adornment>
        }
        className="date-input-day"
      />

      <Input
        {...rest}
        name={`${name}-month`}
        value={month}
        onChange={setMonth}
        type="number"
        placeholder="00"
        hasError={hasError}
        leftAdornment={
          <Adornment className="font-serif font-bold">M</Adornment>
        }
        ref={monthRef}
        className="date-input-month"
      />

      <Input
        {...rest}
        name={`${name}-year`}
        value={year}
        onChange={setYear}
        type="number"
        placeholder="0000"
        hasError={hasError}
        leftAdornment={
          <Adornment className="font-serif font-bold">A</Adornment>
        }
        ref={yearRef}
        className="date-input-year"
      />
    </span>
  );
}
