import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Checkbox, IconButton, ProgressBar } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { TRIAGE_INJURIES } from "../../utils/triage";
import { getActiveVictim, goToProtocolStage } from "../../utils/emergencyFlow";
import { getCprStart, getSituationStart, routeSituation } from "../../data/protocols/protocolData";
import { logTriageAnswer } from "../../services/institutionalActions";
import { speakText, stopSpeaking } from "../../services/ttsService";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./emergencyScreen.styles";

const STEP_COUNT = 3;

// Don't re-ask what the victim card already answered.
function firstUnansweredStep(victim) {
  if (!victim?.responsive) return 0;
  if (!victim?.breathing) return 1;
  return 2;
}

export default function TriageScreen({ navigation }) {
  const { incident, updateIncident, updateActiveVictim, settings, logInstitutional } = useApp();
  const { language, pick } = useLocale();
  const active = getActiveVictim(incident);
  const [step, setStep] = useState(() => firstUnansweredStep(active));
  const options = useMemo(() => TRIAGE_INJURIES.map((item) => ({ ...item, label: language === "en" ? item.en : item.ro })), [language]);
  const injuries = active?.injuries || [];
  const cprFastPath = active?.breathing === "no";

  const onSession = (id, code) => updateIncident({ backendSessionId: id, sessionCode: code });

  const questions = [
    { title: pick("Victima răspunde când o strigi și o atingi ușor?", "Do they respond when you shout and tap them?") },
    { title: pick("Respiră normal?", "Are they breathing normally?"), subtitle: pick("Gâfâitul ocazional NU este respirație normală.", "Occasional gasping is NOT normal breathing.") },
    { title: pick("Ce observi?", "What do you see?"), subtitle: pick("Alege tot ce se potrivește, pot fi mai multe.", "Pick everything that applies, there can be more than one.") },
  ];
  const cprText = pick("Nu respiră înseamnă resuscitare acum. Sari peste restul întrebărilor.", "Not breathing means CPR now. Skip the rest of the questions.");
  const current = questions[step];
  const spoken = cprFastPath ? cprText : [current.title, current.subtitle].filter(Boolean).join(". ");

  // A bystander's hands and eyes are on the injured person, not the phone.
  useEffect(() => {
    void speakText(spoken, { language });
    return () => { void stopSpeaking(); };
  }, [spoken, language]);

  function answer(field, value) {
    updateActiveVictim({ [field]: value, triageUpdatedAt: new Date().toISOString() });
    void logTriageAnswer(incident, settings.realDataMode, field, value, logInstitutional, onSession);
    if (!(field === "breathing" && value === "no")) setStep((s) => s + 1);
  }

  function toggleInjury(value) {
    let next;
    if (value === "unknown") next = injuries.includes("unknown") ? [] : ["unknown"];
    else {
      const withoutUnknown = injuries.filter((item) => item !== "unknown");
      next = withoutUnknown.includes(value) ? withoutUnknown.filter((item) => item !== value) : [...withoutUnknown, value];
    }
    updateActiveVictim({ injuries: next });
  }

  function finish(finalInjuries = injuries) {
    const victim = { ...active, injuries: finalInjuries };
    const patch = {
      injuries: finalInjuries,
      chokingFlag: finalInjuries.includes("choking") ? "yes" : active.chokingFlag,
      bleedingFlag: finalInjuries.includes("bleeding") ? "yes" : active.bleedingFlag,
      triageUpdatedAt: new Date().toISOString(),
    };
    const situation = routeSituation(victim, incident?.context);
    if (!situation) {
      updateActiveVictim(patch);
      navigation.replace(ROUTES.SITUATION_SELECTION);
      return;
    }
    updateActiveVictim({ ...patch, situation, protocolNodeId: getSituationStart(situation, active.ageProfile || "adult"), status: "in_progress" });
    goToProtocolStage(navigation, incident);
  }

  function startCpr() {
    // Time to first compression outranks the safety/kit screens (zip's fast path).
    updateActiveVictim({ situation: "svb", protocolNodeId: getCprStart(active?.ageProfile || "adult"), status: "in_progress" });
    navigation.replace(ROUTES.PROTOCOL);
  }

  const choice = (field, value, label, danger = false) => {
    const selected = active?.[field] === value;
    return (
      <Button
        key={value}
        mode={selected ? "contained" : "outlined"}
        buttonColor={selected && danger ? COLORS.error : undefined}
        style={{ flex: 1 }}
        contentStyle={{ minHeight: 52 }}
        onPress={() => answer(field, value)}
      >
        {label}
      </Button>
    );
  };

  const nav = (onBack, onSkip) => (
    <View style={[styles.row, { marginTop: 16 }]}>
      {onBack ? <Button mode="text" onPress={onBack}>{pick("← Înapoi", "← Back")}</Button> : <View />}
      {onSkip ? <Button mode="text" textColor={COLORS.textSecondary} onPress={onSkip}>{pick("Nu știu / Sari →", "Don't know / Skip →")}</Button> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Triaj rapid", "Quick triage")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content}>
        {cprFastPath ? (
          <View style={[styles.protocolCard, { borderColor: COLORS.error, borderWidth: 2 }]}>
            <View style={styles.rowStart}>
              <MaterialCommunityIcons name="shield-alert" size={18} color={COLORS.error} />
              <Text style={[styles.dangerText, { flex: 1, fontSize: 16 }]}>{cprText}</Text>
            </View>
            <View style={styles.actions}>
              <Button mode="contained" buttonColor={COLORS.error} icon="heart-pulse" contentStyle={{ minHeight: 56 }} onPress={startCpr}>
                {pick("Pornește ghidarea pentru resuscitare", "Start CPR guidance")}
              </Button>
              <Button mode="outlined" onPress={() => { updateActiveVictim({ breathing: "" }); setStep(1); }}>
                {pick("De fapt, vreau să verific din nou", "Actually, let me re-check that answer")}
              </Button>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>{pick("Întrebarea", "Question")} {step + 1}/{STEP_COUNT}</Text>
            <ProgressBar progress={(step + 1) / STEP_COUNT} color={COLORS.primary} style={{ height: 7, borderRadius: 6, marginBottom: 22 }} />
            <View style={[styles.row, { alignItems: "flex-start" }]}>
              <Text style={[styles.title, { flex: 1, textAlign: "left" }]}>{current.title}</Text>
              <IconButton icon="volume-high" size={22} iconColor={COLORS.textSecondary} accessibilityLabel={pick("Citește din nou întrebarea", "Read question aloud again")} onPress={() => speakText(spoken, { language })} />
            </View>
            {current.subtitle ? <Text style={[styles.subtitle, { textAlign: "left" }]}>{current.subtitle}</Text> : null}

            {step === 0 ? (
              <>
                <View style={[styles.row, { marginTop: 24 }]}>
                  {choice("responsive", "yes", pick("Da", "Yes"))}
                  {choice("responsive", "no", pick("Nu", "No"), true)}
                  {choice("responsive", "unsure", pick("Nu știu", "Unsure"))}
                </View>
                {nav(null, () => answer("responsive", "unsure"))}
              </>
            ) : null}

            {step === 1 ? (
              <>
                <View style={[styles.row, { marginTop: 24 }]}>
                  {choice("breathing", "yes", pick("Da", "Yes"))}
                  {choice("breathing", "no", pick("Nu", "No"), true)}
                  {choice("breathing", "unsure", pick("Nu știu", "Unsure"))}
                </View>
                {nav(() => setStep(0), () => answer("breathing", "unsure"))}
              </>
            ) : null}

            {step === 2 ? (
              <>
                <View style={{ marginTop: 20 }}>
                  {options.map((option) => {
                    const checked = injuries.includes(option.id);
                    return (
                      <View key={option.id} style={[styles.card, { flexDirection: "row", alignItems: "center", paddingVertical: 8 }, checked && { borderColor: COLORS.primary }]}>
                        <Checkbox status={checked ? "checked" : "unchecked"} onPress={() => toggleInjury(option.id)} />
                        <Text style={[styles.value, { flex: 1 }]} onPress={() => toggleInjury(option.id)}>{option.label}</Text>
                      </View>
                    );
                  })}
                </View>
                <Button mode="contained" icon="arrow-right" contentStyle={{ minHeight: 52, flexDirection: "row-reverse" }} disabled={!injuries.length} onPress={() => finish()}>
                  {pick("Mai departe", "Next")}
                </Button>
                {nav(() => setStep(1), () => finish(["unknown"]))}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
