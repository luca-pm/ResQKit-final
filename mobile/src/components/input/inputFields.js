import { TextInput } from "react-native-paper";

export default function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = true,
  left,
  right,
  error = false,
  maxLength,
}) {
  return (
    <TextInput
      mode="outlined"
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      left={left}
      right={right}
      error={error}
      maxLength={maxLength}
    />
  );
}