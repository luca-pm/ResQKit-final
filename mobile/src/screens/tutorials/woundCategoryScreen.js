import {
  Pressable,
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
  getTutorialsByCategory,
} from "../../mock/tutorials";
import useLocale from "../../hooks/useLocale";

import {
  ROUTES,
} from "../../constants/routes";

import {
  COLORS,
} from "../../design";

import styles from "./woundCategoryScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function WoundCategoryScreen({
  route,
  navigation,
}) {
  const { language, pick } = useLocale();

  const {
    categoryId,
    categoryTitle,
  } = route?.params || {};

  const tutorials =
    getTutorialsByCategory(
      categoryId,
      language
    );

  return (
    <SafeAreaView
      style={styles.container}
    >
      <AppScreenHeader
        title={
          categoryTitle ||
          pick("Ghiduri", "Guides")
        }
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
        {tutorials.length === 0 ? (
          <View
            style={
              styles.emptyContainer
            }
          >
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={42}
              color={
                COLORS.textSecondary
              }
            />

            <Text
              style={styles.empty}
            >
              {pick("Nu există încă ghiduri pentru această categorie.", "There are no guides in this category yet.")}
            </Text>
          </View>
        ) : (
          tutorials.map(
            (tutorial) => (
              <Pressable
                key={tutorial.id}
                onPress={() =>
                  navigation.navigate(
                    ROUTES.GUIDE_DETAIL,
                    {
                      tutorialId:
                        tutorial.id,
                    }
                  )
                }
              >
                <PrimaryCard
                  style={styles.card}
                >
                  <View
                    style={
                      styles.topRow
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

                  <View
                    style={
                      styles.titleRow
                    }
                  >
                    <Text
                      style={
                        styles.title
                      }
                    >
                      {
                        tutorial.title
                      }
                    </Text>

                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color={
                        COLORS.textSecondary
                      }
                    />
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
              </Pressable>
            )
          )
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