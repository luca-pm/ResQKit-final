import { StyleSheet } from "react-native";

import { COLORS,
  SPACING, FONTS } from "../../../design";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },

  menu: {
    width: "72%",
    height: "100%",

    backgroundColor: COLORS.white,

    paddingTop: 55,
    paddingHorizontal: SPACING.lg,
  },

  backdrop: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.30)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuTitle: {
    fontSize: 22,
    fontFamily: FONTS.display, fontWeight: "normal",

    color: COLORS.text,
  },

  closeButton: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",
  },

  titleDivider: {
    height: 3,

    backgroundColor: COLORS.text,

    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },

  menuItem: {
    minHeight: 50,

    flexDirection: "row",
    alignItems: "center",
  },

  menuItemPressed: {
    opacity: 0.55,
  },

  bullet: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: "#A5ADBA",

    marginRight: SPACING.md,
  },

  menuItemText: {
    flex: 1,

    fontSize: 18,
    fontWeight: "500",

    color: COLORS.text,
  },

  divider: {
    height: 1,

    backgroundColor: COLORS.border,

    marginVertical: SPACING.md,
  },
});