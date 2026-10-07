import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import SettingRow from "../../components/settings/settingRow";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { openScreen } from "../../utils/navigation";
import styles from "./settingsScreen.styles";
import { FONTS } from "../../design";

// Account tab (zip's account.tsx): who is signed in, plus the secondary pages.
export default function AccountTabScreen({ navigation }) {
  const { pick } = useLocale();
  const { user, isLoggedIn, signOut } = useApp();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || user?.email;

  function confirmLogout() {
    Alert.alert(pick("Deconectare", "Log out"), pick("Vrei să ieși din cont?", "Do you want to log out?"), [
      { text: pick("Anulează", "Cancel"), style: "cancel" },
      {
        text: pick("Deconectare", "Log out"),
        style: "destructive",
        onPress: async () => {
          try { await signOut(); } catch (error) { Alert.alert(pick("Deconectare", "Log out"), error.message); }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Cont", "Account")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PrimaryCard style={styles.card}>
          {isLoggedIn ? (
            <>
              <Text style={{ fontSize: 17, fontFamily: FONTS.display, fontWeight: "normal" }}>{name}</Text>
              {user?.email ? <Text style={{ marginTop: 2, opacity: 0.65 }}>{user.email}</Text> : null}
              <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
                <Button mode="contained" onPress={() => navigation.navigate(ROUTES.ACCOUNT)}>{pick("Date personale", "Personal info")}</Button>
                <Button mode="outlined" onPress={confirmLogout}>{pick("Deconectare", "Log out")}</Button>
              </View>
            </>
          ) : (
            <>
              <Text style={{ opacity: 0.75 }}>{pick("Conectează-te pentru a-ți vedea contul.", "Sign in to see your account.")}</Text>
              <Button style={{ marginTop: 12, alignSelf: "flex-start" }} mode="contained" onPress={() => openScreen(navigation, ROUTES.LOGIN)}>
                {pick("Conectare", "Sign in")}
              </Button>
            </>
          )}
        </PrimaryCard>

        <PrimaryCard style={styles.card}>
          <SettingRow icon="cog" title={pick("Setări", "Settings")} onPress={() => navigation.navigate(ROUTES.SETTINGS)} />
          <SettingRow icon="book-open-page-variant" title={pick("Ghiduri și tutoriale", "Guides and tutorials")} onPress={() => navigation.navigate(ROUTES.GUIDES)} />
          <SettingRow icon="help-circle-outline" title="FAQ" onPress={() => navigation.navigate(ROUTES.FAQ)} />
          <SettingRow icon="email-outline" title="Contact" onPress={() => navigation.navigate(ROUTES.CONTACT)} />
        </PrimaryCard>
      </ScrollView>
    </SafeAreaView>
  );
}
