export function getShortLocation(location: { city: string; zipCode: string }) {
  return `${location.city} (${location.zipCode.substring(0, 2)})`;
}

export function getLongLocation(location: {
  address: string;
  zipCode: string;
  city: string;
}) {
  return `${location.address}, ${location.zipCode} ${location.city}`;
}

export function getCompleteLocation(location: {
  address: string;
  zipCode: string;
  city: string;
  country: string;
}) {
  return [
    location.address,
    `${location.zipCode} ${location.city}`,
    location.country,
  ].join("\n");
}
