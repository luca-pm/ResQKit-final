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

import {
  getAppTutorialById,
} from "../../mock/appTutorials";
import useLocale from "../../hooks/useLocale";

import {
  ROUTES,
} from "../../constants/routes";

import {
  COLORS,
} from "../../design";

import styles from "./appGuideDetailScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function AppGuideDetailScreen({
  route,
  navigation,
}) {
  const { language, pick } = useLocale();

  const tutorialId =
    route?.params?.tutorialId;

  const tutorial =
    getAppTutorialById(
      tutorialId,
      language
    );

  if (!tutorial) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <AppScreenHeader
          title={pick("Tutorial", "Tutorial")}
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
            {pick("Tutorialul nu a fost găsit.", "Tutorial not found.")}
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
              styles.introHeader
            }
          >
            <View
              style={
                styles.iconContainer
              }
            >
              <MaterialCommunityIcons
                name={
                  tutorial.icon
                }
                size={30}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Text
              style={styles.title}
            >
              {tutorial.title}
            </Text>
          </View>

          <Text
            style={
              styles.description
            }
          >
            {tutorial.description}
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
      </ScrollView>

      <FloatingAIButton
        onPress={() =>
          openScreen(navigation, ROUTES.AI)
        }
      />
    </SafeAreaView>
  );
}