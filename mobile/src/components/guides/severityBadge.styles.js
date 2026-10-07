import { StyleSheet } from "react-native";

import {
  SPACING,
  RADIUS,
} from "../../design";

export default StyleSheet.create({
  container: {
    alignSelf: "flex-start",

    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,

    borderRadius: RADIUS.round,
  },

  text: {
    fontSize: 11,
    fontWeight: "700",
  },

  low: {
    backgroundColor: "#E8F7ED",
  },

  medium: {
    backgroundColor: "#FFF4D6",
  },

  high: {
    backgroundColor: "#FDE8E8",
  },

  lowText: {
    color: "#237A43",
  },

  mediumText: {
    color: "#A16207",
  },

  highText: {
    color: "#B42318",
  },
});