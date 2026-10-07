import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import EmergencyChoiceCard from "../../components/emergency/emergencyChoiceCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { getAgeProfiles } from "../../data/protocols/protocolData";
import { ROUTES } from "../../constants/routes";
import styles from "./emergencyScreen.styles";

export default function AgeSelectionScreen({ navigation }) {
  const { incident, startIncident, updateActiveVictim } = useApp();
  const { language, pick } = useLocale();
  useEffect(() => {
    if (!incident) startIncident();
  }, [incident, startIncident]);

  const current = incident;
  const active = current?.victims?.find((v) => v.id === current.activeVictimId) || current?.victims?.[0];
  const ageProfiles = getAgeProfiles(language);

  function choose(ageProfile) {
    updateActiveVictim({ ageProfile, status: "in_progress", protocolNodeId: null });
    navigation.navigate(ROUTES.TRIAGE);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Vârsta victimei", "Victim age")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{pick("Ce vârstă are victima, aproximativ?", "Approximately how old is the person?")}</Text>
        <Text style={styles.subtitle}>{pick("Dacă nu ești sigur, alege categoria cea mai apropiată. Profilul rămâne activ pe tot parcursul sesiunii.", "If you are not sure, choose the closest category. This age profile stays active for the whole session.")}</Text>
        <Text style={styles.sectionTitle}>{active?.label || pick("Victima", "Person")}</Text>
        {ageProfiles.map((item) => (
          <EmergencyChoiceCard key={item.id} icon={item.icon} title={item.label} selected={active?.ageProfile === item.id} onPress={() => choose(item.id)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
