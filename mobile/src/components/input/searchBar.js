import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Pressable, TextInput, View } from "react-native";

import useLocale from "../../hooks/useLocale";
import { COLORS } from "../../design";
import styles from "./searchBar.styles";

export default function SearchBar({
  value,
  onChangeText,
  placeholder,
  onSubmit,
}) {
  const { pick } = useLocale();

  const resolvedPlaceholder =
    placeholder ||
    pick(
      "Caută ghiduri de prim ajutor...",
      "Search first-aid guides..."
    );

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="magnify"
        size={21}
        color={COLORS.textSecondary}
      />

      <TextInput
        style={styles.input}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        onSubmitEditing={onSubmit}
      />

      {value?.length > 0 && (
        <Pressable
          style={styles.clearButton}
          onPress={() => onChangeText("")}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name="close-circle"
            size={19}
            color={COLORS.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}
