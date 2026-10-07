import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../../design";
import { ROUTES } from "../../../constants/routes";
import styles from "./emergencyAIButton.styles";
import { openScreen } from "../../../utils/navigation";

export default function EmergencyAIButton({ navigation }) {
  return (
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.88}
      onPress={() => openScreen(navigation, ROUTES.AI)}
      accessibilityRole="button"
      accessibilityLabel="ResQ AI"
    >
      <MaterialCommunityIcons
        name="robot-outline"
        size={28}
        color={COLORS.white}
      />
    </TouchableOpacity>
  );
}
