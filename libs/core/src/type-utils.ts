/**
 * Similar to `Extract` but ensures the extracted types exists in the parent
 * type.
 */
export type Extends<TParent, TChild extends TParent> = TChild;
