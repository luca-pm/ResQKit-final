import {
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { ROUTES } from "../../../constants/routes";
import useLocale from "../../../hooks/useLocale";
import { openScreen } from "../../../utils/navigation";

import styles from "./sideMenu.styles";

export default function SideMenu({
  visible,
  onClose,
  navigation,
}) {
  const { pick } = useLocale();
  function go(name, params) {
    onClose();
    setTimeout(() => openScreen(navigation, name, params), 150);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.menu}>
          <View style={styles.header}>
            <Text style={styles.menuTitle}>
              {pick("MENIU", "MENU")}
            </Text>

            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={10}
            >
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={34}
              />
            </Pressable>
          </View>

          <View
            style={styles.titleDivider}
          />

          <MenuItem
            title={pick("Acasă", "Home")}
            onPress={() =>
              go(
                ROUTES.HOME
              )
            }
          />

          <MenuItem
            title={pick("Începe intervenția", "Start intervention")}
            onPress={() =>
              go(
                ROUTES.INCIDENT_START
              )
            }
          />

          <MenuItem
            title={pick("Istoric intervenții", "Intervention history")}
            onPress={() =>
              go(
                ROUTES.HISTORY
              )
            }
          />

          <MenuItem
            title={pick("Materiale video", "First-aid guides")}
            onPress={() =>
              go(
                ROUTES.GUIDES,
                {
                  guideType:
                    "wounds",
                }
              )
            }
          />

          <MenuItem
            title={pick("Tutoriale", "Tutorials")}
            onPress={() =>
              go(
                ROUTES.GUIDES,
                {
                  guideType:
                    "app",
                }
              )
            }
          />

          <View
            style={styles.divider}
          />

          <MenuItem
            title={pick("Cont", "Account")}
            onPress={() =>
              go(
                ROUTES.ACCOUNT
              )
            }
          />

          <MenuItem
            title={pick("Setări", "Settings")}
            onPress={() =>
              go(
                ROUTES.SETTINGS
              )
            }
          />

          <View
            style={styles.divider}
          />

          <MenuItem
            title="FAQ"
            onPress={() =>
              go(
                ROUTES.FAQ
              )
            }
          />

          <MenuItem
            title="Contact"
            onPress={() =>
              go(
                ROUTES.CONTACT
              )
            }
          />
        </View>

        <Pressable
          style={styles.backdrop}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
}

function MenuItem({
  title,
  onPress,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,

        pressed &&
          styles.menuItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.bullet} />

      <Text
        style={styles.menuItemText}
      >
        {title}
      </Text>
    </Pressable>
  );
}