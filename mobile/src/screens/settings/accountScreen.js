import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import InputField from "../../components/input/inputFields";
import PrimaryButton from "../../components/buttons/primaryButtons";
import SectionTitle from "../../components/common/sectionTitle";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { updateProfile } from "../../services/userService";
import styles from "./accountScreen.styles";

export default function AccountScreen({ navigation }) {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const { user, setUser, isLoggedIn } = useApp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(user?.firstName || ""); setLastName(user?.lastName || ""); setEmail(user?.email || "");
  }, [user]);

  async function handleSave() {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanFirstName || !cleanLastName || !cleanEmail) return Alert.alert(pick("Date incomplete", "Incomplete information"), pick("Completează numele, prenumele și adresa de email.", "Enter your first name, last name, and email address."));
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) return Alert.alert(pick("Email invalid", "Invalid email"), pick("Introdu o adresă de email validă.", "Enter a valid email address."));
    setSaving(true);
    try {
      if (isLoggedIn) {
        const backend = await updateProfile(`${cleanFirstName} ${cleanLastName}`.trim());
        const parts = (backend?.name || `${cleanFirstName} ${cleanLastName}`).split(/\s+/);
        setUser((prev) => ({ ...prev, firstName: parts[0] || cleanFirstName, lastName: parts.slice(1).join(" ") || cleanLastName, email: backend?.email || cleanEmail, name: backend?.name }));
      } else {
        setUser((prev) => ({ ...prev, firstName: cleanFirstName, lastName: cleanLastName, email: cleanEmail }));
      }
      Alert.alert(pick("Salvat", "Saved"), isLoggedIn ? pick("Profilul și datele locale au fost actualizate.", "Your profile and local data were updated.") : pick("Datele locale au fost actualizate.", "Local data were updated."));
    } catch (error) { Alert.alert(pick("Salvare eșuată", "Save failed"), error.message); }
    finally { setSaving(false); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={t("account.title")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <PrimaryCard style={styles.card}>
          <SectionTitle>{t("account.personalInformation")}</SectionTitle>
          <View style={styles.input}><InputField label={t("account.firstName")} value={firstName} onChangeText={setFirstName} autoCapitalize="words" /></View>
          <View style={styles.input}><InputField label={t("account.lastName")} value={lastName} onChangeText={setLastName} autoCapitalize="words" /></View>
          <View style={styles.input}><InputField label={t("account.email")} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} /></View>
          {isLoggedIn ? <Text style={{ marginTop: 4, fontSize: 12, opacity: 0.65 }}>{pick("Backend-ul actual permite modificarea numelui; adresa de email rămâne identitatea contului.", "The current backend allows changing the name; the email address remains the account identity.")}</Text> : null}
        </PrimaryCard>
        <View style={styles.button}><PrimaryButton title={t("common.save")} onPress={handleSave} loading={saving} disabled={saving} /></View>
      </ScrollView>
    </SafeAreaView>
  );
}
