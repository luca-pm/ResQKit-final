import { useEffect, useState } from "react";
import { Alert, Linking, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Clipboard from "expo-clipboard";
import * as Location from "expo-location";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import { buildDispatcherScript, formatCoords } from "../../utils/dispatcherScript";
import { connectNg112, testInstitutionalVoiceChannel } from "../../services/institutionalActions";
import styles from "./emergencyScreen.styles";

export default function Call112GateScreen({ navigation }) {
  const { incident, startIncident, updateIncident, settings, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const [locating, setLocating] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);

  useEffect(() => {
    if (!incident) startIncident();
  }, [incident, startIncident]);

  const onSession = (id, code) => updateIncident({ backendSessionId: id, sessionCode: code });
  const confirmed = incident?.called112 === "called" || incident?.called112 === "already_called";
  const script = buildDispatcherScript(incident, language);

  function markCalled(status) {
    updateIncident({ called112: status, called112At: new Date().toISOString() });
    void connectNg112(incident, settings.realDataMode, status, logInstitutional, onSession);
  }

  async function call112() {
    markCalled("called");
    try {
      await Linking.openURL("tel:112");
    } catch {
      Alert.alert(
        pick("Sună la 112", "Call 112"),
        pick("Telefonul nu a putut porni apelul automat. Apelează manual 112.", "The phone could not start the call automatically. Dial 112 manually.")
      );
    }
  }

  async function captureLocation() {
    setLocating(true);
    try {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          pick("Locație indisponibilă", "Location unavailable"),
          canAskAgain
            ? pick("Permisiunea a fost refuzată. Descrie un reper.", "Location permission declined. Describe a landmark instead.")
            : pick("Locația este blocată pentru aplicație. Activeaz-o din Setări sau descrie un reper.", "Location is blocked for this app. Enable it in Settings, or describe a landmark.")
        );
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      updateIncident({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        locationFixAt: new Date().toISOString(),
      });
    } catch {
      Alert.alert(pick("Locație indisponibilă", "Location unavailable"), pick("Nu s-a putut obține poziția. Descrie un reper.", "Could not get a fix. Describe a landmark instead."));
    } finally {
      setLocating(false);
    }
  }

  async function copyScript() {
    try {
      await Clipboard.setStringAsync(script);
      Alert.alert(pick("Copiat", "Copied"), pick("Textul a fost copiat.", "Script copied."));
    } catch {
      Alert.alert(pick("Eroare", "Error"), pick("Nu s-a putut copia. Citește-l de pe ecran.", "Could not copy. Read it from the screen."));
    }
  }

  async function testVoiceChannel() {
    setTestingVoice(true);
    try {
      await testInstitutionalVoiceChannel(incident, settings.realDataMode, logInstitutional, onSession);
      Alert.alert(
        pick("Test înregistrat", "Test logged"),
        pick("Vezi Setări → Acțiuni instituționale.", "See Settings → Institutional actions.")
      );
    } finally {
      setTestingVoice(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Apel de urgență", "Emergency call")} navigation={navigation} showMenu={false} showNotifications={false} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: COLORS.emergencyTint }]}>
            <MaterialCommunityIcons name="phone-alert" size={44} color={COLORS.error} />
          </View>
          <Text style={styles.title}>{pick("A fost apelat 112?", "Has 112 been called?")}</Text>
          <Text style={styles.subtitle}>{pick("Nimic altceva din aplicație nu contează mai mult decât acest răspuns. ResQKit nu poate face apelul în locul tău.", "Nothing else in this app matters more than this answer. ResQKit cannot make the call for you.")}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.listTitle}>{pick("Poziția ta", "Your position")}</Text>
              <Text style={styles.listDescription}>{formatCoords(incident, language)}</Text>
            </View>
            <Button mode="outlined" compact icon="crosshairs-gps" loading={locating} disabled={locating} onPress={captureLocation}>
              {pick("Află poziția", "Get fix")}
            </Button>
          </View>
          <Text style={[styles.label, { marginTop: 12 }]}>{pick("Reper sau adresă (spune-l cu voce tare)", "Landmark or address (say this out loud)")}</Text>
          <TextInput
            multiline
            value={incident?.locationNote || ""}
            onChangeText={(text) => updateIncident({ locationNote: text })}
            placeholder={pick("Autostradă spre nord, la 3 km după ultima ieșire, dubă roșie în șanț", "Motorway northbound, 3 km after the last exit, red van in the ditch")}
            placeholderTextColor={COLORS.textSecondary}
            style={{ minHeight: 64, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 10, color: COLORS.text, textAlignVertical: "top" }}
          />
          <Text style={[styles.muted, { marginTop: 8, fontSize: 12 }]}>{pick("Poziția este doar pentru tine, ca să o citești operatorului. Nu este trimisă nicăieri.", "The position is only for you to read to the operator. It is not sent anywhere.")}</Text>
        </View>

        <View style={[styles.card, { borderColor: COLORS.primaryLight }]}>
          <Text style={styles.listTitle}>{pick("Ce să spui", "What to say")}</Text>
          <View style={[styles.noteBox, { marginTop: 8 }]}>
            <Text style={styles.code}>{script}</Text>
          </View>
          <Button style={{ marginTop: 8, alignSelf: "flex-start" }} mode="outlined" compact icon="content-copy" onPress={copyScript}>
            {pick("Copiază textul", "Copy script")}
          </Button>
        </View>

        <View style={styles.actions}>
          <Button mode="contained" buttonColor={COLORS.error} icon="phone" contentStyle={{ minHeight: 56 }} onPress={call112}>
            {pick("Sună acum la 112", "Call 112 now")}
          </Button>
          <Button mode="outlined" contentStyle={{ minHeight: 52 }} onPress={() => { markCalled("already_called"); navigation.navigate(ROUTES.CONTEXT_SELECTION); }}>
            {pick("Da, 112 a fost deja apelat", "Yes, 112 was already called")}
          </Button>
          <Button mode={confirmed ? "contained" : "outlined"} icon="arrow-right" contentStyle={{ minHeight: 52 }} onPress={() => navigation.navigate(ROUTES.CONTEXT_SELECTION)}>
            {pick("Continuă la primul ajutor", "Continue to first aid")}
          </Button>
          <Text style={[styles.muted, { fontSize: 12 }]}>{pick("Dacă nimeni nu a sunat, bannerul roșu rămâne pe ecran toată sesiunea până suni.", "If nobody has called, the red banner stays on screen for the whole session until you do.")}</Text>
        </View>

        {incident?.backendSessionId ? (
          <View style={[styles.card, { borderStyle: "dashed", marginTop: 16 }]}>
            <View style={styles.rowStart}>
              <MaterialCommunityIcons name="radio-tower" size={16} color={COLORS.primary} />
              <Text style={styles.listTitle}>{pick("Cod de asociere dispecerat ISU", "ISU dashboard pairing code")}</Text>
            </View>
            {incident.sessionCode ? (
              <>
                <Text style={{ fontFamily: "monospace", fontSize: 26, letterSpacing: 6, color: COLORS.text, marginTop: 6 }}>{incident.sessionCode}</Text>
                <Text style={[styles.muted, { fontSize: 12 }]}>{pick("Introdu acest cod în dispeceratul ISU pentru a urmări incidentul live.", "Enter this code on the ISU dashboard to watch this incident live.")}</Text>
              </>
            ) : (
              <Text style={[styles.muted, { fontSize: 12, marginTop: 6 }]}>{pick("Simulat pe acest telefon, niciun dispecerat nu se poate conecta. Activează modul cu date reale din Setări pentru un cod real.", "Simulated on this device, no dashboard can connect. Turn on Real data mode in Settings to get a real pairing code.")}</Text>
            )}
          </View>
        ) : null}

        <View style={[styles.card, { borderStyle: "dashed", marginTop: incident?.backendSessionId ? 0 : 16 }]}>
          <View style={styles.rowStart}>
            <MaterialCommunityIcons name="radio-tower" size={16} color={COLORS.primary} />
            <Text style={styles.listTitle}>{pick("Canal vocal instituțional (prototip)", "Institutional voice channel (prototype)")}</Text>
          </View>
          <Text style={[styles.muted, { fontSize: 12, marginTop: 6 }]}>
            {pick("Trimite o cerere de recunoaștere vocală pasivă și un test websocket, înregistrate în Setări → Acțiuni instituționale. Microfonul nu este folosit. ", "Fires a passive-voice-recognition request and a transcript websocket test, logged to Settings → Institutional actions. The microphone is never used. ")}
            {settings.realDataMode
              ? pick("Modul cu date reale este activ.", "Real data mode is on.")
              : pick("Momentan simulat, nu se trimite nimic.", "Currently simulated, nothing is sent.")}
          </Text>
          <Button style={{ marginTop: 8, alignSelf: "flex-start" }} mode="outlined" compact icon="radio-tower" loading={testingVoice} disabled={testingVoice} onPress={testVoiceChannel}>
            {pick("Testează canalul vocal", "Test voice channel")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
