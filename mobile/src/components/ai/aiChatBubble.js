import { View, Text } from "react-native";

import styles from "./aiChatBubble.styles";

export default function AIChatBubble({
  role,
  message,
}) {
  const isUser = role === "user";

  return (
    <View
      style={[
        styles.row,
        isUser
          ? styles.userRow
          : styles.aiRow,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? styles.userBubble
            : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.message,
            isUser
              ? styles.userText
              : styles.aiText,
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}