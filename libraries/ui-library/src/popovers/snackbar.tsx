import cn from "classnames";
import * as React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Slide, toast, ToastContainer } from "react-toastify";

export function SnackbarContainer() {
  return (
    <ToastContainer
      position="bottom-center"
      transition={Slide}
      hideProgressBar
      closeButton={false}
      limit={1}
      className="z-30 fixed snackbar-bottom left-0 right-0 w-full transform p-2 flex flex-col items-center space-y-2"
      toastClassName="shadow-md m-0 rounded-full max-w-10/12 min-h-0 p-0 font-sans"
      bodyClassName="m-0 max-w-full p-0"
    />
  );
}

type SnackbarType = "error" | "success";

const SnackbarTypeClassName: { [key in SnackbarType]: string } = {
  error: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
};

const SnackbarTypeIcon: { [key in SnackbarType]: React.ElementType } = {
  error: FaTimesCircle,
  success: FaCheckCircle,
};

type SnackbarProps = React.PropsWithChildren<{
  type: SnackbarType;
}>;

export function Snackbar({ type, children }: SnackbarProps) {
  const Icon = SnackbarTypeIcon[type];

  return (
    <div
      className={cn(
        "select-none pr-3 h-8 flex items-center",
        SnackbarTypeClassName[type]
      )}
    >
      <span className="w-8 h-8 flex items-center justify-center">
        <Icon />
      </span>

      <p className="flex-1 min-w-0 truncate font-bold text-xs">{children}</p>
    </div>
  );
}

export const showSnackbar = toast;
