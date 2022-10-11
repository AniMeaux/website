const NEXT_KEY = "next";
const DEFAULT_NEXT = "/";

export function getNext(from: URLSearchParams | FormData) {
  const next = from.get(NEXT_KEY);
  if (typeof next !== "string" || next === "") {
    return DEFAULT_NEXT;
  }

  return next;
}

export function addNext(searchParams: URLSearchParams, next: string) {
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
