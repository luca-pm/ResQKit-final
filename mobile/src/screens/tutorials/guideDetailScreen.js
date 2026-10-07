import {
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import FloatingAIButton from "../../components/home/aiButton";
import PrimaryCard from "../../components/common/primaryCard";
import SeverityBadge from "../../components/guides/severityBadge";

import {
  getTutorialById,
} from "../../mock/tutorials";
import useLocale from "../../hooks/useLocale";

import {
  ROUTES,
} from "../../constants/routes";

import {
  COLORS,
} from "../../design";

import styles from "./guideDetailScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function GuideDetailScreen({
  route,
  navigation,
}) {
  const { language, pick } = useLocale();

  const tutorialId =
    route?.params?.tutorialId;

  const tutorial =
    getTutorialById(
      tutorialId,
      language
    );

  if (!tutorial) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <AppScreenHeader
          title={pick("Ghid", "Guide")}
          navigation={navigation}
          showMenu={false}
        />

        <View
          style={
            styles.notFoundContainer
          }
        >
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={42}
            color={
              COLORS.textSecondary
            }
          />

          <Text
            style={styles.notFound}
          >
            {pick("Ghidul nu a fost găsit.", "Guide not found.")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppScreenHeader
        title={tutorial.title}
        navigation={navigation}
        showMenu={false}
        onProfilePress={() =>
          navigation.navigate(
            ROUTES.ACCOUNT
          )
        }
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <PrimaryCard
          style={styles.card}
        >
          <View
            style={
              styles.headerRow
            }
          >
            <SeverityBadge
              severity={
                tutorial.severity
              }
            />

            <View
              style={
                styles.durationContainer
              }
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={15}
                color={
                  COLORS.textSecondary
                }
              />

              <Text
                style={
                  styles.duration
                }
              >
                {
                  tutorial.duration
                }
              </Text>
            </View>
          </View>

          <Text
            style={
              styles.description
            }
          >
            {
              tutorial.description
            }
          </Text>
        </PrimaryCard>

        <PrimaryCard
          style={styles.card}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            {pick("Pași", "Steps")}
          </Text>

          {(tutorial.steps || []).map(
            (step, index) => (
              <View
                key={`${tutorial.id}-${index}`}
                style={styles.step}
              >
                <View
                  style={
                    styles.stepNumber
                  }
                >
                  <Text
                    style={
                      styles.stepNumberText
                    }
                  >
                    {index + 1}
                  </Text>
                </View>

                <Text
                  style={
                    styles.stepText
                  }
                >
                  {step}
                </Text>
              </View>
            )
          )}
        </PrimaryCard>

        {tutorial.severity ===
          "high" && (
          <PrimaryCard
            style={
              styles.emergencyCard
            }
          >
            <View
              style={
                styles.emergencyHeader
              }
            >
              <MaterialCommunityIcons
                name="alert-outline"
                size={22}
                color={
                  COLORS.error
                }
              />

              <Text
                style={
                  styles.emergencyTitle
                }
              >
                {pick("Situație de urgență", "Emergency situation")}
              </Text>
            </View>

            <Text
              style={
                styles.emergencyText
              }
            >
              {pick("Dacă persoana este în pericol imediat, starea acesteia se agravează sau situația nu poate fi controlată în siguranță, apelează serviciile de urgență la 112.", "If the person is in immediate danger, their condition worsens, or the situation cannot be managed safely, call emergency services at 112.")}
            </Text>
          </PrimaryCard>
        )}
      </ScrollView>

      <FloatingAIButton
        onPress={() =>
          openScreen(navigation, ROUTES.AI)
        }
      />
    </SafeAreaView>
  );
}