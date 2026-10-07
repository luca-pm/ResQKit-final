import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, RadioButton, Switch } from "react-native-paper";
import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { backendHealth } from "../../services/apiClient";
import { requestPvr, testSessionStream } from "../../services/institutionalService";
import { getSpeechDiagnostics, speakText } from "../../services/ttsService";
import styles from "../emergency/emergencyScreen.styles";

export default function AdvancedSettingsScreen({ navigation }) {
  const { settings, updateSettings, institutionalLog, clearInstitutionalLog, incident } = useApp();
  const { language, locale, pick } = useLocale();
  const [testing, setTesting] = useState(false);

  async function testBackend() {
    setTesting(true);
    try { const result = await backendHealth(); Alert.alert(pick("Backend online", "Backend online"), JSON.stringify(result, null, 2)); }
    catch (error) { Alert.alert(pick("Backend indisponibil", "Backend unavailable"), error.message); }
    finally { setTesting(false); }
  }

  async function testVoiceChannel() {
    if (!incident?.backendSessionId) return Alert.alert(pick("Sesiune necesară", "Session required"), pick("Pornește o sesiune și creează conexiunea backend din ecranul de predare.", "Start a session and create the backend connection from the handoff screen."));
    try { await requestPvr(incident.backendSessionId); await testSessionStream(incident.backendSessionId); Alert.alert(pick("Test reușit", "Test successful"), "PVR + WebSocket ping/pong OK"); }
    catch (error) { Alert.alert(pick("Test eșuat", "Test failed"), error.message); }
  }

  async function testTextToSpeech() {
    const diagnostics = await getSpeechDiagnostics(language);
    void speakText(pick("Acesta este un test pentru citirea cu voce tare în ResQKit.", "This is a text-to-speech test in ResQKit."), { language });
    Alert.alert(
      pick("Test voce pornit", "Voice test started"),
      `${pick("Limbă", "Language")}: ${diagnostics.languageTag}\n${pick("Voci disponibile", "Available voices")}: ${diagnostics.totalVoices}\n${pick("Voci potrivite", "Matching voices")}: ${diagnostics.matchingVoices}`
    );
  }

  const notificationRows = [
    ["push", pick("Notificări", "Notifications")],
    ["urgentAlerts", pick("Alerte urgente", "Urgent alerts")],
    ["expiryReminders", pick("Memento expirare", "Expiry reminders")],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Setări avansate", "Advanced settings")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <View style={styles.row}><View style={styles.flex}><Text style={styles.listTitle}>{pick("Mod date reale / backend instituțional", "Real-data / institutional backend mode")}</Text><Text style={styles.listDescription}>{pick("OFF = acțiunile instituționale rămân simulate local. ON = sesiunea și evenimentele pot fi trimise backend-ului ResQKit. Nu reprezintă o conexiune reală la 112.", "OFF = institutional actions stay simulated locally. ON = the session and events can be sent to the ResQKit backend. This is not a real connection to 112 infrastructure.")}</Text></View><Switch value={settings.realDataMode} onValueChange={(value) => updateSettings({ realDataMode: value })} /></View>
        </PrimaryCard>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Retenție locală implicită", "Default local retention")}</Text>
          <RadioButton.Group value={settings.retention} onValueChange={(value) => updateSettings({ retention: value })}>
            <RadioButton.Item label={pick("Doar sesiunea", "Current session only")} value="session" /><RadioButton.Item label={pick("24 ore", "24 hours")} value="24h" /><RadioButton.Item label={pick("7 zile", "7 days")} value="7d" /><RadioButton.Item label={pick("30 zile", "30 days")} value="30d" />
          </RadioButton.Group>
        </PrimaryCard>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Notificări locale", "Local notifications")}</Text>
          {notificationRows.map(([key, label]) => <View key={key} style={styles.row}><Text style={styles.listTitle}>{label}</Text><Switch value={Boolean(settings.notifications?.[key])} onValueChange={(value) => updateSettings({ notifications: { [key]: value } })} /></View>)}
        </PrimaryCard>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Diagnostic backend și voce", "Backend and voice diagnostics")}</Text>
          <Button mode="outlined" loading={testing} onPress={testBackend}>{pick("Testează backend-ul", "Test backend")}</Button>
          <Button style={{ marginTop: 8 }} mode="outlined" onPress={testVoiceChannel}>{pick("Testează PVR + WebSocket", "Test PVR + WebSocket")}</Button>
          <Button style={{ marginTop: 8 }} mode="outlined" icon="volume-high" onPress={testTextToSpeech}>{pick("Testează citirea cu voce", "Test text-to-speech")}</Button>
        </PrimaryCard>
        <PrimaryCard>
          <View style={styles.row}><Text style={styles.sectionTitle}>{pick("Jurnal instituțional", "Institutional log")}</Text><Button compact onPress={clearInstitutionalLog}>{pick("Șterge", "Clear")}</Button></View>
          {institutionalLog.length === 0 ? <Text style={styles.muted}>{pick("Jurnalul este gol.", "The log is empty.")}</Text> : institutionalLog.slice().reverse().map((entry) => <View key={entry.id} style={styles.listItem}><Text style={styles.listTitle}>{entry.action} · {entry.mode}</Text><Text style={styles.listDescription}>{new Date(entry.at).toLocaleString(locale)} · {entry.ok ? "OK" : pick("EROARE", "ERROR")}</Text><Text style={styles.muted}>{entry.detail}</Text></View>)}
        </PrimaryCard>
      </ScrollView>
    </SafeAreaView>
  );
}
