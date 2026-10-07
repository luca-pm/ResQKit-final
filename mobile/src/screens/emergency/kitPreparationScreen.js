import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Chip } from "react-native-paper";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import KitScanner from "../../components/emergency/kitScanner";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { KIT_ITEMS, getKitItemLabel } from "../../data/kitItems";
import { ROUTES } from "../../constants/routes";
import { logKitSelection } from "../../services/institutionalActions";
import styles from "./emergencyScreen.styles";

export default function KitPreparationScreen({ navigation, route }) {
  const { incident, updateIncident, settings, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const nextRoute = route?.params?.nextRoute || ROUTES.PROTOCOL;
  const selected = incident?.kitItems || [];

  function toggle(code) {
    const next = selected.includes(code)
      ? selected.filter((item) => item !== code)
      : [...selected, code];
    updateIncident({ kitItems: next, kitSource: "manual" });
  }

  function continueWithoutScan() {
    updateIncident({ kitReviewedAt: new Date().toISOString() });
    void logKitSelection(
      incident,
      settings.realDataMode,
      selected,
      incident?.kitSource || null,
      logInstitutional,
      (id, code) => updateIncident({ backendSessionId: id, sessionCode: code })
    );
    navigation.navigate(nextRoute);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Materiale disponibile", "Available supplies")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{pick("Ce materiale ai la îndemână?", "What supplies do you have?")}</Text>
        <Text style={styles.subtitle}>{pick("Poți scana conținutul sau îl poți selecta manual. Protocolul medical rămâne fix; aplicația afișează doar materialele utile și alternativele deja descrise în conținutul proiectului.", "You can scan the contents or select them manually. The medical protocol remains fixed; the app only highlights useful supplies and alternatives already described in the project content.")}</Text>

        <PrimaryCard style={{ marginTop: 20, marginBottom: 16 }}>
          <KitScanner
            context={incident?.context || "other"}
            selected={selected}
            onChange={(items, source) => updateIncident({ kitItems: items, kitSource: source })}
          />
        </PrimaryCard>

        <PrimaryCard style={{ marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>{pick("Selectare manuală", "Manual selection")}</Text>
          <View style={styles.chips}>
            {KIT_ITEMS.map((item) => (
              <Chip
                key={item.code}
                icon={selected.includes(item.code) ? "check" : item.icon}
                selected={selected.includes(item.code)}
                showSelectedOverlay
                onPress={() => toggle(item.code)}
              >
                {getKitItemLabel(item.code, language)}
              </Chip>
            ))}
          </View>
        </PrimaryCard>

        <View style={styles.actions}>
          <Button mode="contained" icon="arrow-right" contentStyle={{ minHeight: 54 }} onPress={continueWithoutScan}>
            {pick("Continuă la protocol", "Continue to protocol")}
          </Button>
          <Button mode="text" onPress={continueWithoutScan}>
            {pick("Continuă fără materiale", "Continue without supplies")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
