import { useLocation } from "@remix-run/react";

const REFERER_KEY = "_referer";

export function RefererInput() {
  const location = useLocation();
  return <input type="hidden" name={REFERER_KEY} value={location.pathname} />;
}

export function getReferer(formData: FormData) {
  const referer = formData.get(REFERER_KEY);
  if (typeof referer !== "string" || referer === "") {
    return null;
  }

  return referer;
}
