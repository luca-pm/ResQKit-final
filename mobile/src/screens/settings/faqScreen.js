import { useMemo, useState } from "react";

import {
  FlatList,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import FloatingAIButton from "../../components/home/aiButton";
import FAQItem from "../../components/faq/faqItem";

import { getFaqItems } from "../../mock/faq";
import useLocale from "../../hooks/useLocale";

import { ROUTES } from "../../constants/routes";

import { COLORS } from "../../design";

import styles from "./faqScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function FAQScreen({
  navigation,
}) {
  const [search, setSearch] =
    useState("");

  const { language, pick } = useLocale();
  const faqItems = getFaqItems(language);

  const filteredFAQ = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return faqItems;
    }

    return faqItems.filter((item) => {
      const question =
        item.question.toLowerCase();

      const answer =
        item.answer.toLowerCase();

      return (
        question.includes(query) ||
        answer.includes(query)
      );
    });
  }, [faqItems, search]);

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader
        title="FAQ"
        navigation={navigation}
        onProfilePress={() =>
          navigation.navigate(
            ROUTES.ACCOUNT
          )
        }
      />

      <FlatList
        data={filteredFAQ}
        keyExtractor={(item) =>
          item.id
        }
        renderItem={({ item }) => (
          <FAQItem
            question={item.question}
            answer={item.answer}
          />
        )}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View style={styles.intro}>
              <Text style={styles.title}>
                {pick("Întrebări frecvente", "Frequently asked questions")}
              </Text>

              <Text
                style={styles.description}
              >
                {pick("Găsește rapid răspunsuri despre aplicația ResQKit.", "Quickly find answers about the ResQKit app.")}
              </Text>
            </View>

            <View
              style={styles.searchContainer}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={22}
                color={
                  COLORS.textSecondary
                }
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder={pick("Caută o întrebare...", "Search a question...")}
                placeholderTextColor={
                  COLORS.textSecondary
                }
                style={styles.searchInput}
              />

              {search.length > 0 && (
                <MaterialCommunityIcons
                  name="close-circle"
                  size={20}
                  color={
                    COLORS.textSecondary
                  }
                  onPress={() =>
                    setSearch("")
                  }
                />
              )}
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={42}
              color={COLORS.primary}
            />

            <Text
              style={styles.emptyTitle}
            >
              {pick("Nu am găsit rezultate", "No results found")}
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              {pick("Încearcă o altă expresie de căutare.", "Try a different search phrase.")}
            </Text>
          </View>
        }
      />

      <FloatingAIButton
        onPress={() =>
          openScreen(navigation, ROUTES.AI)
        }
      />
    </SafeAreaView>
  );
}