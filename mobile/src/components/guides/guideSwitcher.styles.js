import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "../../design";

export default StyleSheet.create({

  container: {

    flexDirection: "row",

    marginHorizontal: SPACING.lg,

    marginTop: SPACING.md,

    marginBottom: SPACING.md,

  },

  button: {

    flex: 1,

    paddingVertical: 14,

    borderRadius: RADIUS.md,

    backgroundColor: COLORS.surface,

    alignItems: "center",

    marginHorizontal: 4,

  },

  active: {

    backgroundColor: COLORS.primary,

  },

  text: {

    fontWeight: "600",

    color: COLORS.text,

  },

  activeText: {

    color: COLORS.white,

  },

});