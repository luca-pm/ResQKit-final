import {
  StyleSheet,
} from "react-native";

import {
  COLORS,
  SPACING,
} from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  content: {
    paddingHorizontal:
      SPACING.lg,

    paddingTop:
      SPACING.lg,
  },

  subtitle: {
    marginBottom:
      SPACING.md,

    fontSize: 14,

    color:
      COLORS.textSecondary,
  },

  card: {
    paddingVertical: 0,
  },

  languageRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    paddingVertical:
      SPACING.md,
  },

  languageInfo: {
    flex: 1,
  },

  language: {
    fontSize: 16,

    fontWeight: "600",

    color:
      COLORS.text,
  },

  languageCode: {
    marginTop:
      SPACING.xs,

    fontSize: 12,

    color:
      COLORS.textSecondary,
  },

  divider: {
    height: 1,

    backgroundColor:
      COLORS.border,
  },
});