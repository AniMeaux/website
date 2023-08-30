declare global {
  var __singletons: undefined | Record<string, any>;
}

/**
 * Since the dev server re-requires the bundle, do some shenanigans to make
 * certain things persist across that 😆.
 *
 * @param name Unique name to store the singleton
 * @param factory Function invoked to create the instance.
 * @returns The single instance.
 *
 * @see https://github.com/jenseng/abuse-the-platform/blob/2993a7e846c95ace693ce61626fa072174c8d9c7/app/utils/singleton.ts
 */
export function singleton<TValue>(name: string, factory: () => TValue): TValue {
  const yolo = global;
  yolo.__singletons ??= {};
  yolo.__singletons[name] ??= factory();
  return yolo.__singletons[name];
}
