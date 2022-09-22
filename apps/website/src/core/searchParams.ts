const PAGE_KEY = "page";

export function getPage(searchParams: URLSearchParams) {
  const page = Number(searchParams.get(PAGE_KEY));
  return isNaN(page) || page < 0 ? 0 : page;
}

export function setPage(searchParams: URLSearchParams, page: number) {
  searchParams.set(PAGE_KEY, String(page));
  return searchParams;
}
