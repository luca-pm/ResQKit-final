import { ROUTES } from "../constants/routes";

// Scene-wide steps (safety reminder, kit) run once per incident; every later
// victim goes straight to their protocol.
export function goToProtocolStage(navigation, incident) {
  if (!incident?.safetyAcknowledgedAt) return navigation.navigate(ROUTES.SAFETY);
  if (!incident?.kitReviewedAt) return navigation.navigate(ROUTES.KIT_PREPARATION, { nextRoute: ROUTES.PROTOCOL });
  return navigation.navigate(ROUTES.PROTOCOL);
}

export function getActiveVictim(incident) {
  return incident?.victims?.find((v) => v.id === incident.activeVictimId) || incident?.victims?.[0];
}
