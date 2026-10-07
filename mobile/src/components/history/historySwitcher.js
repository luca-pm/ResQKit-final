import { Pressable, Text, View } from "react-native";
import useLocale from "../../hooks/useLocale";
import styles from "./historySwitcher.styles";

export default function HistorySwitcher({ selected, onChange }) {
  const { pick } = useLocale();
  const options = [
    { id: "interventions", label: pick("Intervenții", "Interventions") },
    { id: "operators", label: pick("Date trimise", "Sent data") },
    { id: "ai", label: pick("Conversații AI", "AI chats") },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = selected === option.id;
        return (
          <Pressable key={option.id} style={[styles.button, active && styles.active]} onPress={() => onChange(option.id)}>
            <Text numberOfLines={2} style={[styles.text, active && styles.activeText]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
