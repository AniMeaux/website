import type { NavLinkProps } from "@remix-run/react";
import { useLocation, useNavigation, useResolvedPath } from "@remix-run/react";
import {
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { UNSAFE_NavigationContext } from "react-router";

/**
 * Return either a local state or a provided one.
 *
 * @param initialState The initial local state.
 * @param propState The state value from props.
 * @param propSetState The set state function from props.
 * @returns A tuple of state value and set state function.
 */
export function useStateOrProp<
  TState,
  TStateAction extends
    React.SetStateAction<TState> = React.SetStateAction<TState>,
>(
  initialState: TState | (() => TState),
  propState?: TState,
  propSetState?: React.Dispatch<TStateAction>,
): [TState, React.Dispatch<TStateAction>] {
  const localState = useState(initialState);

  if (propState == null || propSetState == null) {
    return localState;
  }

  return [propState, propSetState];
}

/**
 * Return either a local id or a provided one.
 *
 * @param propId The id from props.
 * @returns An id.
 */
export function useIdOrProp(propId?: string) {
  const localId = useId();
  return propId ?? localId;
}

export function useIsMounted() {
  const isMounted = useRef(true);

  useEffect(() => {
    // Reset it for strict mode.
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

/**
 * Return either a local Ref object or the provided one.
 *
 * @param propRef The provided Ref object.
 * @returns A Ref object.
 */
export function useRefOrProp<TElement>(propRef: React.ForwardedRef<TElement>) {
  const localRef = useRef<TElement>(null);
  return useComposedRefs([propRef, localRef]);
}

/**
 * Return a composed Ref object for the provided ones.
 *
 * @param handlers The provided Ref handlers.
 * @returns A Ref object.
 */
export function useComposedRefs<TElement>(handlers: RefHandler<TElement>[]) {
  return useMemo(
    () => composeRefs(handlers),
    // Only re-memoize when handlers values change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handlers,
  );
}

function composeRefs<TElement>(
  handlers: RefHandler<TElement>[],
): React.MutableRefObject<null | TElement> {
  let element: null | TElement = null;

  return {
    get current() {
      return element;
    },

    set current(value) {
      setRefs(value, handlers);
      element = value;
    },
  };
}

function setRefs<TElement>(
  element: null | TElement,
  handlers: RefHandler<TElement>[],
) {
  handlers.forEach((handler) => {
    // Ingore falsy handlers to allow syntaxes like:
    //
    // ```js
    // const child = React.Children.only(this.props.children)
    // return React.cloneElement(child, {
    //   ref: ref => setRefs(ref, [this.myRef, child.ref])
    // })
    // ```
    if (handler) {
      switch (typeof handler) {
        case "function": {
          handler(element);
          break;
        }

        case "object": {
          handler.current = element;
          break;
        }

        default:
          throw new Error(
            `Only refs of type function and React.createRef() are supported. Got ${typeof handler}.`,
          );
      }
    }
  });
}

type RefHandler<TElement> =
  | React.RefCallback<null | TElement>
  | React.MutableRefObject<null | TElement>
  | undefined
  | null;

/**
 * Create and return a new React Node by concatenating all of the given `nodes`
 * separated by `separator`.
 *
 * @param nodes The React Nodes to join.
 * @param separator The separator to insert between each node.
 * @returns A new node.
 */
export function joinReactNodes(
  nodes: React.ReactNode[],
  separator: string | React.ReactElement,
) {
  const separatorElement = isValidElement(separator) ? (
    separator
  ) : (
    <>{separator}</>
  );

  return nodes.reduce<React.ReactNode[]>((nodes, node, index) => {
    if (nodes.length > 0) {
      nodes.push(cloneElement(separatorElement, { key: `separator-${index}` }));
    }

    nodes.push(node);
    return nodes;
  }, []);
}

type BooleanAttribute = undefined | boolean | "true" | "false";

export function toBooleanAttribute(condition: boolean): BooleanAttribute {
  return condition ? "true" : undefined;
}

/**
 * Calls the factory or returns the new object.
 *
 * @param factory Either the object or a function creating the object.
 * @param getParams Function that returns the factory params. Only called when
 * `factory` is a function.
 * @returns The object.
 */
export function callFactory<
  // Don't allow functions.
  TData extends undefined | null | string | number | boolean | Object,
  TParams,
>(factory: TData | ((args: TParams) => TData), getParams: () => TParams) {
  if (typeof factory === "function") {
    // Without the cast, the return type is `any`.
    return factory(getParams()) as TData;
  }

  return factory;
}

/**
 * Hook version of `NavLink` so it can be used outside of the component.
 *
 * @param to
 * @see https://github.com/remix-run/react-router/blob/react-router%406.14.2/packages/react-router-dom/index.tsx#L624
 */
export function useNavLink(
  props: Pick<NavLinkProps, "caseSensitive" | "end" | "relative" | "to">,
) {
  const path = useResolvedPath(props.to, { relative: props.relative });
  const location = useLocation();
  const navigation = useNavigation();
  const { navigator } = useContext(UNSAFE_NavigationContext);

  let toPathname = navigator.encodeLocation
    ? navigator.encodeLocation(path).pathname
    : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = navigation.location?.pathname ?? null;

  if (!props.caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname
      ? nextLocationPathname.toLowerCase()
      : null;
    toPathname = toPathname.toLowerCase();
  }

  const isActive =
    locationPathname === toPathname ||
    (!props.end &&
      locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.length) === "/");

  const isPending =
    nextLocationPathname != null &&
    (nextLocationPathname === toPathname ||
      (!props.end &&
        nextLocationPathname.startsWith(toPathname) &&
        nextLocationPathname.charAt(toPathname.length) === "/"));

  return { isActive, isPending };
}
