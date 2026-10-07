import { useMemo, useState } from "react";
import { Alert, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { buildIncidentBrief } from "../../services/briefService";
import { generateCEIM } from "../../services/ceimService";
import { buildEdxlSitrep, buildNgProtocol } from "../../services/institutionalService";
import { ROUTES } from "../../constants/routes";
import styles from "./emergencyScreen.styles";

export default function ReportScreen({ navigation, route }) {
  const fromGuide = Boolean(route?.params?.fromGuide);
  const { incident, safetyProfile, updateIncident, settings, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const [loading, setLoading] = useState(false);
  const [ngPreview, setNgPreview] = useState(null);
  const [edxlPreview, setEdxlPreview] = useState(null);
  const brief = useMemo(() => buildIncidentBrief(incident, safetyProfile, Boolean(incident?.includeHealthData), language), [incident, safetyProfile, language]);

  async function regenerate() {
    if (!incident) return;
    setLoading(true);
    try {
      const result = await generateCEIM(incident);
      updateIncident({ ceimReport: result.ceim, ceimDegraded: Boolean(result.degraded), ceimGeneratedAt: new Date().toISOString() });
    } catch (error) {
      Alert.alert(pick("CEIM indisponibil", "CEIM unavailable"), error.message);
    } finally { setLoading(false); }
  }

  async function previewNG() {
    if (!incident?.backendSessionId) return Alert.alert(pick("Sesiune necesară", "Session required"), pick("Creează mai întâi o sesiune backend din ecranul de predare.", "Create a backend session from the handoff screen first."));
    try {
      const result = await buildNgProtocol(incident.backendSessionId, incident);
      setNgPreview(result);
      logInstitutional({ action: "ng_protocol.build", mode: settings.realDataMode ? "real" : "simulated", detail: pick("Preview NG protocol construit", "NG protocol preview built"), ok: true });
    } catch (error) { Alert.alert("NG preview", error.message); }
  }

  async function previewEDXL() {
    if (!incident?.backendSessionId) return Alert.alert(pick("Sesiune necesară", "Session required"), pick("Creează mai întâi o sesiune backend din ecranul de predare.", "Create a backend session from the handoff screen first."));
    try { setEdxlPreview(await buildEdxlSitrep(incident.backendSessionId)); } catch (error) { Alert.alert("EDXL preview", error.message); }
  }

  if (!incident) return <SafeAreaView style={styles.container}><EmergencyScreenHeader title={pick("Raport", "Report")} navigation={navigation} showMenu={false} /><View style={styles.content}><Text style={styles.title}>{pick("Nu există o sesiune activă.", "There is no active session.")}</Text></View></SafeAreaView>;
  const ceimText = incident.ceimReport ? JSON.stringify(incident.ceimReport, null, 2) : pick("Raportul CEIM nu a fost generat încă.", "The CEIM report has not been generated yet.");

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Raport incident", "Incident report")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Rezumat pentru echipaj", "Crew handoff summary")}</Text>
          <Text selectable style={styles.code}>{brief}</Text>
          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => Clipboard.setStringAsync(brief)}>{pick("Copiază rezumatul", "Copy summary")}</Button>
            <Button mode="outlined" onPress={() => Share.share({ message: brief })}>{pick("Partajează", "Share")}</Button>
          </View>
        </PrimaryCard>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <View style={styles.row}><Text style={styles.sectionTitle}>CEIM</Text>{incident.ceimDegraded ? <Text style={styles.dangerText}>degraded</Text> : null}</View>
          <Text selectable style={styles.code}>{ceimText}</Text>
          <Button style={{ marginTop: 12 }} mode="outlined" loading={loading} onPress={regenerate}>{incident.ceimReport ? pick("Regenerează CEIM", "Regenerate CEIM") : pick("Generează CEIM", "Generate CEIM")}</Button>
        </PrimaryCard>
        {settings.realDataMode ? (
          <PrimaryCard style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>{pick("Protocoale instituționale — prototip", "Institutional protocols — prototype")}</Text>
            <Text style={styles.muted}>{pick("Aceste preview-uri sunt generate de backend-ul ResQKit și nu sunt transmise automat către 112.", "These previews are generated by the ResQKit backend and are not automatically sent to 112.")}</Text>
            <View style={styles.actions}>
              <Button mode="outlined" onPress={previewNG}>Preview NG protocol</Button>
              <Button mode="outlined" onPress={previewEDXL}>Preview EDXL-SitRep</Button>
            </View>
            {ngPreview ? <Text selectable style={[styles.code, { marginTop: 12 }]}>{JSON.stringify(ngPreview, null, 2)}</Text> : null}
            {edxlPreview ? <Text selectable style={[styles.code, { marginTop: 12 }]}>{JSON.stringify(edxlPreview, null, 2)}</Text> : null}
          </PrimaryCard>
        ) : null}
        {fromGuide ? (
          <Button mode="contained" icon="arrow-left" onPress={() => navigation.navigate(ROUTES.PROTOCOL)}>{pick("Înapoi la ghidare", "Back to guidance")}</Button>
        ) : null}
        <Button style={fromGuide ? { marginTop: 8 } : undefined} mode={fromGuide ? "text" : "contained"} onPress={() => navigation.navigate(ROUTES.REVIEW)}>{pick("Continuă la încheierea sesiunii", "Continue to session completion")}</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
