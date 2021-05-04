export function withConfirmation<EventType>(
  confirmationMessage: string,
  handler: (event: EventType) => void
) {
  return (event: EventType) => {
    if (window.confirm(confirmationMessage)) {
      handler(event);
    }
  };
}
