/**
 * Remove `key` from props object because it should be passed as first prop.
 *
 * React warn about this: "Warning: A props object containing a "key" prop is
 * being spread into JSX. React keys must be passed directly to JSX without
 * using spread".
 *
 * @see https://github.com/facebook/react/pull/25697
 * @see https://github.com/edmundhung/conform/releases/tag/v1.2.0
 */
export function withoutKey<TObject extends Record<string, any>>({
  key,
  ...props
}: TObject): Omit<TObject, "key"> {
  return { ...props };
}
