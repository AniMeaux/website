import { UserGroup } from "@animeaux/shared";
import { NextPage } from "next";

export type PageComponent<TProps = {}> = NextPage<TProps> & {
  authorisedGroups?: UserGroup[];
  renderLayout?: (props: TProps & Required<ChildrenProp>) => React.ReactElement;
};

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
  /**
   * Hints at the type of data that might be entered by the user while editing
   * the element or its contents
   * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
   */
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
};

export type A11yProps = {
  title?: string;
};

export type SetStateAction<StateType> = (prevState: StateType) => StateType;
