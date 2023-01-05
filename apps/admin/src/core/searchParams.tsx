import { useLocation, useSearchParams, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { parseOrDefault } from "~/core/schemas";

export function useOptimisticSearchParams() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const transition = useTransition();

  const nextSearchParams = useMemo(() => {
    if (transition.location?.pathname === location.pathname) {
      return new URLSearchParams(transition.location.search);
    }

    return null;
  }, [
    location.pathname,
    transition.location?.pathname,
    transition.location?.search,
  ]);

  return [
    // Optimistic UI.
    nextSearchParams ?? searchParams,
    setSearchParams,
  ] as const;
}

export class PageSearchParams extends URLSearchParams {
  static readonly Keys = {
    PAGE: "page",
  };

  getPage() {
    return parseOrDefault(
      zfd.numeric(z.number().default(0)),
      this.get(PageSearchParams.Keys.PAGE)
    );
  }

  setPage(page: number) {
    const copy = new PageSearchParams(this);

    if (page !== 0) {
      copy.set(PageSearchParams.Keys.PAGE, String(page));
    } else if (copy.has(PageSearchParams.Keys.PAGE)) {
      copy.delete(PageSearchParams.Keys.PAGE);
    }

    return copy;
  }
}

export class NextSearchParams extends URLSearchParams {
  static readonly Keys = {
    NEXT: "next",
  };

  getNext() {
    return parseOrDefault(
      z.string().default("/"),
      this.get(NextSearchParams.Keys.NEXT)
    );
  }

  setNext(next: string) {
    const copy = new NextSearchParams(this);

    if (next !== "/") {
      copy.set(NextSearchParams.Keys.NEXT, next);
    } else if (copy.has(NextSearchParams.Keys.NEXT)) {
      copy.delete(NextSearchParams.Keys.NEXT);
    }

    return copy;
  }
}

export enum ActionConfirmationType {
  CREATE,
  DELETE,
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
