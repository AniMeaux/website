/**
 * Date objects are automatically serialized to ISO format by Remix but not
 * automatically parsed client side. To avoid having to manually serialize them
 * server side, this type utility maps `Date` to `string` to match this
 * behavior.
 */
export type MapDateToString<Type extends object> = {
  [Property in keyof Type]: Type[Property] extends Date
    ? string
    : Type[Property] extends object
    ? MapDateToString<Type[Property]>
    : Type[Property];
};
