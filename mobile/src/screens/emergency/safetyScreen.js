import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import { speakText, stopSpeaking } from "../../services/ttsService";
import styles from "./emergencyScreen.styles";

// One plain-language reminder instead of a hazard checklist (zip's hazards stage).
export default function SafetyScreen({ navigation }) {
  const { incident, updateIncident } = useApp();
  const { language, pick } = useLocale();

  const title = pick("Siguranța ta este pe primul loc", "Your safety comes first");
  const body = pick(
    "Dacă nu este sigur să te apropii (trafic, foc, electricitate, gaz, o structură instabilă, orice altceva), stai departe și așteaptă echipele de intervenție. Nu poți ajuta pe nimeni dacă devii a doua victimă. Folosește-ți judecata; nimeni nu cunoaște acum locul mai bine decât tine.",
    "If it isn't safe to approach (traffic, fire, electricity, gas, an unstable structure, anything), stay back and wait for professionals. You can't help anyone if you become a second victim. Use your own judgement; nobody knows this scene better than you do right now."
  );

  useEffect(() => {
    void speakText(`${title}. ${body}`, { language });
    return () => { void stopSpeaking(); };
  }, [title, body, language]);

  function proceed() {
    updateIncident({ safetyAcknowledgedAt: new Date().toISOString() });
    if (!incident?.kitReviewedAt) navigation.replace(ROUTES.KIT_PREPARATION, { nextRoute: ROUTES.PROTOCOL });
    else navigation.replace(ROUTES.PROTOCOL);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Înainte să te apropii", "Before you get close")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.protocolCard, { borderColor: COLORS.error, borderWidth: 2 }]}>
          <View style={styles.rowStart}>
            <MaterialCommunityIcons name="shield-alert" size={18} color={COLORS.error} />
            <Text style={[styles.dangerText, { fontSize: 12, textTransform: "uppercase" }]}>{pick("Înainte să te apropii", "Before you get close")}</Text>
          </View>
          <Text style={[styles.protocolTitle, { marginTop: 8 }]}>{title}</Text>
          <Text style={styles.protocolText}>{body}</Text>
        </View>
        <View style={styles.actions}>
          <Button mode="contained" icon="arrow-right" contentStyle={{ minHeight: 56, flexDirection: "row-reverse" }} onPress={proceed}>
            {pick("Este sigur, continuă", "It's safe, continue")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
