import { Appbar } from "react-native-paper";

export default function Header({
  title,
  showBack = false,
  onBack,
  rightIcon,
  onRightPress,
}) {
  return (
    <Appbar.Header>

      {showBack && (
        <Appbar.BackAction onPress={onBack} />
      )}

      <Appbar.Content title={title} />

      {rightIcon && (
        <Appbar.Action
          icon={rightIcon}
          onPress={onRightPress}
        />
      )}

    </Appbar.Header>
  );
}