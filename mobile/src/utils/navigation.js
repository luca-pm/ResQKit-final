import { ROUTES } from "../constants/routes";

// Bottom tabs (same set as the zip app: Home / ResQKit AI / History / Account).
export const TAB_ROUTES = [ROUTES.HOME, ROUTES.AI, ROUTES.HISTORY, ROUTES.ACCOUNT_TAB];

function rootOf(navigation) {
  let current = navigation;
  while (current?.getParent?.()) current = current.getParent();
  return current;
}

// Opens a tab or a stack screen from anywhere in the app.
export function openScreen(navigation, name, params) {
  const root = rootOf(navigation);
  if (TAB_ROUTES.includes(name)) root.navigate(ROUTES.HOME, { screen: name, params });
  else root.navigate(name, params);
}
