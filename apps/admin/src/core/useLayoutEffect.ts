import { useEffect, useLayoutEffect as useUnsafeLayoutEffect } from "react";

export const useLayoutEffect =
  typeof document === "undefined" ? useEffect : useUnsafeLayoutEffect;
