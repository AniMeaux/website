import { useSearchParams } from "@remix-run/react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { parseOrDefault } from "~/core/schemas";

export class PageSearchParams extends URLSearchParams {
  static readonly KEY = "page";
  static readonly DEFAULT_VALUE = 0;

  getPage() {
    return parseOrDefault(
      zfd.numeric(z.number().default(0)),
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
  static readonly Keys = {
    SUCCESS: "success",
  };

  hasConfirmation(action: ActionConfirmationType) {
    return (
      this.get(ActionConfirmationSearchParams.Keys.SUCCESS) === String(action)
    );
  }

  setConfirmation(action: ActionConfirmationType | null) {
    const copy = new ActionConfirmationSearchParams(this);

    if (action != null) {
      copy.set(ActionConfirmationSearchParams.Keys.SUCCESS, String(action));
    } else if (copy.has(ActionConfirmationSearchParams.Keys.SUCCESS)) {
      copy.delete(ActionConfirmationSearchParams.Keys.SUCCESS);
    }

    return copy;
  }
}

export function useActionConfirmation(action: ActionConfirmationType) {
  const [searchParams, setSearchParams] = useSearchParams();
  const actionSearchParams = new ActionConfirmationSearchParams(searchParams);

  return {
    isVisible: actionSearchParams.hasConfirmation(action),
    clear: () => setSearchParams(actionSearchParams.setConfirmation(null)),
  };
}
