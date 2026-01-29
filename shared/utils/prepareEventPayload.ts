export const prepareEventPayload = <T>(event: string, payload: T) => {
  return JSON.stringify({ event, payload });
};