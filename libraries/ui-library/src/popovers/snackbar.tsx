import * as React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import invariant from "invariant";
import {
  Slide,
  Zoom,
  toast,
  ToastContainer,
  ToastContainerProps,
  ToastContentProps,
  TypeOptions,
} from "react-toastify";
import {
  ChildrenProp,
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
  ScreenSize,
  useScreenSize,
} from "../core";

export function SnackbarContainer() {
  const { screenSize } = useScreenSize();

  let props: ToastContainerProps = {};

  if (screenSize <= ScreenSize.SMALL) {
    props = {
      position: "bottom-center",
      limit: 1,
      transition: Zoom,
    };
  } else {
    props = {
      position: "bottom-right",
      limit: 5,
      transition: Slide,
    };
  }

  return <ToastContainer {...props} hideProgressBar closeButton={false} />;
}

const SnackbarTypeIcon: { [key in TypeOptions]?: React.ElementType } = {
  error: FaTimesCircle,
  success: FaCheckCircle,
};

type SnackbarProps = ChildrenProp;

export function Snackbar({ children, ...toastContentProps }: SnackbarProps) {
  // Additional props are injected but we don't want them to be part of the
  // public API.
  // See https://fkhadra.github.io/react-toastify/render-what-you-want#basic-example
  const { toastProps } = toastContentProps as ToastContentProps;

  const Icon =
    toastProps.type == null ? null : SnackbarTypeIcon[toastProps.type];

  invariant(
    Icon != null,
    "Only error and success snackbars are supported for now."
  );

  return (
    <Item className="Snackbar">
      <ItemIcon>
        <Icon />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{children}</ItemMainText>
      </ItemContent>
    </Item>
  );
}

export const showSnackbar = toast;
