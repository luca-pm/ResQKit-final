import {
  useEffect,
  useState,
} from "react";

import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import FloatingAIButton from "../../components/home/aiButton";

import SearchSection from "../../sections/home/searchSection";

import GuideTypeSwitcher from "../../components/guides/guideSwitcher";

import WoundGuidesSection from "../../sections/guides/woundGuidesSection";
import AppGuidesSection from "../../sections/guides/appGuidesSection";

import { ROUTES } from "../../constants/routes";

import styles from "./guidesScreen.styles";
import { openScreen } from "../../utils/navigation";

export default function GuidesScreen({
  navigation,
  route,
}) {
  const [search, setSearch] = useState(route?.params?.search || "");

  const [guideType, setGuideType] =
    useState(
      route?.params?.guideType || "wounds"
    );

  const { t } = useTranslation();

  useEffect(() => {
    if (route?.params?.guideType) {
      setGuideType(
        route.params.guideType
      );
    }
  }, [route?.params?.guideType]);

  useEffect(() => {
    if (typeof route?.params?.search === "string") {
      setSearch(route.params.search);
    }
  }, [route?.params?.search]);

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader
        title={t("guides.title")}
        navigation={navigation}
        onProfilePress={() =>
          navigation.navigate(ROUTES.ACCOUNT)
        }
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SearchSection
          search={search}
          setSearch={setSearch}
        />

        <GuideTypeSwitcher
          selected={guideType}
          onChange={setGuideType}
        />

        {guideType === "wounds" ? (
          <WoundGuidesSection
            search={search}
          />
        ) : (
          <AppGuidesSection
            search={search}
          />
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