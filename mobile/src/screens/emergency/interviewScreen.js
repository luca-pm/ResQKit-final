import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ProgressBar, TextInput } from "react-native-paper";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import VoiceInput from "../../components/emergency/voiceInput";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { getInterviewPrompts, generateCEIM } from "../../services/ceimService";
import { appendSessionEvent } from "../../services/institutionalService";
import { speakText, stopSpeaking } from "../../services/ttsService";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./emergencyScreen.styles";

export default function InterviewScreen({ navigation, route }) {
  const fromGuide = Boolean(route?.params?.fromGuide);
  const { incident, updateIncident, settings, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const prompts = getInterviewPrompts(language);
  const savedIndex = Math.min(Number(incident?.interviewIndex || 0), Math.max(prompts.length - 1, 0));
  const [index, setIndex] = useState(savedIndex);
  const [answer, setAnswer] = useState(incident?.interviewDraft || "");
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState(false);

  const prompt = prompts[index];
  const progress = prompts.length ? (index + 1) / prompts.length : 0;
  const existing = useMemo(
    () => (incident?.interviewAnswers || []).find((item) => item.promptId === prompt?.id),
    [incident?.interviewAnswers, prompt?.id]
  );

  useEffect(() => {
    if (!prompt) return undefined;
    const existingText = existing?.answerText || incident?.interviewDraft || "";
    setAnswer(existingText);
    const timer = setTimeout(() => {
      setReading(true);
      void speakText(prompt.prompt, {
        language,
        rate: language === "en" ? 0.96 : 0.93,
        onDone: () => setReading(false),
        onError: () => setReading(false),
      });
    }, 300);
    return () => {
      clearTimeout(timer);
      void stopSpeaking();
    };
  }, [prompt?.id]);

  function persistDraft(value) {
    setAnswer(value);
    updateIncident({ interviewIndex: index, interviewDraft: value });
  }

  function saveCurrentAnswer() {
    if (!prompt) return [];
    const clean = answer.trim();
    const existingAnswers = incident?.interviewAnswers || [];
    const withoutCurrent = existingAnswers.filter((item) => item.promptId !== prompt.id);
    const nextAnswers = clean
      ? [...withoutCurrent, {
          promptId: prompt.id,
          promptText: prompt.prompt,
          answerText: clean,
          answeredAt: new Date().toISOString(),
        }]
      : withoutCurrent;
    updateIncident({ interviewAnswers: nextAnswers, interviewDraft: "" });
    return nextAnswers;
  }

  async function finishInterview(answersOverride = null) {
    if (!incident) return;
    const interviewAnswers = answersOverride || incident.interviewAnswers || [];
    const updated = { ...incident, interviewAnswers, interviewDraft: "", interviewIndex: prompts.length };
    updateIncident({ interviewAnswers, interviewDraft: "", interviewIndex: prompts.length });
    setLoading(true);
    await stopSpeaking();
    try {
      const result = await generateCEIM(updated);
      updateIncident({ ceimReport: result.ceim, ceimDegraded: Boolean(result.degraded), ceimGeneratedAt: new Date().toISOString() });
      if (settings.realDataMode && incident.backendSessionId) {
        await appendSessionEvent(incident.backendSessionId, "ceim_report_generated", { ceim: result.ceim, degraded: result.degraded });
        logInstitutional({ action: "ceim.generate", mode: "real", detail: pick("Raport CEIM generat și logat", "CEIM report generated and logged"), ok: true });
      } else {
        logInstitutional({ action: "ceim.generate", mode: "simulated", detail: pick("Raport CEIM generat; nu a fost trimis într-o sesiune instituțională", "CEIM report generated; it was not sent in an institutional session"), ok: true });
      }
      navigation.navigate(ROUTES.REPORT, { fromGuide });
    } catch (error) {
      Alert.alert(
        pick("Raport indisponibil", "Report unavailable"),
        error.message || pick("Nu s-a putut genera raportul. Poți continua la rezumatul determinist.", "The report could not be generated. You can continue to the deterministic summary.")
      );
      navigation.navigate(ROUTES.REPORT, { fromGuide });
    } finally {
      setLoading(false);
    }
  }

  function next() {
    const nextAnswers = saveCurrentAnswer();
    if (index >= prompts.length - 1) {
      void finishInterview(nextAnswers);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setAnswer("");
    updateIncident({ interviewIndex: nextIndex, interviewDraft: "" });
  }

  function skipQuestion() {
    if (index >= prompts.length - 1) {
      void finishInterview(incident?.interviewAnswers || []);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setAnswer("");
    updateIncident({ interviewIndex: nextIndex, interviewDraft: "" });
  }

  function previous() {
    if (index <= 0) return;
    const previousIndex = index - 1;
    const previousPrompt = prompts[previousIndex];
    const previousAnswer = (incident?.interviewAnswers || []).find((item) => item.promptId === previousPrompt.id)?.answerText || "";
    setIndex(previousIndex);
    setAnswer(previousAnswer);
    updateIncident({ interviewIndex: previousIndex, interviewDraft: previousAnswer });
  }

  function readQuestion() {
    if (!prompt) return;
    setReading(true);
    void speakText(prompt.prompt, {
      language,
      rate: language === "en" ? 0.96 : 0.93,
      onDone: () => setReading(false),
      onError: () => setReading(false),
    });
  }

  if (!prompt) {
    return (
      <SafeAreaView style={styles.container}>
        <EmergencyScreenHeader title={pick("Interviu pentru raport", "Report interview")} navigation={navigation} showMenu={false} showNotifications={false} />
        <View style={styles.content}>
          <Button mode="contained" onPress={() => finishInterview()}>{pick("Generează raportul", "Generate report")}</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Interviu pentru raport", "Report interview")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>{pick("Întrebare", "Question")} {index + 1}/{prompts.length}</Text>
          <Button compact icon={reading ? "stop-circle-outline" : "volume-high"} onPress={reading ? stopSpeaking : readQuestion}>
            {reading ? pick("Oprește", "Stop") : pick("Ascultă", "Listen")}
          </Button>
        </View>
        <ProgressBar progress={progress} color={COLORS.primary} style={{ height: 7, borderRadius: 6, marginBottom: 22 }} />

        <View style={styles.protocolCard}>
          <Text style={styles.protocolTitle}>{prompt.prompt}</Text>
          <Text style={styles.muted}>{pick("Răspunsul este opțional și nu schimbă protocolul medical. Este folosit doar pentru raportul CEIM.", "The answer is optional and does not change the medical protocol. It is used only for the CEIM report.")}</Text>
          <TextInput
            style={{ marginTop: 18 }}
            mode="outlined"
            multiline
            numberOfLines={5}
            value={answer}
            onChangeText={persistDraft}
            placeholder={pick("Scrie ce observi...", "Describe what you observe...")}
          />
          <View style={{ marginTop: 14 }}>
            <VoiceInput value={answer} onTranscript={persistDraft} disabled={loading} />
          </View>
        </View>

        <View style={styles.actions}>
          <Button mode="contained" loading={loading} disabled={loading} icon={index === prompts.length - 1 ? "file-document-check-outline" : "arrow-right"} onPress={next}>
            {index === prompts.length - 1 ? pick("Finalizează și generează CEIM", "Finish and generate CEIM") : pick("Salvează și continuă", "Save and continue")}
          </Button>
          <Button mode="outlined" disabled={loading} onPress={skipQuestion}>{pick("Sari peste întrebarea aceasta", "Skip this question")}</Button>
          {index > 0 ? <Button mode="text" disabled={loading} onPress={previous}>{pick("Înapoi la întrebarea anterioară", "Back to previous question")}</Button> : null}
          <Button mode="text" disabled={loading} onPress={() => navigation.navigate(ROUTES.REPORT, { fromGuide })}>{pick("Sari peste tot interviul", "Skip the whole interview")}</Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
