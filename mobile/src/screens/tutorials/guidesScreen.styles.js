import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xxxl + 56,
  },
});
