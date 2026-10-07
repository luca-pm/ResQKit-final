import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../../design";
import styles from "./aiNavigationCard.styles";

export default function AINavigationCard({
  title,
  description,
  buttonLabel,
  onPress,
}) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.88}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>{buttonLabel}</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={25}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
