import { cloneElement, isValidElement } from "react";

/**
 * Create and return a new React Node by concatenating all of the given `nodes`
 * separated by `separator`.
 *
 * @param nodes The React Nodes to join
 * @param separator The separator to insert between each node.
 * @returns a new node
 */
export function joinReactNodes(
  nodes: React.ReactNode[],
  separator: React.ReactElement | string
): React.ReactNode[] {
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
