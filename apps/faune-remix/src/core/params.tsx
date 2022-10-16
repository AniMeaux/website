import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { z } from "zod";
import { parseOrDefault } from "~/core/schemas";

export class PageSearchParams extends URLSearchParams {
  static readonly KEY = "page";
  static readonly DEFAULT_VALUE = 0;

  getPage() {
    return parseOrDefault(
      z.number().default(0),
      this.get(PageSearchParams.KEY)
    );
  }

  setPage(page: number) {
    const copy = new PageSearchParams(this);

    if (page !== PageSearchParams.DEFAULT_VALUE) {
      copy.set(PageSearchParams.KEY, String(page));
    } else if (copy.has(PageSearchParams.KEY)) {
      copy.delete(PageSearchParams.KEY);
    }

    return copy;
  }
}

export class NextSearchParams extends URLSearchParams {
  static readonly KEY = "next";
  static readonly DEFAULT_VALUE = "/";

  getNext() {
    return parseOrDefault(
      z.string().default("/"),
      this.get(NextSearchParams.KEY)
    );
  }

  setNext(next: string) {
    const copy = new NextSearchParams(this);

    if (next !== NextSearchParams.DEFAULT_VALUE) {
      copy.set(NextSearchParams.KEY, next);
    } else if (copy.has(NextSearchParams.KEY)) {
      copy.delete(NextSearchParams.KEY);
    }

    return copy;
  }
}

export enum ActionConfirmationType {
  EDIT,
  EDIT_PASSWORD,
}

export class ActionConfirmationSearchParams extends URLSearchParams {
  static readonly KEY = "success";

  hasConfirmation(action: ActionConfirmationType) {
    return this.get(ActionConfirmationSearchParams.KEY) === String(action);
  }

  setConfirmation(action: ActionConfirmationType) {
    const copy = new ActionConfirmationSearchParams(this);
    copy.set(ActionConfirmationSearchParams.KEY, String(action));
    return copy;
  }
}

export function useActionConfirmation(action: ActionConfirmationType) {
  const [searchParams] = useSearchParams();
  const [isVisible, setIsVisible] = useState(() =>
    new ActionConfirmationSearchParams(searchParams).hasConfirmation(action)
  );

  return { isVisible, clear: () => setIsVisible(false) };
}
