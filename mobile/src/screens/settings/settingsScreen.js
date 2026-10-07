import { Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import SettingRow from "../../components/settings/settingRow";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import styles from "./settingsScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function SettingsScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const { pick } = useLocale();
  const { signOut, isLoggedIn, settings, online } = useApp();
  const currentLanguage = String(i18n.resolvedLanguage || i18n.language).toLowerCase().startsWith("en") ? "English" : "Română";

  async function logout() {
    try {
      await signOut();
    } catch (error) {
      Alert.alert(pick("Deconectare", "Log out"), error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={t("settings.title")} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PrimaryCard style={styles.card}>
          <SettingRow icon="account-outline" title={t("settings.account")} onPress={() => navigation.navigate(ROUTES.ACCOUNT)} />
          <SettingRow icon="shield-account-outline" title={pick("Profil de siguranță", "Safety profile")} onPress={() => navigation.navigate(ROUTES.SAFETY_PROFILE)} />
          <SettingRow icon="shield-check-outline" title={pick("Consimțământ și siguranță", "Consent and safety")} onPress={() => navigation.navigate(ROUTES.CONSENT, { next: ROUTES.SETTINGS })} />
          <SettingRow icon="medical-bag" title={pick("Kituri înregistrate", "Registered kits")} value={isLoggedIn ? "Backend" : "Login"} onPress={() => navigation.navigate(ROUTES.REGISTERED_KITS)} />
          <SettingRow icon="translate" title={t("settings.language")} value={currentLanguage} onPress={() => navigation.navigate(ROUTES.LANGUAGE)} />
        </PrimaryCard>

        <PrimaryCard style={styles.card}>
          <SettingRow icon="history" title={pick("Istoric", "History")} onPress={() => openScreen(navigation, ROUTES.HISTORY)} />
          <SettingRow icon="scale-balance" title={pick("Referințe și reglementări", "References and regulations")} onPress={() => navigation.navigate(ROUTES.REGULATIONS)} />
          <SettingRow icon="help-circle-outline" title="FAQ" onPress={() => navigation.navigate(ROUTES.FAQ)} />
          <SettingRow icon="email-outline" title="Contact" onPress={() => navigation.navigate(ROUTES.CONTACT)} />
        </PrimaryCard>

        <PrimaryCard style={styles.card}>
          <SettingRow icon="tune-variant" title={pick("Setări avansate", "Advanced settings")} value={`${settings.realDataMode ? pick("Real", "Real") : pick("Simulat", "Simulated")} · ${online ? "online" : "offline"}`} onPress={() => navigation.navigate(ROUTES.ADVANCED_SETTINGS)} />
          {isLoggedIn ? <SettingRow icon="logout" title={pick("Deconectare", "Log out")} danger onPress={() => Alert.alert(pick("Deconectare", "Log out"), pick("Vrei să ieși din cont?", "Do you want to log out?"), [{ text: pick("Anulează", "Cancel"), style: "cancel" }, { text: pick("Deconectare", "Log out"), style: "destructive", onPress: logout }])} /> : null}
        </PrimaryCard>
      </ScrollView>
    </SafeAreaView>
  );
}
