import { useEffect, useRef, useState } from "react";
import { useRouter } from "~/core/router";

type ChangeListener = () => void;

export abstract class BaseSearchParams {
  protected searchParams: URLSearchParams;
  protected nonFilterKeys: string[] = [];
  private listeners: ChangeListener[] = [];
  private lastDispatchedHref: string;

  constructor() {
    this.searchParams = new URLSearchParams(window.location.search);
    this.lastDispatchedHref = this.toHref();
  }

  updateSelf() {
    this.searchParams = new URLSearchParams(window.location.search);
    this.dispatchChange();
  }

  private dispatchChange() {
    const currentHref = this.toHref();

    if (currentHref !== this.lastDispatchedHref) {
      this.lastDispatchedHref = currentHref;
      this.listeners.forEach((listener) => listener());
    }
  }

  registerOnChange(listener: ChangeListener) {
    this.listeners = this.listeners.concat(listener);
    return () => {
      this.listeners = this.listeners.filter((other) => other !== listener);
    };
  }

  set(name: string, value: string) {
    if (value === "") {
      this.searchParams.delete(name);
    } else {
      this.searchParams.set(name, value);
    }

    this.dispatchChange();
    return this;
  }

  setAll(name: string, value: string[]) {
    this.searchParams.delete(name);
    value.forEach((value) => this.searchParams.append(name, value));
    this.dispatchChange();
    return this;
  }

  get(name: string) {
    return this.searchParams.get(name);
  }

  getAll(name: string) {
    return this.searchParams.getAll(name);
  }

  delete(name: string) {
    this.searchParams.delete(name);
    this.dispatchChange();
    return this;
  }

  deleteAllFilters() {
    Array.from(this.searchParams.keys()).forEach((key) => {
      if (!this.nonFilterKeys.includes(key)) {
        this.searchParams.delete(key);
      }
    });

    this.dispatchChange();
    return this;
  }

  toHref() {
    this.searchParams.sort();
    const asString = this.searchParams.toString();
    return asString === "" ? "" : `?${asString}`;
  }

  getFilterCount() {
    return 0;
  }
}

export function useSearchParams<TSearchParams extends BaseSearchParams>(
  factory: () => TSearchParams
) {
  const [searchParams] = useState(factory);
  useEffect(() => {
    searchParams.updateSelf();
  });

  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => {
    routerRef.current = router;
  });

  useEffect(() => {
    return searchParams.registerOnChange(() => {
      routerRef.current.replace(searchParams.toHref());
    });
  }, [searchParams]);

  return searchParams;
}
