import { View, Text } from "react-native";

export default function Logo() {
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 40,
        marginBottom: 30,
      }}
    >
      <Text style={{ fontSize: 36 }}>🩺</Text>

      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          marginTop: 10,
        }}
      >
        ResQKit
      </Text>
    </View>
  );
}