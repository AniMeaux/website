import * as React from "react";

export function callSetStateAction<StateType extends {}>(
  setStateAction: React.SetStateAction<StateType>,
  previousState: StateType
) {
  if (typeof setStateAction === "object") {
    return setStateAction;
  }

  return (setStateAction as (prevState: StateType) => StateType)(previousState);
}
