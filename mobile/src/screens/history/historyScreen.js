import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import HistorySwitcher from "../../components/history/historySwitcher";
import HistoryItem from "../../components/history/historyItem";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { listArchivedIncidents } from "../../services/incidentService";
import { getJSON, STORAGE_KEYS } from "../../services/storageService";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import { formatRetentionRemaining } from "../../utils/retention";
import styles from "./historyScreen.styles";

export default function HistoryScreen({ navigation }) {
  const { retainedIncidents, institutionalLog, isLoggedIn } = useApp();
  const { locale, language, pick } = useLocale();
  const [historyType, setHistoryType] = useState("interventions");
  const [archived, setArchived] = useState([]);
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const dt = useCallback((value) => {
    const date = value ? new Date(value) : new Date();
    return {
      date: date.toLocaleDateString(locale),
      time: date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
    };
  }, [locale]);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const localChats = await getJSON(STORAGE_KEYS.chatHistory, []);
      setChats(localChats || []);
      if (isLoggedIn) {
        try { setArchived(await listArchivedIncidents()); } catch { setArchived([]); }
      } else setArchived([]);
    } finally { setRefreshing(false); }
  }, [isLoggedIn]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const interventions = useMemo(() => {
    const local = retainedIncidents.map((entry) => {
      const when = dt(entry.closedAt || entry.incident?.startedAt);
      const count = entry.incident?.victims?.length || 1;
      return {
        id: `local:${entry.id}`,
        rawId: entry.id,
        source: "local",
        type: "intervention",
        title: pick("Intervenție locală", "Local intervention"),
        ...when,
        description: pick(`${count} victimă(e) · retenție ${entry.retention}`, `${count} person(s) · retention ${entry.retention}`),
        status: formatRetentionRemaining(entry.expiresAt, language) || pick("Pe dispozitiv", "On device"),
        details: [
          entry.expiresAt ? `${pick("Ștergere automată", "Automatic deletion")}: ${formatRetentionRemaining(entry.expiresAt, language)}` : null,
          ...(entry.incident?.victims || []).map((v) => `${v.label || pick(`Victima ${v.number || ""}`, `Person ${v.number || ""}`)}: ${v.situation || pick("situație neprecizată", "unspecified situation")}`),
        ].filter(Boolean),
      };
    });
    const remote = archived.map((entry) => {
      const when = dt(entry.occurred_at || entry.created_at);
      return {
        id: `backend:${entry.id}`,
        rawId: String(entry.id),
        source: "backend",
        type: "intervention",
        title: entry.context_type ? pick(`Incident: ${entry.context_type}`, `Incident: ${entry.context_type}`) : pick("Incident arhivat", "Archived incident"),
        ...when,
        description: entry.location_summary || pick(`Victime: ${entry.victim_count || 1}`, `People: ${entry.victim_count || 1}`),
        status: "Backend",
        details: [
          entry.called_112 ? `112: ${entry.called_112}` : null,
          entry.procedure_id ? `${pick("Protocol", "Protocol")}: ${entry.procedure_id}` : null,
        ].filter(Boolean),
      };
    });
    return [...local, ...remote];
  }, [archived, retainedIncidents, dt, language, pick]);

  const operators = useMemo(() => institutionalLog.slice().reverse().map((entry) => ({
    id: entry.id,
    type: "operator",
    title: `${entry.action} · ${entry.mode}`,
    ...dt(entry.at),
    description: entry.detail,
    status: entry.ok ? "OK" : pick("Eroare", "Error"),
  })), [institutionalLog, dt, pick]);

  const aiItems = useMemo(() => chats.map((chat) => ({
    id: chat.id,
    type: "ai",
    title: chat.title || pick("Conversație AI", "AI conversation"),
    ...dt(chat.updatedAt || chat.createdAt),
    description: pick(`${chat.messages?.length || 0} mesaje`, `${chat.messages?.length || 0} messages`),
    details: (chat.messages || []).slice(-2).map((m) => `${m.role === "user" ? pick("Tu", "You") : "AI"}: ${m.content}`),
  })), [chats, dt, pick]);

  const history = historyType === "operators" ? operators : historyType === "ai" ? aiItems : interventions;

  const sectionInfo = historyType === "operators"
    ? { title: pick("Date trimise / acțiuni instituționale", "Sent data / institutional actions"), description: pick("Jurnal local al acțiunilor simulate sau trimise backend-ului ResQKit.", "Local log of actions simulated or sent to the ResQKit backend."), empty: pick("Nu există acțiuni înregistrate.", "No recorded actions."), icon: "account-voice" }
    : historyType === "ai"
      ? { title: pick("Conversații AI", "AI conversations"), description: pick("Istoricul local al conversațiilor cu ResQKit AI.", "Local history of conversations with ResQKit AI."), empty: pick("Nu există conversații AI.", "No AI conversations."), icon: "robot-outline" }
      : { title: pick("Istoric intervenții", "Intervention history"), description: pick("Incidente păstrate local și, când ești autentificat, incidentele arhivate în backend.", "Incidents retained locally and, when signed in, incidents archived in the backend."), empty: pick("Nu există intervenții.", "No interventions."), icon: "car-emergency" };

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Istoric", "History")} navigation={navigation} onProfilePress={() => navigation.navigate(ROUTES.ACCOUNT_TAB)} />
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryItem item={item} onPress={item.type === "intervention" ? () => navigation.navigate(ROUTES.INCIDENT_DETAIL, { source: item.source, id: item.rawId }) : undefined} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, history.length === 0 && styles.emptyContent]}
        ListHeaderComponent={<><HistorySwitcher selected={historyType} onChange={setHistoryType} /><View style={styles.intro}><Text style={styles.introTitle}>{sectionInfo.title}</Text><Text style={styles.introDescription}>{sectionInfo.description}</Text></View></>}
        ListEmptyComponent={<View style={styles.emptyContainer}><View style={styles.emptyIcon}><MaterialCommunityIcons name={sectionInfo.icon} size={34} color={COLORS.primary} /></View><Text style={styles.emptyTitle}>{sectionInfo.empty}</Text></View>}
      />
    </SafeAreaView>
  );
}
