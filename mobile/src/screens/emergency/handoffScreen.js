import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Chip, Switch, TextInput } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";

import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import PrimaryCard from "../../components/common/primaryCard";
import KitScanner from "../../components/emergency/kitScanner";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { buildIncidentBrief, polishIncidentBrief } from "../../services/briefService";
import { createInstitutionalSession } from "../../services/institutionalService";
import { speakText, stopSpeaking } from "../../services/ttsService";
import { rankVictims, urgencyLabel, victimUrgencyRank } from "../../utils/triage";
import styles from "./emergencyScreen.styles";

export default function HandoffScreen({ navigation }) {
  const {
    incident,
    updateIncident,
    safetyProfile,
    consent,
    settings,
    logInstitutional,
    user,
  } = useApp();
  const { language, pick } = useLocale();

  const [locating, setLocating] = useState(false);
  const [locationNote, setLocationNote] = useState(incident?.locationNote || "");
  const [polishing, setPolishing] = useState(false);
  const [spokenBrief, setSpokenBrief] = useState("");
  const [speaking, setSpeaking] = useState(false);

  const rankedVictims = useMemo(() => rankVictims(incident?.victims || []), [incident?.victims]);
  const selectedVictimId = useMemo(() => {
    if (!incident) return null;
    const requested = incident.handoffVictimId || incident.activeVictimId;
    if (requested && incident.victims?.some((victim) => victim.id === requested)) return requested;
    return rankedVictims[0]?.id || null;
  }, [incident, rankedVictims]);

  const brief = useMemo(
    () => buildIncidentBrief(
      incident,
      safetyProfile,
      Boolean(incident?.includeHealthData),
      language,
      {
        victimId: selectedVictimId,
        includeReporter: Boolean(incident?.includeReporterData),
      }
    ),
    [incident, safetyProfile, language, selectedVictimId]
  );

  const hazards = [
    ["traffic", pick("trafic", "traffic")],
    ["fire", pick("foc", "fire")],
    ["electricity", pick("curent electric", "electricity")],
    ["gas", pick("gaze", "gas")],
    ["toxic", pick("substanțe toxice", "toxic substances")],
    ["water", pick("apă", "water")],
    ["unstable", pick("obiecte instabile", "unstable objects")],
  ];

  useEffect(() => {
    if (!incident) return;
    const patch = {};
    if (!incident.handoffVictimId && selectedVictimId) patch.handoffVictimId = selectedVictimId;
    if (!incident.reporterName && user) {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (fullName) patch.reporterName = fullName;
    }
    if (Object.keys(patch).length) updateIncident(patch);
  }, [incident?.id, selectedVictimId, user?.firstName, user?.lastName]);

  useEffect(() => {
    // A polished version belongs to the exact deterministic brief that produced it.
    setSpokenBrief("");
  }, [brief]);

  useEffect(() => () => { void stopSpeaking(); }, []);

  if (!incident) {
    return (
      <SafeAreaView style={styles.container}>
        <EmergencyScreenHeader title={pick("Predare informații", "Handoff")} navigation={navigation} showMenu={false} />
        <View style={styles.content}>
          <Text style={styles.title}>{pick("Nu există o sesiune activă.", "There is no active session.")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  async function captureLocation() {
    setLocating(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        throw new Error(pick("Permisiunea pentru locație nu a fost acordată.", "Location permission was not granted."));
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      updateIncident({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        locationFixAt: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert(pick("Locație indisponibilă", "Location unavailable"), error.message);
    } finally {
      setLocating(false);
    }
  }

  async function ensureSession() {
    if (!settings.realDataMode) {
      logInstitutional({
        action: "session.create",
        mode: "simulated",
        detail: pick("Mod simulat: nu s-au trimis date către backend.", "Simulated mode: no data were sent to the backend."),
        ok: true,
      });
      return null;
    }
    if (incident.backendSessionId) return incident.backendSessionId;
    try {
      const active = incident.victims?.find((v) => v.id === incident.activeVictimId) || incident.victims?.[0];
      const session = await createInstitutionalSession(active?.situation || null);
      updateIncident({ backendSessionId: session.id, sessionCode: session.join_code || null });
      logInstitutional({
        action: "session.create",
        mode: "real",
        detail: pick(`Sesiune ${session.id} creată`, `Session ${session.id} created`),
        ok: true,
      });
      return session.id;
    } catch (error) {
      logInstitutional({ action: "session.create", mode: "real", detail: error.message, ok: false });
      Alert.alert(pick("Backend indisponibil", "Backend unavailable"), error.message);
      return null;
    }
  }

  function toggleHazard(id) {
    const current = incident.hazards || [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    updateIncident({ hazards: next });
  }

  async function handlePolishBrief() {
    setPolishing(true);
    try {
      const polished = await polishIncidentBrief(brief);
      if (!polished) throw new Error(pick("Backend-ul nu a returnat o versiune pentru vorbire.", "The backend did not return a spoken version."));
      setSpokenBrief(polished);
      logInstitutional({
        action: "handoff.polish",
        mode: "real",
        detail: pick("Versiunea pentru vorbire a fost generată de backend din rezumatul existent.", "The spoken handoff was generated by the backend from the existing brief."),
        ok: true,
      });
    } catch (error) {
      logInstitutional({ action: "handoff.polish", mode: "real", detail: error.message, ok: false });
      Alert.alert(
        pick("Versiune pentru vorbire indisponibilă", "Spoken handoff unavailable"),
        pick("Folosește rezumatul scris. AI-ul nu trebuie să adauge fapte noi.", "Use the written brief. The AI must not add new facts.")
      );
    } finally {
      setPolishing(false);
    }
  }

  async function toggleSpeech() {
    if (speaking) {
      await stopSpeaking();
      setSpeaking(false);
      return;
    }
    const text = spokenBrief || brief;
    const started = await speakText(text, {
      language,
      rate: 0.92,
      onStart: () => setSpeaking(true),
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
    if (!started) setSpeaking(false);
  }

  function selectHandoffVictim(victimId) {
    updateIncident({ handoffVictimId: victimId });
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader
        title={pick("Predă informațiile", "Handoff information")}
        navigation={navigation}
        showMenu={false}
        showNotifications={false}
      />
      <Emergency112Banner />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{pick("Echipajul a sosit, predă ce știi", "The crew has arrived — hand over what you know")}</Text>
        <Text style={styles.subtitle}>
          {pick(
            "Rezumatul este construit automat numai din informațiile înregistrate în sesiune.",
            "The summary is built automatically only from information recorded in this session."
          )}
        </Text>

        {rankedVictims.length > 1 ? (
          <PrimaryCard style={{ marginTop: 24, marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>{pick("Pentru ce victimă predai informațiile?", "Which person is this handoff for?")}</Text>
            <Text style={styles.muted}>
              {pick(
                "Pentru mai multe victime, pregătește separat rezumatul fiecărei persoane. Lista este ordonată determinist după răspunsurile de triaj.",
                "For multiple people, prepare a separate brief for each person. The list is deterministically ordered from the triage answers."
              )}
            </Text>
            <View style={styles.chips}>
              {rankedVictims.map((victim, index) => {
                const rank = victimUrgencyRank(victim);
                return (
                  <Chip
                    key={victim.id}
                    selected={victim.id === selectedVictimId}
                    onPress={() => selectHandoffVictim(victim.id)}
                    icon={victim.id === selectedVictimId ? "check-circle" : "account-outline"}
                  >
                    {`#${index + 1} ${victim.label || pick(`Victima ${victim.number || index + 1}`, `Person ${victim.number || index + 1}`)} · ${urgencyLabel(rank, language)}`}
                  </Chip>
                );
              })}
            </View>
          </PrimaryCard>
        ) : null}

        <PrimaryCard style={{ marginTop: rankedVictims.length > 1 ? 0 : 24, marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Persoana care predă informațiile", "Person giving the handoff")}</Text>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.listTitle}>{pick("Include numele și telefonul", "Include name and phone")}</Text>
              <Text style={styles.listDescription}>
                {pick("Opțional, pentru ca echipajul să poată identifica martorul/salvatorul.", "Optional, so the crew can identify the witness/rescuer.")}
              </Text>
            </View>
            <Switch
              value={Boolean(incident.includeReporterData)}
              onValueChange={(value) => updateIncident({ includeReporterData: value })}
            />
          </View>
          {incident.includeReporterData ? (
            <>
              <TextInput
                style={{ marginTop: 12 }}
                mode="outlined"
                label={pick("Nume", "Name")}
                value={incident.reporterName || ""}
                onChangeText={(value) => updateIncident({ reporterName: value })}
              />
              <TextInput
                style={{ marginTop: 12 }}
                mode="outlined"
                label={pick("Telefon", "Phone")}
                keyboardType="phone-pad"
                value={incident.reporterPhone || ""}
                onChangeText={(value) => updateIncident({ reporterPhone: value })}
              />
            </>
          ) : null}
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Locație", "Location")}</Text>
          <Text style={styles.muted}>
            {incident.latitude != null
              ? `${Number(incident.latitude).toFixed(5)}, ${Number(incident.longitude).toFixed(5)}${incident.accuracy ? ` · ±${Math.round(incident.accuracy)} m` : ""}`
              : pick("Nu există încă o poziție GPS.", "No GPS position has been recorded yet.")}
          </Text>
          <Button style={{ marginTop: 10 }} mode="outlined" icon="crosshairs-gps" loading={locating} onPress={captureLocation}>
            {pick("Actualizează locația", "Update location")}
          </Button>
          <TextInput
            style={{ marginTop: 12 }}
            mode="outlined"
            label={pick("Reper / descriere locație", "Landmark / location description")}
            value={locationNote}
            onChangeText={setLocationNote}
            onBlur={() => updateIncident({ locationNote: locationNote.trim() })}
          />
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Pericole observate", "Observed hazards")}</Text>
          <View style={styles.chips}>
            {hazards.map(([id, label]) => (
              <Chip key={id} selected={(incident.hazards || []).includes(id)} onPress={() => toggleHazard(id)}>
                {label}
              </Chip>
            ))}
          </View>
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <KitScanner
            context={incident.context || "other"}
            selected={incident.kitItems || []}
            onChange={(items, source) => updateIncident({ kitItems: items, kitSource: source })}
          />
          <TextInput
            style={{ marginTop: 12 }}
            mode="outlined"
            label={pick("Materiale selectate manual (separate prin virgulă)", "Manually selected materials (comma-separated)")}
            value={(incident.kitItems || []).join(", ")}
            onChangeText={(value) => updateIncident({
              kitItems: value.split(",").map((item) => item.trim()).filter(Boolean),
              kitSource: "manual",
            })}
          />
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.listTitle}>{pick("Include datele medicale din profil", "Include health data from profile")}</Text>
              <Text style={styles.listDescription}>
                {consent.healthDataConsent
                  ? pick("Partajarea este controlată separat pentru această sesiune.", "Sharing is controlled separately for this session.")
                  : pick("Necesită consimțământ pentru date medicale.", "Requires consent for health data.")}
              </Text>
            </View>
            <Switch
              disabled={!consent.healthDataConsent}
              value={Boolean(incident.includeHealthData)}
              onValueChange={(value) => updateIncident({ includeHealthData: value })}
            />
          </View>
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Rezumat determinist", "Deterministic summary")}</Text>
          <Text style={styles.muted}>
            {pick(
              "Acest text este compus local din datele sesiunii și rămâne sursa de adevăr pentru handoff.",
              "This text is composed locally from session data and remains the source of truth for handoff."
            )}
          </Text>
          <Text selectable style={[styles.code, { marginTop: 12 }]}>{brief}</Text>
          <View style={styles.actions}>
            <Button
              mode="outlined"
              icon="content-copy"
              onPress={async () => {
                await Clipboard.setStringAsync(brief);
                Alert.alert(pick("Copiat", "Copied"), pick("Rezumatul a fost copiat.", "The summary was copied."));
              }}
            >
              {pick("Copiază", "Copy")}
            </Button>
            <Button mode="outlined" icon="share-variant" onPress={() => Share.share({ message: brief })}>
              {pick("Partajează", "Share")}
            </Button>
          </View>
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Versiune pentru predare verbală", "Spoken handoff")}</Text>
          <Text style={styles.muted}>
            {pick(
              "Opțional: backend-ul poate reformula rezumatul deja compus într-o variantă mai fluentă pentru vorbire. Nu are voie să adauge fapte noi.",
              "Optional: the backend can rewrite the already-composed brief into a more fluent spoken version. It must not add new facts."
            )}
          </Text>
          <Button style={{ marginTop: 12 }} mode="outlined" icon="auto-fix" loading={polishing} disabled={polishing} onPress={handlePolishBrief}>
            {pick("Formulează pentru vorbire", "Polish for speaking")}
          </Button>
          {spokenBrief ? (
            <>
              <Text selectable style={[styles.value, { marginTop: 14, lineHeight: 22 }]}>{spokenBrief}</Text>
              <View style={styles.actions}>
                <Button mode="outlined" icon={speaking ? "stop" : "volume-high"} onPress={toggleSpeech}>
                  {speaking ? pick("Oprește citirea", "Stop reading") : pick("Citește cu voce tare", "Read aloud")}
                </Button>
                <Button mode="outlined" icon="content-copy" onPress={() => Clipboard.setStringAsync(spokenBrief)}>
                  {pick("Copiază versiunea verbală", "Copy spoken version")}
                </Button>
              </View>
            </>
          ) : (
            <Button style={{ marginTop: 8 }} mode="text" icon={speaking ? "stop" : "volume-high"} onPress={toggleSpeech}>
              {speaking ? pick("Oprește citirea", "Stop reading") : pick("Citește rezumatul scris", "Read written brief")}
            </Button>
          )}
        </PrimaryCard>

        {settings.realDataMode ? (
          <PrimaryCard style={{ marginBottom: 16 }}>
            <Text style={styles.sectionTitle}>{pick("Sesiune instituțională de prototip", "Prototype institutional session")}</Text>
            <Text style={styles.muted}>
              {pick(
                "Acest mod comunică doar cu backend-ul ResQKit. Nu reprezintă o conexiune reală la infrastructura 112.",
                "This mode communicates only with the ResQKit backend. It is not a real connection to 112 infrastructure."
              )}
            </Text>
            <Button style={{ marginTop: 12 }} mode="outlined" onPress={ensureSession}>
              {incident.backendSessionId
                ? `${pick("Sesiune", "Session")}: ${incident.sessionCode || incident.backendSessionId}`
                : pick("Creează sesiune backend", "Create backend session")}
            </Button>
          </PrimaryCard>
        ) : null}

        <View style={styles.actions}>
          <Button mode="outlined" onPress={() => navigation.navigate(ROUTES.VICTIMS)}>
            {pick("Gestionează victimele", "Manage people")}
          </Button>
          <Button mode="outlined" icon="comment-text-outline" onPress={() => navigation.navigate(ROUTES.INTERVIEW)}>
            {pick("Interviu opțional pentru raport", "Optional report interview")}
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate(ROUTES.REPORT)}>
            {pick("Generează raportul", "Generate report")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
