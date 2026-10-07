import { Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useLocale from "../../hooks/useLocale";
import { getAvailabilityForNode, getKitItemLabel } from "../../data/kitItems";
import { COLORS } from "../../design";
import styles from "./protocolKitHint.styles";

export default function ProtocolKitHint({ nodeId, selected = [] }) {
  const { language, pick } = useLocale();
  const availability = getAvailabilityForNode(nodeId, selected, language);
  if (!availability) return null;

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <MaterialCommunityIcons name="medical-bag" size={18} color={COLORS.primary} />
        <Text style={styles.title}>{pick("Materiale pentru acest pas", "Supplies for this step")}</Text>
      </View>

      {availability.present.length ? (
        <Text style={styles.present}>
          {pick("Disponibil: ", "Available: ")}
          {availability.present.map((code) => getKitItemLabel(code, language)).join(", ")}
        </Text>
      ) : (
        <Text style={styles.missing}>{pick("Nu a fost detectat niciun material relevant pentru acest pas.", "No relevant supply was detected for this step.")}</Text>
      )}

      {availability.missing.length ? (
        <Text style={styles.muted}>
          {pick("Nedetectat: ", "Not detected: ")}
          {availability.missing.map((code) => getKitItemLabel(code, language)).join(", ")}
        </Text>
      ) : null}

      {availability.fallback && availability.missing.length ? (
        <View style={styles.fallbackBox}>
          <Text style={styles.fallback}>{availability.fallback}</Text>
        </View>
      ) : null}
    </View>
  );
}
