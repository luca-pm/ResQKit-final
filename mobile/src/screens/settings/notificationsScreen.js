import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { COLORS } from "../../design";
import styles from "./notificationsScreen.styles";

function NotificationItem({ icon, title, description, tone = "default" }) {
  const iconColor =
    tone === "warning"
      ? COLORS.warning
      : tone === "success"
        ? COLORS.success
        : COLORS.primary;

  return (
    <PrimaryCard style={styles.notificationCard}>
      <View style={styles.notificationRow}>
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={iconColor}
          />
        </View>

        <View style={styles.notificationBody}>
          <Text style={styles.notificationTitle}>{title}</Text>
          <Text style={styles.notificationDescription}>{description}</Text>
        </View>
      </View>
    </PrimaryCard>
  );
}

export default function NotificationsScreen({ navigation }) {
  const { incident } = useApp();
  const { pick } = useLocale();

  const notifications = [];

  if (incident) {
    notifications.push({
      id: "active-incident",
      icon: "alert-circle-outline",
      title: pick("Intervenție activă", "Active intervention"),
      description: pick(
        "Ai o sesiune de intervenție salvată. O poți continua din ecranul Acasă.",
        "You have a saved intervention session. You can continue it from Home."
      ),
      tone: "warning",
    });
  }


  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader
        title={pick("Notificări", "Notifications")}
        navigation={navigation}
        showMenu={false}
        showNotifications={false}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <NotificationItem key={item.id} {...item} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <MaterialCommunityIcons
                name="bell-check-outline"
                size={42}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              {pick("Ești la zi", "You're all caught up")}
            </Text>

            <Text style={styles.emptyDescription}>
              {pick(
                "Nu ai notificări noi în acest moment.",
                "You don't have any new notifications right now."
              )}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
