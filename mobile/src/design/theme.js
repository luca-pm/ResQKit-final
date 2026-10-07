import { MD3LightTheme } from "react-native-paper";

import { COLORS } from "./colors";

export const theme = {
  ...MD3LightTheme,

  roundness: 12,

  colors: {
    ...MD3LightTheme.colors,

    primary: COLORS.primary,
    secondary: COLORS.primary,

    background: COLORS.background,
    surface: COLORS.surface,

    outline: COLORS.border,

    error: COLORS.destructive,

    onPrimary: COLORS.white,
    onSurface: COLORS.text,
  },
};