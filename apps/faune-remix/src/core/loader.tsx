import { useEffect, useState } from "react";

export function useIsLoading(isLoadingArg: boolean) {
  const [isLoading, setIsLoading] = useState(isLoadingArg);

  useEffect(() => {
    if (isLoadingArg) {
      const timeout = setTimeout(() => setIsLoading(true), 250);
      return () => clearTimeout(timeout);
    }
  }, [isLoadingArg]);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return isLoading;
}

export function Loader() {
  return (
    <span className="h-2 inline-flex items-center gap-1">
      <span className="rounded-[30%] w-0.5 h-0.5 bg-white animate-loader-pulse" />
      <span className="rounded-[30%] w-0.5 h-0.5 bg-white animate-loader-pulse animation-delay-100" />
      <span className="rounded-[30%] w-0.5 h-0.5 bg-white animate-loader-pulse animation-delay-200" />
    </span>
  );
}
