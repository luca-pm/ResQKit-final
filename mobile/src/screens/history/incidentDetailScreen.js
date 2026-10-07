import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useAgentContext } from "@copilotkit/react-native/headless";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import FloatingAIButton from "../../components/home/aiButton";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { formatRetentionRemaining } from "../../utils/retention";
import {
  deleteArchivedIncident,
  getArchivedIncident,
} from "../../services/incidentService";
import { buildIncidentBrief } from "../../services/briefService";
import { ROUTES } from "../../constants/routes";
import styles from "../emergency/emergencyScreen.styles";
import { openScreen } from "../../utils/navigation";
import { COLORS } from "../../design";

export default function IncidentDetailScreen({ navigation, route }) {
  const { retainedIncidents, deleteRetained } = useApp();
  const { language, pick } = useLocale();
  const { source = "local", id } = route.params || {};
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const value =
          source === "local"
            ? retainedIncidents.find((item) => item.id === id)
            : await getArchivedIncident(id);
        if (alive) setRecord(value || null);
      } catch (error) {
        Alert.alert(pick("Incident", "Incident"), error.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, retainedIncidents, source, pick]);

  async function remove() {
    try {
      if (source === "local") await deleteRetained(id);
      else await deleteArchivedIncident(id);
      navigation.goBack();
    } catch (error) {
      Alert.alert(pick("Ștergere eșuată", "Delete failed"), error.message);
    }
  }

  const display = source === "local" ? record?.incident : record;

  const aiHistoryContext = useMemo(() => {
    if (!display) {
      return {
        available: false,
        source,
        id: id || null,
      };
    }

    if (source === "local") {
      return {
        available: true,
        source: "local",
        id: display.id || id || null,
        brief: buildIncidentBrief(
          display,
          {},
          false,
          language,
          { includeReporter: false }
        ),
        rule:
          "Rezumatul este determinist și nu conține date medicale din profil. AI-ul îl poate reformula, dar nu poate adăuga fapte.",
      };
    }

    return {
      available: true,
      source: "backend",
      id: display.id || id || null,
      occurredAt: display.occurred_at || null,
      contextType: display.context_type || null,
      victimCount: display.victim_count || null,
      called112: display.called_112 || null,
      procedureId: display.procedure_id || null,
      brief: display.brief_text || null,
      rule:
        "Folosește numai câmpurile furnizate. Nu inventa detalii care nu apar în incidentul arhivat.",
    };
  }, [display, id, language, source]);

  useAgentContext({
    description:
      "Incidentul istoric deschis în ecranul Detalii incident. Folosește-l numai când utilizatorul întreabă despre incidentul istoric vizibil acum și nu adăuga fapte lipsă.",
    value: aiHistoryContext,
  });

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader
        title={pick("Detalii incident", "Incident details")}
        navigation={navigation}
        showMenu={false}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={styles.muted}>{pick("Se încarcă...", "Loading...")}</Text>
        ) : !display ? (
          <Text style={styles.title}>
            {pick(
              "Incidentul nu mai este disponibil.",
              "This incident is no longer available."
            )}
          </Text>
        ) : (
          <>
            {source === "local" && record?.expiresAt ? (
              <PrimaryCard style={{ marginBottom: 16 }}>
                <Text style={styles.sectionTitle}>
                  {pick("Retenție locală", "Local retention")}
                </Text>
                <Text style={styles.value}>
                  {formatRetentionRemaining(record.expiresAt, language)}
                </Text>
                <Text style={[styles.muted, { marginTop: 6 }]}>
                  {pick(
                    "După expirare, copia locală este ștearsă automat.",
                    "After expiry, the local copy is deleted automatically."
                  )}
                </Text>
              </PrimaryCard>
            ) : null}
            <PrimaryCard>
              <Text selectable style={styles.code}>
                {JSON.stringify(display, null, 2)}
              </Text>
            </PrimaryCard>
          </>
        )}
        {display ? (
          <Button
            style={{ marginTop: 16 }}
            mode="outlined"
            textColor={COLORS.destructive}
            onPress={() =>
              Alert.alert(
                pick("Ștergi incidentul?", "Delete this incident?"),
                pick(
                  "Această acțiune nu poate fi anulată.",
                  "This action cannot be undone."
                ),
                [
                  { text: pick("Anulează", "Cancel") },
                  {
                    text: pick("Șterge", "Delete"),
                    style: "destructive",
                    onPress: remove,
                  },
                ]
              )
            }
          >
            {pick("Șterge incidentul", "Delete incident")}
          </Button>
        ) : null}
      </ScrollView>

      {display ? (
        <FloatingAIButton onPress={() => openScreen(navigation, ROUTES.AI)} />
      ) : null}
    </SafeAreaView>
  );
}
