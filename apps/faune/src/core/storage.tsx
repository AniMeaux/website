type StoredValue<ValueType> = {
  version: number;
  value: ValueType;
};

type StorageUpgrader<ValueType> = (
  previousValue: ValueType,
  previousVersion: number
) => ValueType | undefined;

export class Storage<ValueType> {
  private name: string;
  private version: number;
  private upgrader: StorageUpgrader<ValueType>;

  constructor(
    name: string,
    version: number,
    upgrader: StorageUpgrader<ValueType> = identity
  ) {
    this.name = name;
    this.version = version;
    this.upgrader = upgrader;
  }

  load() {
    const previousStorage = parse(localStorage.getItem(this.name));

    if (previousStorage != null && isStoredValue<ValueType>(previousStorage)) {
      return previousStorage.version < this.version
        ? this.upgrader(previousStorage.value, previousStorage.version)
        : previousStorage.value;
    }

    return undefined;
  }

  save(value: ValueType) {
    const storedValue: StoredValue<ValueType> = {
      version: this.version,
      value,
    };

    localStorage.setItem(this.name, JSON.stringify(storedValue));
  }

  clear() {
    localStorage.removeItem(this.name);
  }
}

function identity<ValueType>(value: ValueType): ValueType {
  return value;
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
    typeof storedValue.version === "number" &&
    "value" in storedValue
  );
}
