import {
  Pressable,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  useTranslation,
} from "react-i18next";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";

import {
  COLORS,
} from "../../design";

import styles from "./languageScreen.styles";

export default function LanguageScreen({
  navigation,
}) {
  const {
    t,
    i18n,
  } = useTranslation();

  const { updateSettings } = useApp();

  const currentLanguage = String(
    i18n.resolvedLanguage || i18n.language || "ro"
  ).toLowerCase().startsWith("en") ? "en" : "ro";

  function selectLanguage(
    language
  ) {
    i18n.changeLanguage(
      language
    );
    updateSettings({ uiLanguage: language });
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppScreenHeader
        title={t(
          "settings.language"
        )}
        navigation={
          navigation
        }
        showMenu={false}
      />

      <View
        style={styles.content}
      >
        <Text
          style={styles.subtitle}
        >
          {t(
            "settings.chooseLanguage"
          )}
        </Text>

        <PrimaryCard
          style={styles.card}
        >
          <Pressable
            style={
              styles.languageRow
            }
            onPress={() =>
              selectLanguage(
                "ro"
              )
            }
          >
            <View
              style={
                styles.languageInfo
              }
            >
              <Text
                style={
                  styles.language
                }
              >
                Română
              </Text>

              <Text
                style={
                  styles.languageCode
                }
              >
                RO
              </Text>
            </View>

            <MaterialCommunityIcons
              name={
                currentLanguage ===
                "ro"
                  ? "radiobox-marked"
                  : "radiobox-blank"
              }
              size={24}
              color={
                COLORS.primary
              }
            />
          </Pressable>

          <View
            style={styles.divider}
          />

          <Pressable
            style={
              styles.languageRow
            }
            onPress={() =>
              selectLanguage(
                "en"
              )
            }
          >
            <View
              style={
                styles.languageInfo
              }
            >
              <Text
                style={
                  styles.language
                }
              >
                English
              </Text>

              <Text
                style={
                  styles.languageCode
                }
              >
                EN
              </Text>
            </View>

            <MaterialCommunityIcons
              name={
                currentLanguage ===
                "en"
                  ? "radiobox-marked"
                  : "radiobox-blank"
              }
              size={24}
              color={
                COLORS.primary
              }
            />
          </Pressable>
        </PrimaryCard>
      </View>
    </SafeAreaView>
  );
}