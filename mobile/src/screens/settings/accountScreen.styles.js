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
    paddingBottom:
      SPACING.xxxl,
  },

  card: {
    marginHorizontal:
      SPACING.lg,

    marginTop:
      SPACING.lg,
  },

  input: {
    marginBottom:
      SPACING.md,
  },

  button: {
    marginHorizontal:
      SPACING.lg,

    marginTop:
      SPACING.lg,
  },

  savedText: {
    marginTop:
      SPACING.md,

    textAlign:
      "center",

    fontSize: 14,

    fontWeight:
      "600",

    color:
      COLORS.success,
  },
});