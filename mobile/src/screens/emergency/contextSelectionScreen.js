import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import EmergencyChoiceCard from "../../components/emergency/emergencyChoiceCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import styles from "./emergencyScreen.styles";

export default function ContextSelectionScreen({ navigation }) {
  const { incident, updateIncident } = useApp();
  const { pick } = useLocale();
  const contexts = [
    { id: "road", icon: "car-emergency", label: pick("Drum / accident rutier", "Road / traffic incident") },
    { id: "office", icon: "office-building-outline", label: pick("Clădire / birou", "Building / office") },
    { id: "maritime", icon: "ferry", label: pick("Apă / mediu maritim", "Water / maritime") },
    { id: "mountain", icon: "image-filter-hdr", label: pick("Munte / zonă izolată", "Mountain / remote area") },
    { id: "other", icon: "map-marker-question-outline", label: pick("Alt context / nu sunt sigur", "Other / not sure") },
  ];

  function choose(context) {
    updateIncident({ context });
    navigation.navigate(ROUTES.VICTIMS);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Contextul incidentului", "Incident context")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{pick("Unde are loc incidentul?", "Where is the incident happening?")}</Text>
        <Text style={styles.subtitle}>{pick("Contextul este folosit pentru raport, recunoașterea materialelor și datele transmise backend-ului. Nu schimbă automat tratamentul medical.", "The context is used for reporting, kit recognition, and backend data. It does not automatically change the medical treatment.")}</Text>
        {contexts.map((item) => (
          <EmergencyChoiceCard
            key={item.id}
            icon={item.icon}
            title={item.label}
            selected={incident?.context === item.id}
            onPress={() => choose(item.id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
