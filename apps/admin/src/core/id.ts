export function generateId() {
  return Math.random().toString(16).slice(2);
}

export function getShortUuid(uuid: string) {
  return uuid.slice(0, uuid.indexOf("-"));
}
