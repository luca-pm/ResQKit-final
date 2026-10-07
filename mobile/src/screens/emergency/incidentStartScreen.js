import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./emergencyScreen.styles";

export default function IncidentStartScreen({ navigation }) {
  const { incident, startIncident, discardIncident, online } = useApp();
  const { locale, pick } = useLocale();

  function beginNew() {
    if (incident) {
      Alert.alert(
        pick("Există deja o sesiune activă", "An active session already exists"),
        pick("Dacă începi una nouă, sesiunea activă va fi înlocuită.", "If you start a new one, the active session will be replaced."),
        [
          { text: pick("Anulează", "Cancel"), style: "cancel" },
          { text: pick("Începe una nouă", "Start a new one"), style: "destructive", onPress: () => { discardIncident(); startIncident(); navigation.navigate(ROUTES.CALL_112_GATE); } },
        ]
      );
      return;
    }
    startIncident();
    navigation.navigate(ROUTES.CALL_112_GATE);
  }

  function continueIncident() {
    if (incident?.called112 !== "called" && incident?.called112 !== "already_called") {
      return navigation.navigate(ROUTES.CALL_112_GATE);
    }
    const active = incident?.victims?.find((v) => v.id === incident.activeVictimId) || incident?.victims?.[0];
    if (active?.protocolNodeId && active.status !== "done") return navigation.navigate(ROUTES.PROTOCOL);
    return navigation.navigate(ROUTES.VICTIMS);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Intervenție", "Intervention")} navigation={navigation} showMenu={false} showNotifications={false} />
      {!online ? <View style={styles.offline}><Text style={styles.offlineText}>{pick("Ești offline. Protocoalele fixe și sesiunile locale rămân disponibile.", "You are offline. Fixed protocols and local sessions remain available.")}</Text></View> : null}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}><MaterialCommunityIcons name="car-emergency" size={44} color={COLORS.primary} /></View>
          <Text style={styles.title}>{pick("A avut loc un accident?", "Has an accident happened?")}</Text>
          <Text style={styles.subtitle}>{pick("Te ghidăm pas cu pas. Respiră și urmează ecranele.", "We will guide you step by step. Stay calm and follow the screens.")}</Text>
        </View>

        {incident ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>{pick("Sesiune activă", "Active session")}</Text>
            <Text style={styles.muted}>{pick("Pornită la", "Started at")} {new Date(incident.startedAt).toLocaleString(locale)} · {incident.victims?.length || 1} {pick("victimă(e)", "person(s)")}</Text>
            <View style={styles.actions}>
              <Button mode="contained" icon="play" onPress={continueIncident}>{pick("Continuă sesiunea", "Continue session")}</Button>
              <Button mode="outlined" onPress={beginNew}>{pick("Începe altă sesiune", "Start another session")}</Button>
            </View>
          </View>
        ) : (
          <Button mode="contained" icon="arrow-right" contentStyle={{ height: 56 }} onPress={beginNew}>{pick("Începe evaluarea", "Start assessment")}</Button>
        )}

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{pick("Într-o urgență, anunță 112 înainte sau concomitent cu acordarea primului ajutor și urmează indicațiile dispeceratului.", "In an emergency, call 112 before or while giving first aid and follow the dispatcher's instructions.")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
