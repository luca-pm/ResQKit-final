import { useState } from "react";
import { Alert, Linking, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import CPRMetronome from "../../components/emergency/cprMetronome";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import ProtocolKitHint from "../../components/emergency/protocolKitHint";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { getDynamicProtocolText, getProtocolNode, getSvbStart } from "../../data/protocols/protocolData";
import { ROUTES } from "../../constants/routes";
import { appendSessionEvent, createInstitutionalSession, updateInstitutionalSession } from "../../services/institutionalService";
import { speakText, stopSpeaking } from "../../services/ttsService";
import styles from "./emergencyScreen.styles";

export default function ProtocolScreen({ navigation }) {
  const { incident, settings, updateIncident, updateActiveVictim, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const [speaking, setSpeaking] = useState(false);
  const active = incident?.victims?.find((v) => v.id === incident.activeVictimId) || incident?.victims?.[0];
  const node = getProtocolNode(active?.protocolNodeId, language);
  const text = node?.dynamicText ? getDynamicProtocolText(active?.protocolNodeId, active?.ageProfile, language) : node?.text;

  async function ensureSession() {
    if (!settings.realDataMode) return null;
    if (incident.backendSessionId) return incident.backendSessionId;
    try {
      const session = await createInstitutionalSession(active?.situation || null);
      updateIncident({ backendSessionId: session.id, sessionCode: session.join_code || null });
      logInstitutional({ action: "session.create", mode: "real", detail: `Backend session ${session.id} created`, ok: true });
      return session.id;
    } catch (error) {
      logInstitutional({ action: "session.create", mode: "real", detail: error.message, ok: false });
      return null;
    }
  }

  async function logStep(actionLabel) {
    const step = { index: active?.completedSteps?.length || 0, title: `${node?.title || pick("Pas", "Step")} → ${actionLabel}`, at: new Date().toISOString() };
    updateActiveVictim({ completedSteps: [...(active?.completedSteps || []), step] });
    if (!settings.realDataMode) {
      logInstitutional({ action: "procedure.step", mode: "simulated", detail: step.title, ok: true });
      return;
    }
    const sessionId = await ensureSession();
    if (sessionId) {
      try {
        await appendSessionEvent(sessionId, "procedure_step", { node_id: active?.protocolNodeId, title: node?.title, action: actionLabel });
        logInstitutional({ action: "procedure.step", mode: "real", detail: step.title, ok: true });
      } catch (error) {
        logInstitutional({ action: "procedure.step", mode: "real", detail: error.message, ok: false });
      }
    }
  }

  const pendingVictims = (incident?.victims || []).filter((v) => v.status !== "done" && v.id !== active?.id);

  async function nextVictim() {
    await stopSpeaking();
    setSpeaking(false);
    updateActiveVictim({ status: "done" });
    navigation.navigate(ROUTES.VICTIMS);
  }

  async function call112() {
    updateIncident({ called112: "called", called112At: new Date().toISOString() });
    const sessionId = await ensureSession();
    if (sessionId) void updateInstitutionalSession(sessionId, { called_112: "called" }).catch(() => {});
    try {
      await Linking.openURL("tel:112");
    } catch {
      Alert.alert(
        pick("Sună la 112", "Call 112"),
        pick("Telefonul nu a putut deschide apelul automat. Apelează manual 112.", "The phone could not start the call automatically. Dial 112 manually.")
      );
    }
  }

  async function handleAction(action) {
    await stopSpeaking();
    setSpeaking(false);
    await logStep(action.label);
    if (action.kind === "call112") { await call112(); return; }
    if (action.kind === "call112_handoff") {
      await call112();
      updateActiveVictim({ status: "done" });
      navigation.navigate(ROUTES.HANDOFF);
      return;
    }
    if (action.kind === "handoff") {
      updateActiveVictim({ status: "done" });
      navigation.navigate(ROUTES.HANDOFF);
      return;
    }
    if (action.kind === "svb") {
      updateActiveVictim({ protocolNodeId: getSvbStart(active?.ageProfile || "adult"), situation: "svb" });
      return;
    }
    if (action.next) updateActiveVictim({ protocolNodeId: action.next });
  }

  function readAloud() {
    const spoken = [node?.title, text, node?.warning, node?.note].filter(Boolean).join(". ");
    if (!spoken) return;
    setSpeaking(true);
    void speakText(spoken, {
      language,
      rate: language === "en" ? 0.96 : 0.93,
      onDone: () => setSpeaking(false),
      onError: (error) => {
        setSpeaking(false);
        Alert.alert(
          pick("Citirea cu voce tare nu a pornit", "Text-to-speech did not start"),
          pick(
            `Verifică volumul telefonului și modul silențios. ${error?.message || ""}`.trim(),
            `Check the phone volume and Silent Mode. ${error?.message || ""}`.trim()
          )
        );
      },
    });
  }

  async function stopReading() {
    await stopSpeaking();
    setSpeaking(false);
  }

  if (!active || !node) {
    return (
      <SafeAreaView style={styles.container}>
        <EmergencyScreenHeader title={pick("Protocol", "Protocol")} navigation={navigation} showMenu={false} showNotifications={false} />
        <Emergency112Banner />
        <View style={styles.content}>
          <Text style={styles.title}>{pick("Protocol indisponibil", "Protocol unavailable")}</Text>
          <Button onPress={() => navigation.navigate(ROUTES.SITUATION_SELECTION)}>{pick("Alege situația din nou", "Choose the situation again")}</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Ghidare de urgență", "Emergency guidance")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.row}>
          <View style={styles.badge}><Text style={styles.badgeText}>{active.label || pick("Victima", "Person")}</Text></View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button compact icon="medical-bag" onPress={() => navigation.navigate(ROUTES.KIT_PREPARATION, { nextRoute: ROUTES.PROTOCOL })}>{pick("Materiale", "Supplies")}</Button>
            <Button compact icon="account-multiple" onPress={() => navigation.navigate(ROUTES.VICTIMS)}>{pick("Victime", "People")}</Button>
          </View>
        </View>
        <View style={styles.protocolCard}>
          <Text style={styles.protocolTitle}>{node.title}</Text>
          <Text style={styles.protocolText}>{text}</Text>
          {node.warning ? <View style={styles.warningBox}><Text style={styles.warningText}>{node.warning}</Text></View> : null}
          {node.note ? <View style={styles.noteBox}><Text style={styles.noteText}>{node.note}</Text></View> : null}
          <ProtocolKitHint nodeId={active.protocolNodeId} selected={incident?.kitItems || []} />
          <Button
            icon={speaking ? "stop-circle-outline" : "volume-high"}
            mode="text"
            onPress={speaking ? stopReading : readAloud}
          >
            {speaking ? pick("Oprește citirea", "Stop reading") : pick("Citește cu voce tare", "Read aloud")}
          </Button>
          {Platform.OS === "ios" ? (
            <Text style={[styles.muted, { marginTop: 4 }]}>
              {pick("Pe iPhone, dezactivează modul silențios dacă nu se aude vocea.", "On iPhone, turn off Silent Mode if you cannot hear the voice.")}
            </Text>
          ) : null}
        </View>
        {node.cpr ? <CPRMetronome bpm={node.cpr.bpm} label={node.cpr.label} /> : null}
        <View style={styles.actions}>
          {node.actions.map((action, index) => (
            <Button key={`${action.label}-${index}`} mode={action.kind === "call112" ? "contained" : index === 0 ? "contained" : "outlined"} buttonColor={action.kind === "call112" ? "#E74C3C" : undefined} contentStyle={{ minHeight: 52 }} onPress={() => handleAction(action)}>{action.label}</Button>
          ))}
        </View>
        <View style={[styles.actions, { marginTop: 24 }]}>
          {incident?.ceimReport ? (
            <Button mode="outlined" icon="file-document-outline" onPress={() => navigation.navigate(ROUTES.REPORT, { fromGuide: true })}>
              {pick("Vezi raportul pentru echipaje", "View scene report")}
            </Button>
          ) : (
            // Paperwork for responders, never in the way of first aid.
            <Button mode="outlined" icon="creation" onPress={() => navigation.navigate(ROUTES.INTERVIEW, { fromGuide: true })}>
              {pick("Creează raportul pentru echipaje", "Build scene report for responders")}
            </Button>
          )}
          {pendingVictims.length > 0 ? (
            <Button mode="outlined" icon="account-multiple" onPress={nextVictim}>
              {pick(`Următoarea victimă (${pendingVictims.length} în așteptare)`, `Next victim (${pendingVictims.length} waiting)`)}
            </Button>
          ) : null}
        </View>
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{pick("Conținutul medical este pre-scris din documentele proiectului și trebuie validat de consultantul medical înainte de utilizare clinică.", "The medical content is pre-written from the project documents and must be validated by the medical consultant before clinical use.")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
