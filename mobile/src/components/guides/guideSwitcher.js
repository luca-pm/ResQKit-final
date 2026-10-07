import { View, Pressable, Text } from "react-native";
import { useTranslation } from "react-i18next";

import styles from "./guideSwitcher.styles";

export default function GuideTypeSwitcher({
  selected,
  onChange,
}) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.button,
          selected === "wounds" && styles.active,
        ]}
        onPress={() => onChange("wounds")}
      >
        <Text
          style={[
            styles.text,
            selected === "wounds" && styles.activeText,
          ]}
        >
          {t("guides.woundGuides")}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          selected === "app" && styles.active,
        ]}
        onPress={() => onChange("app")}
      >
        <Text
          style={[
            styles.text,
            selected === "app" && styles.activeText,
          ]}
        >
          {t("guides.appGuides")}
        </Text>
      </Pressable>
    </View>
  );
}