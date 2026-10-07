// Palette aligned with the zip app (app/mobile/src/global.css), keeping this
// app's own red. Red (error) is reserved for 112 / critical UI only; generic
// delete/remove and form errors use the neutral `destructive` slate.
export const COLORS = {
  primary: "#0F7C90",
  primaryDark: "#0A6676",
  primaryLight: "#9ED2D8",

  secondary: "#257E78",
  accent: "#E6F4EB",
  accentForeground: "#1C4A2B",

  background: "#F7FAFB",
  surface: "#F8FBFC",

  text: "#102637",
  textSecondary: "#576875",

  border: "#D1D9E0",

  success: "#18B37B",
  warning: "#F59F0A",
  warningForeground: "#342214",
  error: "#E74C3C",
  destructive: "#415362",

  // Pastel badge pairs (zip's tone="pastel").
  primaryTint: "#DBF6FB",
  primaryTintForeground: "#0F5D6B",
  secondaryTint: "#DFF6F4",
  secondaryTintForeground: "#165A55",
  emergencyTint: "#FDE7E9",
  emergencyTintForeground: "#8F141D",
  warningTint: "#FDEFD8",
  warningTintForeground: "#794715",
  destructiveTint: "#E0E6EB",
  destructiveTintForeground: "#304150",

  white: "#FFFFFF",
  black: "#000000",
};
