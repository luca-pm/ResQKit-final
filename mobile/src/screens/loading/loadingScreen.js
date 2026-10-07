import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./loadingScreen.styles";

export default function LoadingScreen({ navigation }) {
  const { authReady, appReady } = useApp();
  const { pick } = useLocale();

  useEffect(() => {
    if (!authReady || !appReady) return undefined;

    const timer = setTimeout(() => {
      navigation.replace(ROUTES.HOME);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigation, authReady, appReady]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons
            name="medical-bag"
            size={42}
            color={COLORS.primary}
          />
        </View>
        <Text style={styles.title}>ResQKit</Text>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>
          {pick("Pregătim aplicația...", "Preparing the app...")}
        </Text>
        <Text style={styles.description}>
          {pick(
            "Verificăm sesiunea, contul și datele locale.",
            "Checking your session, account, and local data."
          )}
        </Text>
      </View>
    </SafeAreaView>
  );
}
