import { useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, RadioButton } from "react-native-paper";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { buildIncidentBrief } from "../../services/briefService";
import { archiveIncident } from "../../services/incidentService";
import { terminateInstitutionalSession } from "../../services/institutionalService";
import { ROUTES } from "../../constants/routes";
import styles from "./emergencyScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function ReviewScreen({ navigation }) {
  const { incident, safetyProfile, settings, updateSettings, closeIncident, isLoggedIn, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const [archiving, setArchiving] = useState(false);
  const [archived, setArchived] = useState(false);
  const retention = [
    { value: "session", label: pick("Doar sesiunea curentă", "Current session only") },
    { value: "24h", label: pick("24 de ore", "24 hours") },
    { value: "7d", label: pick("7 zile", "7 days") },
    { value: "30d", label: pick("30 de zile", "30 days") },
  ];

  async function archive() {
    if (!incident) return;
    if (!isLoggedIn) return Alert.alert(pick("Autentificare necesară", "Sign-in required"), pick("Arhivarea în cont necesită autentificare. Sesiunea poate rămâne local conform retenției alese.", "Archiving to the account requires sign-in. The session can remain local according to the selected retention period."));
    setArchiving(true);
    try {
      const brief = buildIncidentBrief(incident, safetyProfile, Boolean(incident.includeHealthData), language);
      await archiveIncident(incident, brief, settings.retention);
      setArchived(true);
      Alert.alert(pick("Arhivat", "Archived"), pick("Incidentul a fost salvat în contul backend.", "The incident was saved to the backend account."));
    } catch (error) { Alert.alert(pick("Arhivare eșuată", "Archive failed"), error.message); }
    finally { setArchiving(false); }
  }

  async function finish() {
    if (incident?.backendSessionId && settings.realDataMode) {
      try {
        await terminateInstitutionalSession(incident.backendSessionId);
        logInstitutional({ action: "session.terminate", mode: "real", detail: pick(`Sesiunea ${incident.backendSessionId} a fost încheiată`, `Session ${incident.backendSessionId} was closed`), ok: true });
      } catch {}
    }
    await closeIncident();
    navigation.reset({ index: 0, routes: [{ name: isLoggedIn ? ROUTES.HOME : ROUTES.LOGIN }] });
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Încheiere sesiune", "End session")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{pick("Sesiune încheiată", "Session complete")}</Text>
        <Text style={styles.subtitle}>{pick("Alege cât timp vrei să păstrezi copia locală. Arhivarea în cont este o acțiune separată.", "Choose how long to keep the local copy. Archiving to your account is a separate action.")}</Text>
        <PrimaryCard style={{ marginTop: 24, marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Retenție locală", "Local retention")}</Text>
          <RadioButton.Group value={settings.retention} onValueChange={(value) => updateSettings({ retention: value })}>
            {retention.map((option) => <RadioButton.Item key={option.value} label={option.label} value={option.value} />)}
          </RadioButton.Group>
        </PrimaryCard>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Arhivare în cont", "Account archive")}</Text>
          <Text style={styles.muted}>{archived ? pick("Incidentul este arhivat în backend.", "The incident is archived in the backend.") : pick("Opțional. Datele sunt trimise numai când alegi explicit această acțiune.", "Optional. Data are sent only when you explicitly choose this action.")}</Text>
          <Button style={{ marginTop: 12 }} mode="outlined" loading={archiving} disabled={archived || archiving} onPress={archive}>{archived ? pick("Arhivat", "Archived") : pick("Arhivează în cont", "Archive to account")}</Button>
        </PrimaryCard>
        <Button mode="contained" onPress={finish}>{pick("Închide sesiunea și revino Acasă", "Close session and return Home")}</Button>
        <Button style={{ marginTop: 8 }} mode="text" onPress={() => openScreen(navigation, ROUTES.HISTORY)}>{pick("Deschide istoricul", "Open history")}</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
