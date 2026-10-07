import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import styles from "../emergency/emergencyScreen.styles";

export default function SafetyProfileScreen({ navigation }) {
  const { safetyProfile, updateSafetyProfile, consent } = useApp();
  const { pick } = useLocale();
  const medicalAllowed = consent.healthDataConsent;
  const fields = [
    ["displayName", pick("Nume afișat", "Display name"), false],
    ["bloodType", pick("Grupă sanguină", "Blood type"), true],
    ["allergies", pick("Alergii", "Allergies"), true],
    ["conditions", pick("Afecțiuni", "Conditions"), true],
    ["medications", pick("Medicamente", "Medications"), true],
    ["implants", pick("Implanturi / dispozitive", "Implants / devices"), true],
    ["emergencyContactName", pick("Contact de urgență - nume", "Emergency contact - name"), false],
    ["emergencyContactPhone", pick("Contact de urgență - telefon", "Emergency contact - phone"), false],
    ["language", pick("Limba vorbită", "Spoken language"), false],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Profil de siguranță", "Safety profile")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{pick("Profil de siguranță", "Safety profile")}</Text>
        <Text style={styles.subtitle}>{pick("Datele sunt păstrate local. Câmpurile medicale necesită consimțământul separat din ecranul Consimțământ.", "Data are stored locally. Medical fields require the separate health-data consent from the Consent screen.")}</Text>
        <PrimaryCard style={{ marginTop: 24 }}>
          {fields.map(([key, label, medical]) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <TextInput mode="outlined" label={label} value={safetyProfile[key] || ""} disabled={medical && !medicalAllowed} onChangeText={(value) => updateSafetyProfile({ [key]: value })} />
              {medical && !medicalAllowed ? <Text style={styles.listDescription}>{pick("Blocat până la acordarea consimțământului pentru date medicale.", "Locked until consent for health data is granted.")}</Text> : null}
            </View>
          ))}
        </PrimaryCard>
        <Button style={{ marginTop: 16 }} mode="contained" onPress={() => Alert.alert(pick("Salvat", "Saved"), pick("Profilul de siguranță este salvat local automat.", "The Safety Profile is saved locally automatically."))}>{pick("Salvează", "Save")}</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
