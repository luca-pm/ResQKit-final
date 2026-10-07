import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import EmergencyChoiceCard from "../../components/emergency/emergencyChoiceCard";
import useLocale from "../../hooks/useLocale";
import { getAgeProfiles, getSituationStart, getSituations } from "../../data/protocols/protocolData";
import { ROUTES } from "../../constants/routes";
import styles from "../emergency/emergencyScreen.styles";

export default function PracticeHomeScreen({ navigation }) {
  const { language, pick } = useLocale();
  const [ageProfile, setAgeProfile] = useState("");
  const ages = getAgeProfiles(language);
  const situations = getSituations(language);

  function startPractice(situation) {
    const startNodeId = getSituationStart(situation, ageProfile || "adult");
    navigation.navigate(ROUTES.PRACTICE_PROTOCOL, { ageProfile: ageProfile || "adult", startNodeId, situation });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Exersare prim ajutor", "First-aid practice")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{pick("Exersează aceleași protocoale ca în intervenție", "Practice the same protocols used during an intervention")}</Text>
        <Text style={styles.subtitle}>{pick("Modul de exersare folosește exact aceeași sursă de protocoale ca fluxul de urgență, dar nu pornește o sesiune, nu apelează 112 și nu salvează pași medicali în istoric.", "Practice mode uses the exact same protocol source as the emergency flow, but it does not start a session, call 112, or save medical steps to history.")}</Text>

        {!ageProfile ? (
          <>
            <Text style={styles.sectionTitle}>{pick("1. Alege categoria de vârstă", "1. Choose an age group")}</Text>
            {ages.map((item) => (
              <EmergencyChoiceCard key={item.id} icon={item.icon} title={item.label} onPress={() => setAgeProfile(item.id)} />
            ))}
          </>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.sectionTitle}>{pick("2. Alege situația", "2. Choose a situation")}</Text>
              <Button compact mode="text" onPress={() => setAgeProfile("")}>{pick("Schimbă vârsta", "Change age")}</Button>
            </View>
            {situations.map((item) => (
              <EmergencyChoiceCard key={item.id} icon={item.icon} title={item.label} onPress={() => startPractice(item.id)} />
            ))}
          </>
        )}

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{pick("Modul de exersare este educațional. Într-o situație reală, folosește fluxul Intervenție și contactează 112 conform instrucțiunilor afișate.", "Practice mode is educational. In a real emergency, use the Intervention flow and contact 112 as instructed on screen.")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
