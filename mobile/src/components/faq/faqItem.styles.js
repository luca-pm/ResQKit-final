import { StyleSheet } from "react-native";

import {
  COLORS,
  RADIUS,
  SPACING,
} from "../../design";

export default StyleSheet.create({
  card: {
    marginBottom:
      SPACING.md,

    borderWidth: 1,

    borderColor:
      COLORS.border,

    borderRadius:
      RADIUS.lg,

    backgroundColor:
      COLORS.white,

    overflow: "hidden",
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    padding:
      SPACING.md,
  },

  question: {
    flex: 1,

    marginRight:
      SPACING.md,

    fontSize: 15,

    lineHeight: 21,

    fontWeight: "700",

    color:
      COLORS.text,
  },

  answerContainer: {
    paddingHorizontal:
      SPACING.md,

    paddingBottom:
      SPACING.md,

    borderTopWidth: 1,

    borderTopColor:
      COLORS.border,
  },

  answer: {
    paddingTop:
      SPACING.md,

    fontSize: 14,

    lineHeight: 21,

    color:
      COLORS.textSecondary,
  },
});