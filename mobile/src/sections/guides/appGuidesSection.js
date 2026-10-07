import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import GuideCard from "../../components/guides/guideCard";

import { appGuides } from "../../mock/guides";

import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";

import styles from "./appGuidesSection.styles";

export default function AppGuidesSection({
  search = "",
}) {
  const navigation = useNavigation();

  const { t } = useTranslation();

  const query = search
    .trim()
    .toLocaleLowerCase();

  const guides = (
    Array.isArray(appGuides)
      ? appGuides
      : []
  )
    .map((guide) => ({
      ...guide,

      translatedTitle: t(
        guide.titleKey
      ),
    }))
    .filter((guide) =>
      query
        ? guide.translatedTitle
            .toLocaleLowerCase()
            .includes(query)
        : true
    );

  return (
    <View style={styles.container}>
      {guides.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            {
              color:
                COLORS.textSecondary,
            },
          ]}
        >
          {t("guides.noResults")}
        </Text>
      ) : (
        guides.map((guide) => (
          <GuideCard
            key={guide.id}
            title={
              guide.translatedTitle
            }
            icon={guide.icon}
            onPress={() =>
              navigation.navigate(
                ROUTES.APP_GUIDE_DETAIL,
                {
                  tutorialId:
                    guide.id,
                }
              )
            }
          />
        ))
      )}
    </View>
  );
}