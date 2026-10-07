import { StyleSheet } from "react-native";
import { COLORS, SHADOWS, SPACING } from "../../../design";

export default StyleSheet.create({
  button: {
    position: "absolute",
    right: SPACING.lg,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    zIndex: 30,
    elevation: 8,
    ...SHADOWS.medium,
  },
});
