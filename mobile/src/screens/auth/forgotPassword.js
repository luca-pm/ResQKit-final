import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-paper";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import InputField from "../../components/input/inputFields";
import PrimaryButton from "../../components/buttons/primaryButtons";
import useLocale from "../../hooks/useLocale";
import { COLORS } from "../../design";
import styles from "./forgotPassword.styles";

export default function ForgotPasswordScreen({ navigation }) {
  const { pick } = useLocale();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function isValidEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  function handleResetPassword() {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(pick("Introdu adresa de e-mail.", "Enter your email address."));
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError(
        pick(
          "Introdu o adresă de e-mail validă.",
          "Enter a valid email address."
        )
      );
      return;
    }

    setError(
      pick(
        "Backend-ul ResQKit actual nu expune încă endpoint-uri pentru resetarea parolei. Ecranul este pregătit, dar nu trimite un e-mail fals.",
        "The current ResQKit backend does not expose password-reset endpoints yet. This screen is ready, but it does not send a fake email."
      )
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader
        title={pick("Resetare parolă", "Reset password")}
        navigation={navigation}
        showMenu={false}
        showNotifications={false}
        showProfile={false}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="lock-reset"
              size={44}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            {pick("Ai uitat parola?", "Forgot your password?")}
          </Text>

          <Text style={styles.subtitle}>
            {pick(
              "Introdu adresa de e-mail asociată contului tău ResQKit.",
              "Enter the email address associated with your ResQKit account."
            )}
          </Text>

          <View style={styles.input}>
            <InputField
              label={pick("Adresă de e-mail", "Email address")}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (error) setError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={Boolean(error)}
              left={<TextInput.Icon icon="email-outline" />}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title={pick("Trimite link de resetare", "Send reset link")}
            onPress={handleResetPassword}
          />

          <Text style={styles.helperText}>
            {pick(
              "Resetarea reală va deveni disponibilă după adăugarea endpoint-urilor backend și a serviciului de e-mail.",
              "Real password reset will become available after the backend endpoints and email service are added."
            )}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
