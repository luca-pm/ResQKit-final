import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import useLocale from "../../hooks/useLocale";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Button, TextInput } from "react-native-paper";

import InputField from "../../components/input/inputFields";
import PrimaryButton from "../../components/buttons/primaryButtons";
import useApp from "../../hooks/useApp";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./loginScreen.styles";

export default function LoginScreen({ navigation }) {
  const { t } = useTranslation();
  const { pick } = useLocale();
  const { signIn } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password.trim()) return setError(t("auth.completeRequiredFields"));
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) return setError(pick("Introdu o adresă de email validă.", "Enter a valid email address."));
    setError(""); setLoading(true);
    try {
      await signIn(cleanEmail, password);
      navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME }] });
    } catch (err) {
      setError(err?.message || pick("Autentificarea nu a reușit. Verifică backend-ul și datele introduse.", "Sign-in failed. Check the backend and your credentials."));
    } finally { setLoading(false); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}><MaterialCommunityIcons name="medical-bag" size={38} color={COLORS.primary} /></View>
          <Text style={styles.brand}>ResQKit</Text>
        </View>
        <Text style={styles.title}>{t("auth.welcome")}</Text>
        <Text style={styles.subtitle}>{t("auth.signInSubtitle")}</Text>
        <View style={styles.form}>
          <View style={styles.input}>
            <InputField label={t("auth.email")} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} left={<TextInput.Icon icon="email-outline" />} error={Boolean(error)} />
          </View>
          <View style={styles.input}>
            <InputField label={t("auth.password")} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" left={<TextInput.Icon icon="lock-outline" />} right={<TextInput.Icon icon={showPassword ? "eye-off-outline" : "eye-outline"} onPress={() => setShowPassword((v) => !v)} />} error={Boolean(error)} />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Text style={styles.forgotPassword} onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}>{t("auth.forgotPassword")}</Text>
          <View style={styles.button}><PrimaryButton title={t("auth.signIn")} onPress={handleLogin} loading={loading} disabled={loading} /></View>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t("auth.noAccount")}</Text>
            <Text style={styles.registerLink} onPress={() => navigation.navigate(ROUTES.REGISTER)}> {t("auth.register")}</Text>
          </View>
          <Button
            style={{ marginTop: 24 }}
            mode="outlined"
            icon="car-emergency"
            textColor={COLORS.error}
            onPress={() => navigation.navigate(ROUTES.INCIDENT_START)}
          >
            {pick("Urgență fără autentificare", "Emergency without sign-in")}
          </Button>
          <Text style={[styles.registerText, { textAlign: "center", marginTop: 8 }]}>
            {pick("Poți folosi protocoalele de urgență fără cont. Arhivarea în cont rămâne opțională.", "You can use the emergency protocols without an account. Account archiving remains optional.")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
