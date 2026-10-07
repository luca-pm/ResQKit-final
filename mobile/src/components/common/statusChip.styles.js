import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
  RADIUS,
} from "../../design";

export default StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,

    borderRadius: RADIUS.round,
  },

  connected: {
    backgroundColor: "#E7F7ED",
  },

  disconnected: {
    backgroundColor: "#F3F4F6",
  },

  dot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    marginRight: 6,
  },

  connectedDot: {
    backgroundColor: "#2E9D57",
  },

  disconnectedDot: {
    backgroundColor: "#e3311a",
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
  },

  connectedText: {
    color: "#237A43",
  },

  disconnectedText: {
    color: COLORS.textSecondary,
  },
});