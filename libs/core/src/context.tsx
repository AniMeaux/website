import { createContext, useContext, useMemo } from "react";
import invariant from "tiny-invariant";

/**
 * Creates a React Context and return:
 * - A provider component that takes the value as flat props.
 * - A consumer hook that that ensures a provider exist in the ancestors.
 *
 * @param defaultContextValue The context default value.
 * @returns A tuple of the provider component and the consumer hook.
 */
export function createStrictContext<TValue extends object>(
  defaultContextValue?: TValue,
) {
  const Context = createContext<undefined | TValue>(defaultContextValue);

  function StrictContextProvider({
    children,
    ...contextValue
  }: Omit<React.ComponentPropsWithoutRef<typeof Context.Provider>, "value"> &
    TValue) {
    const value = useMemo(
      () => contextValue as TValue,
      // Only re-memoize when prop values change
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(contextValue),
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useStrictContextValue() {
    const context = useContext(Context);

    invariant(
      context != null,
      '"useStrictContextValue" must be used within "StrictContextProvider".',
    );

    return context;
  }

  return [StrictContextProvider, useStrictContextValue] as const;
}

/**
 * Creates a React Context and return a provider component and consumer hook
 * that contains the return value of the given hook function.
 *
 * @param hookFunction The hook function.
 * @param defaultContextValue The context default value.
 * @returns A tuple of the provider component and the consumer hook.
 */
export function createHookContext<TValue extends object, TProps extends object>(
  hookFunction: (props: TProps) => TValue,
  defaultContextValue?: TValue,
) {
  const [StrictContextProvider, useStrictContextValue] =
    createStrictContext<TValue>(defaultContextValue);

  function HookContextProvider({
    children,
    ...props
  }: React.PropsWithChildren<TProps>) {
    const contextValue = hookFunction(props as TProps);

    return (
      <StrictContextProvider {...contextValue}>
        {children}
      </StrictContextProvider>
    );
  }

  return [HookContextProvider, useStrictContextValue] as const;
}
