import Constants from "expo-constants";

// The IP the phone used to reach Metro (e.g. "192.168.1.20:8081" -> "192.168.1.20").
// That's the dev PC, so local servers (server.mjs, API) are reachable on it too.
function getDevHost() {
  const hostUri = Constants.expoConfig?.hostUri || Constants.expoGoConfig?.debuggerHost;
  const host = hostUri?.split(":")[0];
  // Tunnel hosts (*.exp.direct) only forward Metro, not our other ports.
  if (!host || host.endsWith(".exp.direct")) return "127.0.0.1";
  return host;
}

export function resolveServiceUrl(envUrl, port, path = "") {
  const url = envUrl || `http://${getDevHost()}:${port}${path}`;
  return url.replace(/\/$/, "");
}
