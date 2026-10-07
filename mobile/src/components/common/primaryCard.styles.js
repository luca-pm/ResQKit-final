import { StyleSheet } from "react-native";

import {
  COLORS,
  SHADOWS,
  RADIUS,
} from "../../design";

export default StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,

    borderRadius: RADIUS.lg,

    ...SHADOWS.small,
  },
});