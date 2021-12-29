import {
  Item,
  ItemContent,
  ItemIcon,
  ItemMainText,
} from "core/dataDisplay/item";
import { ScreenSize, useScreenSize } from "core/screenSize";
import { ChildrenProp } from "core/types";
import invariant from "invariant";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import {
  Slide,
  toast,
  ToastContainer,
  ToastContainerProps,
  ToastContentProps,
  TypeOptions,
  Zoom,
} from "react-toastify";
import styled, { createGlobalStyle } from "styled-components/macro";
import { theme } from "styles/theme";

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

  return (
    <>
      <GlobalToastStyles />
      <ToastContainer {...props} hideProgressBar closeButton={false} />
    </>
  );
}

const SnackbarTypeIcon: Partial<Record<TypeOptions, React.ElementType>> = {
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
    <SnackbarItem>
      <ItemIcon>
        <Icon />
      </ItemIcon>

      <ItemContent>
        <ItemMainText>{children}</ItemMainText>
      </ItemContent>
    </SnackbarItem>
  );
}

const SnackbarItem = styled(Item)`
  padding: ${theme.spacing.x3} ${theme.spacing.x4};
  font-weight: 500;
`;

export const showSnackbar = toast;

const GlobalToastStyles = createGlobalStyle`
  .Toastify__toast-container {
    z-index: ${theme.zIndex.snackbar};
    position: fixed;
    padding: ${theme.spacing.x2};
  }

  @media (max-width: 499px) {
    .Toastify__toast-container {
      width: 100%;
    }
  }

  @media (min-width: 500px) {
    .Toastify__toast-container {
      max-width: 350px;
      min-width: 200px;
    }
  }

  .Toastify__toast-container--bottom-center {
    bottom: ${theme.components.bottomNavHeight};
    bottom: calc(${theme.components.bottomNavHeight} + env(safe-area-inset-bottom, 0));
  }

  .Toastify__toast-container--bottom-right {
    bottom: ${theme.components.bottomNavHeight};
    bottom: calc(${theme.components.bottomNavHeight} + env(safe-area-inset-bottom, 0));
    right: 0;
    right: env(safe-area-inset-right, 0);
  }

  .Toastify__toast {
    margin: 0;
    min-height: initial;
    padding: 0;
    box-shadow: ${theme.shadow.m};
    border-radius: ${theme.borderRadius.m};
    font-family: inherit;
    cursor: pointer;
  }

  .Toastify__toast--success {
    background: ${theme.colors.success[500]};
    color: ${theme.colors.text.contrast};
    color: ${theme.colors.text.contrast};
  }

  .Toastify__toast--error {
    background: ${theme.colors.alert[500]};
    color: ${theme.colors.text.contrast}
  }

  .Toastify__toast-body {
    margin: 0;
    flex: 1;
    max-width: 100%;
    min-width: 0;
    padding: 0;
  }


  .Toastify--animate {
    animation-fill-mode: forwards;
    animation-duration: ${theme.animation.duration.slow};
  }

  .Toastify__zoom-enter {
    animation-name: ${theme.animation.fadeIn}, ${theme.animation.scaleIn};
    animation-timing-function: ${theme.animation.ease.enter};
  }

  .Toastify__zoom-exit {
    animation-name: ${theme.animation.fadeOut}, ${theme.animation.scaleOut};
    animation-timing-function: ${theme.animation.ease.exit};
  }

  .Toastify__slide-enter--bottom-right {
    animation-name: ${theme.animation.fadeIn}, ${theme.animation.rightSlideIn};
    animation-timing-function: ${theme.animation.ease.enter};
  }

  .Toastify__slide-exit--bottom-right {
    animation-name: ${theme.animation.fadeOut}, ${theme.animation.rightSlideOut};
    animation-timing-function: ${theme.animation.ease.exit};
  }
`;
