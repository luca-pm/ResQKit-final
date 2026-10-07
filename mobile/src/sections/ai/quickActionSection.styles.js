import { StyleSheet } from "react-native";

import { COLORS,
  SPACING, FONTS } from "../../design";

export default StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
  },

  title: {
    marginBottom: SPACING.md,

    fontSize: 18,
    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.text,
  },
});