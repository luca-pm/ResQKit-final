import { useState } from "react";

import {
  Pressable,
  Text,
  View,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../design";

import styles from "./faqItem.styles";

export default function FAQItem({
  question,
  answer,
}) {
  const [expanded, setExpanded] =
    useState(false);

  return (
    <View style={styles.card}>
      <Pressable
        style={styles.header}
        onPress={() =>
          setExpanded((current) => !current)
        }
      >
        <Text style={styles.question}>
          {question}
        </Text>

        <MaterialCommunityIcons
          name={
            expanded
              ? "chevron-up"
              : "chevron-down"
          }
          size={24}
          color={COLORS.primary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
}