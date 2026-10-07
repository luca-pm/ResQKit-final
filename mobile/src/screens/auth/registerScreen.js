import { useState } from "react";

import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useTranslation,
} from "react-i18next";

import useLocale from "../../hooks/useLocale";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TextInput } from "react-native-paper";

import InputField from "../../components/input/inputFields";
import PrimaryButton from "../../components/buttons/primaryButtons";
import PrimaryCard from "../../components/common/primaryCard";
import SectionTitle from "../../components/common/sectionTitle";

import useApp from "../../hooks/useApp";

import {
  ROUTES,
} from "../../constants/routes";

import {
  COLORS,
} from "../../design";

import styles from "./registerScreen.styles";

export default function RegisterScreen({
  navigation,
}) {
  const { t } = useTranslation();
  const { pick } = useLocale();

  const {
    signUp,
  } = useApp();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function isValidEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  async function handleRegister() {
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName || !cleanEmail || !password || !confirmPassword) {
      setError(t("auth.completeRequiredFields"));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError(pick("Introdu o adresă de email validă.", "Enter a valid email address."));
      return;
    }
    if (password.length < 8) {
      setError(pick("Parola trebuie să conțină cel puțin 8 caractere pentru backend-ul ResQKit.", "The password must contain at least 8 characters for the ResQKit backend."));
      return;
    }
    if (password !== confirmPassword) {
      setError(pick("Parolele introduse nu coincid.", "The passwords do not match."));
      return;
    }

    setError("");
    setLoading(true);
    try {
      await signUp({ email: cleanEmail, password, firstName: cleanFirstName, lastName: cleanLastName });
      navigation.reset({ index: 0, routes: [{ name: ROUTES.HOME }] });
    } catch (err) {
      setError(err?.message || pick("Contul nu a putut fi creat. Verifică backend-ul.", "The account could not be created. Check the backend."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="medical-bag"
              size={30}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.brand}>
            ResQKit
          </Text>
        </View>

        <Text style={styles.title}>
          {t("auth.createAccount")}
        </Text>

        <Text style={styles.subtitle}>
          {t("auth.registerSubtitle")}
        </Text>

        <PrimaryCard
          style={styles.card}
        >
          <SectionTitle>
            {t(
              "account.personalInformation"
            )}
          </SectionTitle>

          <View style={styles.input}>
            <InputField
              label={t(
                "account.firstName"
              )}
              value={firstName}
              onChangeText={
                setFirstName
              }
              autoCapitalize="words"
            />
          </View>

          <View style={styles.input}>
            <InputField
              label={t(
                "account.lastName"
              )}
              value={lastName}
              onChangeText={
                setLastName
              }
              autoCapitalize="words"
            />
          </View>

          <View style={styles.input}>
            <InputField
              label={t(
                "account.email"
              )}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon="email-outline"
                />
              }
            />
          </View>

          <View style={styles.input}>
            <InputField
              label={t(
                "account.password"
              )}
              value={password}
              onChangeText={
                setPassword
              }
              secureTextEntry={
                !showPassword
              }
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon="lock-outline"
                />
              }
              right={
                <TextInput.Icon
                  icon={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  onPress={() =>
                    setShowPassword(
                      current =>
                        !current
                    )
                  }
                />
              }
            />
          </View>

          <View style={styles.input}>
            <InputField
              label={pick("Confirmă parola", "Confirm password")}
              value={
                confirmPassword
              }
              onChangeText={
                setConfirmPassword
              }
              secureTextEntry={
                !showConfirmPassword
              }
              autoCapitalize="none"
              left={
                <TextInput.Icon
                  icon="lock-check-outline"
                />
              }
              right={
                <TextInput.Icon
                  icon={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  onPress={() =>
                    setShowConfirmPassword(
                      current =>
                        !current
                    )
                  }
                />
              }
            />
          </View>
        </PrimaryCard>

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        <View style={styles.button}>
          <PrimaryButton
            title={t(
              "auth.createAccount"
            )}
            onPress={
              handleRegister
            }
            loading={loading}
            disabled={loading}
          />
        </View>

        <View
          style={
            styles.loginContainer
          }
        >
          <Text
            style={styles.loginText}
          >
            {pick("Ai deja un cont?", "Already have an account?")}
          </Text>

          <Text
            style={styles.loginLink}
            onPress={() =>
              navigation.navigate(
                ROUTES.LOGIN
              )
            }
          >
            {" "}
            {pick("Autentifică-te", "Sign in")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}