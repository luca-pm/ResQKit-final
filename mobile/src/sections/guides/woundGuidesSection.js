import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import GuideCard from "../../components/guides/guideCard";
import { woundGuides } from "../../mock/guides";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./woundGuidesSection.styles";

export default function WoundGuidesSection({ search = "" }) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const query = search.trim().toLocaleLowerCase();

  const guides = (Array.isArray(woundGuides) ? woundGuides : [])
    .map((guide) => ({
      ...guide,
      translatedTitle: t(guide.titleKey),
    }))
    .filter((guide) =>
      query
        ? guide.translatedTitle.toLocaleLowerCase().includes(query)
        : true
    );

  return (
    <View style={styles.container}>
      <GuideCard
        title={t("guides.practiceProtocols", { defaultValue: "Exersează protocoalele de urgență" })}
        icon="school-outline"
        onPress={() => navigation.navigate(ROUTES.PRACTICE_HOME)}
      />

      {guides.length === 0 ? (
        <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
          {t("guides.noResults")}
        </Text>
      ) : (
        guides.map((guide) => (
          <GuideCard
            key={guide.id}
            title={guide.translatedTitle}
            icon={guide.icon}
            onPress={() =>
              navigation.navigate(ROUTES.GUIDE_CATEGORY, {
                categoryId: guide.id,
                categoryTitle: guide.translatedTitle,
              })
            }
          />
        ))
      )}
    </View>
  );
}
