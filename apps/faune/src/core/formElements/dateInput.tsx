import { Adornment } from "core/formElements/adornment";
import { Input as BaseInput } from "core/formElements/input";
import { InputWrapperProps } from "core/formElements/inputWrapper";
import { HtmlInputProps, StyleProps } from "core/types";
import { useRef } from "react";
import styled from "styled-components/macro";
import { theme } from "styles/theme";

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
    <Container>
      <SmallInput
        {...rest}
        id={id}
        name={`${name}-day`}
        value={day}
        onChange={setDay}
        type="text"
        inputMode="numeric"
        placeholder="00"
        hasError={hasError}
        leftAdornment={<Adornment>J</Adornment>}
      />

      <SmallInput
        {...rest}
        name={`${name}-month`}
        value={month}
        onChange={setMonth}
        type="text"
        inputMode="numeric"
        placeholder="00"
        hasError={hasError}
        leftAdornment={<Adornment>M</Adornment>}
        ref={monthRef}
      />

      <LargeInput
        {...rest}
        name={`${name}-year`}
        value={year}
        onChange={setYear}
        type="text"
        inputMode="numeric"
        placeholder="0000"
        hasError={hasError}
        leftAdornment={<Adornment>A</Adornment>}
        ref={yearRef}
      />
    </Container>
  );
}

const Container = styled.span`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.x2};
`;

const SmallInput = styled(BaseInput)`
  flex: 1 1 2ch;
`;

const LargeInput = styled(BaseInput)`
  flex: 1 1 4ch;
`;
