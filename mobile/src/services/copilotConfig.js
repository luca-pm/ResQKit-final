import { resolveServiceUrl } from "./devHost";

export const COPILOT_RUNTIME_URL = resolveServiceUrl(
  process.env.EXPO_PUBLIC_COPILOT_RUNTIME_URL,
  8200,
  "/api/copilotkit"
);
