import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

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
