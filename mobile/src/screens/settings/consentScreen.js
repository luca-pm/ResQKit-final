import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Switch } from "react-native-paper";
import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import styles from "../emergency/emergencyScreen.styles";

export default function ConsentScreen({ navigation, route }) {
  const { consent, updateConsent } = useApp();
  const { pick } = useLocale();
  const nextRoute = route?.params?.next || ROUTES.INCIDENT_START;
  function acknowledge() {
    if (!consent.disclaimerAcknowledged) return;
    if (nextRoute === ROUTES.SETTINGS) { navigation.goBack(); return; }
    navigation.replace(nextRoute);
  }
  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Consimțământ și siguranță", "Consent and safety")} navigation={navigation} showMenu={false} showNotifications={false} showProfile={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{pick("Înainte de intervenție", "Before the intervention")}</Text>
        <Text style={styles.subtitle}>{pick("ResQKit oferă ghidare și organizarea informațiilor. Nu înlocuiește serviciul 112, dispeceratul sau personalul medical.", "ResQKit provides guidance and organizes information. It does not replace 112, emergency dispatchers, or medical personnel.")}</Text>
        <PrimaryCard style={{ marginTop: 24, marginBottom: 16 }}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.listTitle}>{pick("Am înțeles rolul aplicației", "I understand the role of the app")}</Text>
              <Text style={styles.listDescription}>{pick("În caz de urgență voi anunța 112 și voi urma indicațiile personalului specializat.", "In an emergency I will call 112 and follow instructions from qualified personnel.")}</Text>
            </View>
            <Switch value={consent.disclaimerAcknowledged} onValueChange={(value) => updateConsent({ disclaimerAcknowledged: value, disclaimerAt: value ? new Date().toISOString() : null })} />
          </View>
        </PrimaryCard>
        <PrimaryCard style={{ marginBottom: 16 }}>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.listTitle}>{pick("Consimțământ pentru date medicale locale", "Consent for local health data")}</Text>
              <Text style={styles.listDescription}>{pick("Opțional. Permite salvarea Profilului de siguranță pe dispozitiv. Partajarea într-un incident se activează separat.", "Optional. Allows the Safety Profile to be stored on the device. Sharing it during an incident is enabled separately.")}</Text>
            </View>
            <Switch value={consent.healthDataConsent} onValueChange={(value) => updateConsent({ healthDataConsent: value, healthDataConsentAt: value ? new Date().toISOString() : null })} />
          </View>
        </PrimaryCard>
        <Button mode="contained" disabled={!consent.disclaimerAcknowledged} onPress={acknowledge}>{pick("Continuă", "Continue")}</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
