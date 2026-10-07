import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Chip } from "react-native-paper";
import Animated, { LinearTransition } from "react-native-reanimated";
import EmergencyScreenHeader from "../../components/emergency/emergencyScreenHeader/emergencyScreenHeader";
import Emergency112Banner from "../../components/emergency/emergency112Banner";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { rankVictims, urgencyLabel, victimUrgencyRank } from "../../utils/triage";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./emergencyScreen.styles";

const STATUS_LABELS = {
  pending: { ro: "Neînceput", en: "Not started" },
  in_progress: { ro: "În curs", en: "In progress" },
  done: { ro: "Gata", en: "Done" },
};

function FlagRow({ label, value, onChange, pick }) {
  const options = [
    { value: "", label: pick("Nu știu", "Not sure") },
    { value: "yes", label: pick("Da", "Yes") },
    { value: "no", label: pick("Nu", "No") },
  ];
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((opt) => (
          <Chip key={opt.value || "none"} selected={value === opt.value} showSelectedOverlay compact onPress={() => onChange(opt.value)}>
            {opt.label}
          </Chip>
        ))}
      </View>
    </View>
  );
}

export default function VictimsScreen({ navigation }) {
  const { incident, addVictim, updateVictim, updateIncident } = useApp();
  const { language, pick } = useLocale();
  const ranked = rankVictims(incident?.victims || []);

  function start(victim) {
    // Seed the triage multi-select from the quick flags if triage hasn't run yet.
    const injuries = victim.injuries?.length
      ? victim.injuries
      : [...(victim.chokingFlag === "yes" ? ["choking"] : []), ...(victim.bleedingFlag === "yes" ? ["bleeding"] : [])];
    updateIncident((base) => ({
      activeVictimId: victim.id,
      victims: base.victims.map((v) => v.id === victim.id
        ? { ...v, injuries, status: v.status === "pending" ? "in_progress" : v.status }
        : v),
    }));
    navigation.navigate(victim.ageProfile ? ROUTES.TRIAGE : ROUTES.AGE_SELECTION);
  }

  return (
    <SafeAreaView style={styles.container}>
      <EmergencyScreenHeader title={pick("Victime", "People")} navigation={navigation} showMenu={false} showNotifications={false} />
      <Emergency112Banner />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{pick("Cine are nevoie de ajutor?", "Who needs help?")}</Text>
        <Text style={styles.subtitle}>{pick("Mai multe persoane rănite? Adaugă-le pe fiecare cu o scurtă descriere. ResQKit le ordonează după urgență mai jos, fără AI, doar din răspunsurile tale, apoi alegi pe cine ajuți primul.", "More than one injured person? Add each one with a brief description. ResQKit ranks them by urgency below, with no AI, only from the answers you give here, then you pick who to help first.")}</Text>

        <View style={{ marginTop: 20 }}>
          {ranked.map((victim, index) => {
            const rank = victimUrgencyRank(victim);
            const done = victim.status === "done";
            // Only a breathing-critical victim gets red; rank 1-2 reads as amber.
            const severity = done ? "normal" : rank === 0 ? "critical" : rank <= 2 ? "warning" : "normal";
            const borderColor = severity === "critical" ? COLORS.error : severity === "warning" ? COLORS.warning : COLORS.border;
            const status = STATUS_LABELS[victim.status] || STATUS_LABELS.pending;
            return (
              <Animated.View key={victim.id} layout={LinearTransition.springify().damping(18).stiffness(160)}>
                <View style={[styles.card, { borderColor, borderWidth: severity === "normal" ? 1 : 2 }]}>
                  <View style={styles.row}>
                    <View style={[styles.badge, severity === "critical" && { backgroundColor: COLORS.emergencyTint }, severity === "warning" && { backgroundColor: COLORS.warningTint }]}>
                      <Text style={[styles.badgeText, severity === "critical" && { color: COLORS.emergencyTintForeground }, severity === "warning" && { color: COLORS.warningTintForeground }]}>
                        #{index + 1} · {urgencyLabel(rank, language)}
                      </Text>
                    </View>
                    <Text style={styles.listDescription}>{pick(status.ro, status.en)}</Text>
                  </View>
                  <TextInput
                    value={victim.label}
                    editable={!done}
                    multiline
                    onChangeText={(text) => updateVictim(victim.id, { label: text })}
                    placeholder={pick("Nume sau un reper rapid, ex. „șoferul”, „copilul din spate”", 'Name, or a quick identifier, e.g. "the driver", "child in the back seat"')}
                    placeholderTextColor={COLORS.textSecondary}
                    style={{ marginTop: 10, minHeight: 56, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 10, color: COLORS.text, textAlignVertical: "top" }}
                  />
                  {!done ? (
                    <>
                      <FlagRow pick={pick} label={pick("Respiră normal?", "Breathing normally?")} value={victim.breathing} onChange={(v) => updateVictim(victim.id, { breathing: v })} />
                      <FlagRow pick={pick} label={pick("Răspunde când îi vorbești?", "Responds to you?")} value={victim.responsive} onChange={(v) => updateVictim(victim.id, { responsive: v })} />
                      <FlagRow pick={pick} label={pick("Se sufocă sau nu poate respira?", "Choking or can't breathe?")} value={victim.chokingFlag} onChange={(v) => updateVictim(victim.id, { chokingFlag: v })} />
                      <FlagRow pick={pick} label={pick("Sângerare abundentă?", "Severe bleeding?")} value={victim.bleedingFlag} onChange={(v) => updateVictim(victim.id, { bleedingFlag: v })} />
                    </>
                  ) : null}
                  <Button style={{ marginTop: 12 }} mode={done ? "outlined" : "contained"} disabled={done} icon={done ? "check" : "arrow-right"} contentStyle={{ flexDirection: "row-reverse", minHeight: 48 }} onPress={() => start(victim)}>
                    {done
                      ? pick("Finalizat", "Completed")
                      : victim.status === "in_progress"
                        ? pick("Continuă cu această victimă", "Continue with this victim")
                        : pick("Începe cu această victimă", "Start with this victim")}
                  </Button>
                </View>
              </Animated.View>
            );
          })}
        </View>

        <Button mode="outlined" icon="account-plus" onPress={addVictim}>{pick("Adaugă încă o victimă", "Add another victim")}</Button>
        <Button style={{ marginTop: 12 }} mode="text" onPress={() => navigation.navigate(ROUTES.HANDOFF)}>{pick("Mergi la predarea informațiilor", "Go to handoff")}</Button>
      </ScrollView>
    </SafeAreaView>
  );
}
