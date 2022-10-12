import { useSearchParams } from "@remix-run/react";
import { useState } from "react";

const NEXT_KEY = "next";
const DEFAULT_NEXT = "/";

export function getNext(from: URLSearchParams | FormData) {
  const next = from.get(NEXT_KEY);
  if (typeof next !== "string" || next === "") {
    return DEFAULT_NEXT;
  }

  return next;
}

export function setNext(searchParams: URLSearchParams, next: string) {
  if (next !== DEFAULT_NEXT) {
    searchParams.set(NEXT_KEY, next);
  } else if (searchParams.has(NEXT_KEY)) {
    searchParams.delete(NEXT_KEY);
  }

  return searchParams;
}

export function NextParamInput({ value }: { value: string }) {
  return <input type="hidden" name={NEXT_KEY} value={value} />;
}

const ACTION_CONFIRMATION_KEY = "success";

export enum ActionConfirmationType {
  EDIT,
  EDIT_PASSWORD,
}

export function hasActionConfirmation(
  searchParams: URLSearchParams,
  action: ActionConfirmationType
) {
  return searchParams.get(ACTION_CONFIRMATION_KEY) === String(action);
}

export function setActionConfirmation(
  searchParams: URLSearchParams,
  action: ActionConfirmationType | null
) {
  if (action === null) {
    searchParams.delete(ACTION_CONFIRMATION_KEY);
  } else {
    searchParams.set(ACTION_CONFIRMATION_KEY, String(action));
  }

  return searchParams;
}

export function useActionConfirmation(action: ActionConfirmationType) {
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(
    hasActionConfirmation(searchParams, action)
  );

  return { isVisible, clear: () => setIsVisible(false) };
}
