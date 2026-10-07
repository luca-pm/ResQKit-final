import { StyleSheet } from "react-native";
import { COLORS, RADIUS, SPACING, FONTS } from "../../design";
export default StyleSheet.create({
  container: { marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  row: { flexDirection: "row", alignItems: "center", marginBottom: SPACING.md },
  pulse: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", backgroundColor: "#FDE8E8", marginRight: SPACING.md },
  textWrap: { flex: 1 },
  title: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  subtitle: { marginTop: 3, color: COLORS.textSecondary },
  count: { fontSize: 28, fontFamily: FONTS.display, fontWeight: "normal", color: COLORS.primary },
  note: { marginTop: SPACING.sm, fontSize: 12, lineHeight: 18, color: COLORS.textSecondary },
});
