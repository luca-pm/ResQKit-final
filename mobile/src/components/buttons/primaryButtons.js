import { Button } from "react-native-paper";

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      contentStyle={{
        height: 56,
      }}
      style={{
        borderRadius: 12,
      }}
      labelStyle={{
        fontSize: 18,
        fontWeight: "600",
      }}
    >
      {title}
    </Button>
  );
}