import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  COLORS,
} from "../../../design";

import styles from "./appHeader.styles";

export default function AppHeader({
  title,
  onMenuPress,
  onNotificationPress,
  onProfilePress,
  onClosePress,
  leftIcon = "menu",
  showNotifications = true,
  showProfile = true,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={leftIcon}
            size={28}
            color={COLORS.text}
          />
        </TouchableOpacity>

        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {showNotifications && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              color={COLORS.text}
            />
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onProfilePress}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={30}
              color={COLORS.text}
            />
          </TouchableOpacity>
        )}

        {onClosePress && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onClosePress}
            activeOpacity={0.7}
            accessibilityLabel="Close"
          >
            <MaterialCommunityIcons
              name="close"
              size={26}
              color={COLORS.text}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}