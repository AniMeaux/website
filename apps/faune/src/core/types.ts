export type ChildrenProp = {
  children?: React.ReactNode;
};

export type StyleProps = {
  className?: string;
  style?: React.CSSProperties;
};

export type HtmlInputProps = {
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  type?: "text" | "email" | "password" | "tel" | "number";
  id?: string;
  role?: "search";
};

export type A11yProps = {
  title?: string;
};
