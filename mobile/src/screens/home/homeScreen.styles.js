import { StyleSheet } from "react-native";

import {
  COLORS,
  SPACING,
} from "../../design";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: SPACING.xxl,
  },

  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
});