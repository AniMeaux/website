import cn from "classnames";
import * as React from "react";
import { Button } from "../actions";
import { ChildrenProp, StyleProps } from "../core";
import { ButtonSection } from "../layouts";
import { BaseModal, BaseModalProps, useModal } from "./baseModal";

export function ModalHeader({ className, ...rest }: StyleProps & ChildrenProp) {
  return (
    <header
      {...rest}
      className={cn(
        "sticky top-0 w-full border-b border-gray-100 flex-none px-4 py-2 flex items-center",
        className
      )}
    />
  );
}

type ModalCloseButtonProps = {
  dismissLabel?: string;
};

function ModalCloseButton({ dismissLabel = "Annuler" }: ModalCloseButtonProps) {
  const { onDismiss } = useModal();

  return (
    <ButtonSection>
      <Button variant="outlined" color="default" onClick={() => onDismiss()}>
        {dismissLabel}
      </Button>
    </ButtonSection>
  );
}

function getOverlayClassName(open: boolean): string {
  return cn(
    "z-20 fixed inset-0 overscroll-none cursor-pointer bg-black bg-opacity-20",
    {
      "animate-fade-in": open,
      "animate-fade-out": !open,
    }
  );
}

function getModalClassName(open: boolean): string {
  return cn(
    "z-20 focus:outline-none fixed left-0 bottom-0 right-0 overscroll-none shadow-md rounded-t-3xl max-h-screen bg-white modal-padding",
    {
      "animate-bottom-slide-in": open,
      "animate-bottom-slide-out": !open,
    }
  );
}

export type ModalProps = Omit<
  BaseModalProps,
  "getOverlayClassName" | "getModalClassName"
> &
  ModalCloseButtonProps;

export function Modal({ dismissLabel, children, ...rest }: ModalProps) {
  return (
    <BaseModal
      {...rest}
      getOverlayClassName={getOverlayClassName}
      getModalClassName={getModalClassName}
    >
      {children}
      <ModalCloseButton dismissLabel={dismissLabel} />
    </BaseModal>
  );
}
