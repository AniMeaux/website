export type StorageUpgrader<ValueType> = (
  previousValue: any,
  previousVersion: number
) => ValueType;

type StorageContext<ValueType> = {
  name: string;
  version: number;
  upgrader: StorageUpgrader<ValueType>;
};

type StoredValue<ValueType> = {
  version: number;
  value: ValueType;
};

function identity<ValueType>(state: ValueType): ValueType {
  return state;
}

function parse(serializedJSON: string | null): any {
  if (serializedJSON != null) {
    try {
      return JSON.parse(serializedJSON);
    } catch (error) {
      // Ignore parsing error for now.
    }
  }

  return null;
}

function isStoredValue<ValueType>(
  storedValue: any
): storedValue is StoredValue<ValueType> {
  return (
    typeof storedValue === "object" &&
    "version" in storedValue &&
    "value" in storedValue
  );
}

function load<ValueType>({
  name,
  upgrader,
  version,
}: StorageContext<ValueType>) {
  return () => {
    const previousStorage = parse(localStorage.getItem(name));

    if (previousStorage != null && isStoredValue<ValueType>(previousStorage)) {
      return previousStorage.version < version
        ? upgrader(previousStorage.value, previousStorage.version)
        : previousStorage.value;
    }

    return undefined;
  };
}

function save<ValueType>({ name, version }: StorageContext<ValueType>) {
  return (value: ValueType) => {
    const storedValue: StoredValue<ValueType> = { version, value: value };
    localStorage.setItem(name, JSON.stringify(storedValue));
  };
}

function clear<ValueType>({ name }: StorageContext<ValueType>) {
  return () => {
    localStorage.removeItem(name);
  };
}

export function openStorage<ValueType>(
  name: string,
  version: number,
  upgrader: StorageUpgrader<ValueType> = identity
) {
  const context: StorageContext<ValueType> = { name, version, upgrader };

  return {
    load: load(context),
    save: save(context),
    clear: clear(context),
  };
}
