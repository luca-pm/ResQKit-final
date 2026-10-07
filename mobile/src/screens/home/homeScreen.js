import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import SearchSection from "../../sections/home/searchSection";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { COLORS, RADIUS, SPACING, FONTS } from "../../design";
import { terminateInstitutionalSession } from "../../services/institutionalService";
import styles from "./homeScreen.styles";

// Layout follows the zip's index.tsx: 112 first, then the active incident,
// then "prepare now" shortcuts.
export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const { pick } = useLocale();
  const { incident, consent, settings, safetyProfile, closeIncident, logInstitutional } = useApp();

  function openIntervention() {
    if (!consent.disclaimerAcknowledged) {
      navigation.navigate(ROUTES.CONSENT, { next: ROUTES.INCIDENT_START });
      return;
    }
    navigation.navigate(ROUTES.INCIDENT_START);
  }

  async function call112() {
    try {
      await Linking.openURL("tel:112");
    } catch {
      Alert.alert(pick("Sună la 112", "Call 112"), pick("Telefonul nu a putut porni apelul automat. Apelează manual 112.", "The phone could not start the call automatically. Dial 112 manually."));
    }
  }

  function endIncident() {
    const keeps = settings.retention !== "session";
    Alert.alert(
      pick("Închei acest incident?", "End this incident?"),
      keeps
        ? pick("Va fi închis și păstrat pe acest telefon pentru perioada aleasă, apoi șters automat.", "It will be closed and kept on this device for the retention period you chose, then deleted automatically.")
        : pick("Va fi închis și șters imediat de pe acest telefon.", "It will be closed and deleted from this device straight away."),
      [
        { text: pick("Anulează", "Cancel"), style: "cancel" },
        {
          text: keeps ? pick("Închei incidentul", "End incident") : pick("Închei și șterge", "End and delete"),
          style: "destructive",
          onPress: () => {
            const sessionId = incident?.backendSessionId;
            if (settings.realDataMode && sessionId && !sessionId.startsWith("sim-")) {
              terminateInstitutionalSession(sessionId)
                .then(() => logInstitutional({ action: "session.terminate", mode: "real", detail: `Backend session ${sessionId} terminated`, ok: true }))
                .catch((error) => logInstitutional({ action: "session.terminate", mode: "real", detail: error.message, ok: false }));
            }
            void closeIncident();
          },
        },
      ]
    );
  }

  function handleSearchSubmit() {
    const q = search.trim();
    if (!q) return;
    navigation.navigate(ROUTES.GUIDES, { search: q });
  }

  const hasHealthData = Boolean(safetyProfile?.bloodType || safetyProfile?.allergies || safetyProfile?.conditions || safetyProfile?.medications);
  const shortcuts = [
    {
      route: ROUTES.SAFETY_PROFILE,
      icon: "account-heart-outline",
      title: pick("Profil de siguranță", "Safety Profile"),
      description: hasHealthData
        ? pick("Stocat doar pe acest telefon", "Stored on this device only")
        : pick("Adaugă grupa sanguină, alergii, medicație", "Add blood type, allergies, medication"),
    },
    { route: ROUTES.REGISTERED_KITS, icon: "bag-personal-outline", title: pick("Kiturile mele", "My Kits"), description: pick("Știi ce ai de fapt la tine", "Know what you actually carry") },
    { route: ROUTES.REGULATIONS, icon: "scale-balance", title: pick("Riscuri și reglementări", "Risks & regulations"), description: pick("Obligații UE cu surse, fără presupuneri", "Sourced EU obligations, no guesswork") },
    { route: ROUTES.PRACTICE_HOME, icon: "school-outline", title: pick("Învață și exersează", "Learn & practise"), description: pick("Parcurge procedurile în liniște", "Calm-time walkthrough of every procedure") },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Acasă", "Home")} navigation={navigation} onProfilePress={() => navigation.navigate(ROUTES.ACCOUNT_TAB)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <SearchSection search={search} setSearch={setSearch} onSubmit={handleSearchSubmit} />

        <View style={[styles.section, { gap: SPACING.md }]}>
          <View style={{ borderRadius: RADIUS.lg, borderWidth: 1, borderColor: "#F3C4C0", backgroundColor: "#FDF3F2", padding: 20 }}>
            <Text style={{ color: COLORS.error, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 }}>{pick("Dacă cineva e rănit, sună întâi", "If someone is hurt, call first")}</Text>
            <Text style={{ color: COLORS.text, fontSize: 22, fontFamily: FONTS.display, fontWeight: "normal", marginTop: 6 }}>{pick("Sună la 112 înainte de orice", "Call 112 before anything else")}</Text>
            <Text style={{ color: COLORS.textSecondary, marginTop: 6, lineHeight: 20 }}>{pick("ResQKit nu contactează serviciile de urgență și nu trimite locația ta nimănui. Telefonul și rețeaua transmit locația apelantului către 112, conform regulilor UE.", "ResQKit does not contact emergency services and does not send your location to anyone. Your phone and network deliver caller location to the emergency service under EU rules.")}</Text>
            <View style={{ marginTop: 16, gap: 8 }}>
              <Button mode="contained" buttonColor={COLORS.error} icon="phone" contentStyle={{ minHeight: 52 }} onPress={call112}>{pick("Sună la 112", "Call 112")}</Button>
              <Button mode="contained-tonal" icon="alarm-light-outline" contentStyle={{ minHeight: 52 }} onPress={openIntervention}>
                {incident ? pick("Reia incidentul", "Resume incident") : pick("Pornește ghidarea", "Start guided help")}
              </Button>
            </View>
          </View>

          {incident ? (
            <View style={{ borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.primaryLight, backgroundColor: COLORS.white, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}>
              <MaterialCommunityIcons name="clock-outline" size={18} color={COLORS.primary} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: COLORS.text }}>{pick("Incident în desfășurare", "Incident in progress")}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{pick("Pornit la", "Started")} {new Date(incident.startedAt).toLocaleTimeString()} · {pick("păstrat pe acest telefon", "kept on this device")}</Text>
              </View>
              <View style={{ gap: 6 }}>
                <Button compact mode="contained" onPress={openIntervention}>{pick("Continuă", "Continue")}</Button>
                <Button compact mode="outlined" onPress={endIncident}>{pick("Închei", "End incident")}</Button>
              </View>
            </View>
          ) : null}

          <Text style={{ color: COLORS.text, fontSize: 19, fontFamily: FONTS.display, fontWeight: "normal", marginTop: 8 }}>{pick("Pregătește-te acum, ca să nu improvizezi mai târziu", "Prepare now, so you don't improvise later")}</Text>
          {shortcuts.map((item) => (
            <Pressable key={item.route} onPress={() => navigation.navigate(item.route)} style={({ pressed }) => [{ borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, padding: 16, flexDirection: "row", gap: 12 }, pressed && { opacity: 0.7 }]}>
              <View style={{ width: 40, height: 40, borderRadius: RADIUS.md, backgroundColor: COLORS.accent, alignItems: "center", justifyContent: "center" }}>
                <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.accentForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "700", color: COLORS.text }}>{item.title}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>{item.description}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.textSecondary} />
            </Pressable>
          ))}

          <View style={{ borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, padding: 16, flexDirection: "row", gap: 8 }}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color={COLORS.primary} style={{ marginTop: 2 }} />
            <Text style={{ flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 19 }}>
              <Text style={{ fontWeight: "700" }}>{pick("Local, din principiu. ", "Local-first by design. ")}</Text>
              {pick("Profilul de siguranță și înregistrarea incidentului rămân pe acest telefon. Imaginile camerei sunt analizate doar pentru recunoașterea obiectelor și nu sunt salvate sau încărcate.", "Your Safety Profile and the incident record stay on this device. Camera frames are analysed for object recognition only and are never stored or uploaded as images.")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
