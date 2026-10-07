import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import CPRMetronome from "../../components/emergency/cprMetronome";
import useLocale from "../../hooks/useLocale";
import { getDynamicProtocolText, getProtocolNode, getSvbStart } from "../../data/protocols/protocolData";
import { speakText, stopSpeaking } from "../../services/ttsService";
import styles from "../emergency/emergencyScreen.styles";

export default function PracticeProtocolScreen({ navigation, route }) {
  const { language, pick } = useLocale();
  const ageProfile = route?.params?.ageProfile || "adult";
  const [nodeId, setNodeId] = useState(route?.params?.startNodeId || getSvbStart(ageProfile));
  const [finished, setFinished] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const node = getProtocolNode(nodeId, language);
  const text = node?.dynamicText ? getDynamicProtocolText(nodeId, ageProfile, language) : node?.text;

  useEffect(() => () => { void stopSpeaking(); }, []);

  function handleAction(action) {
    void stopSpeaking();
    setSpeaking(false);
    if (action.kind === "call112") {
      Alert.alert(
        pick("Mod de exersare", "Practice mode"),
        pick("Într-o intervenție reală, acest buton ar deschide apelul către 112. În modul de exersare nu inițiem apelul.", "In a real intervention, this button would open the 112 call. Practice mode does not initiate the call.")
      );
      return;
    }
    if (action.kind === "call112_handoff" || action.kind === "handoff") {
      setFinished(true);
      return;
    }
    if (action.kind === "svb") {
      setNodeId(getSvbStart(ageProfile));
      return;
    }
    if (action.next) setNodeId(action.next);
  }

  function readAloud() {
    const spoken = [node?.title, text, node?.warning, node?.note].filter(Boolean).join(". ");
    setSpeaking(true);
    void speakText(spoken, {
      language,
      rate: language === "en" ? 0.96 : 0.93,
      onDone: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <AppScreenHeader title={pick("Exersare", "Practice")} navigation={navigation} showMenu={false} />
        <View style={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.title}>{pick("Protocol exersat până la final", "Practice protocol completed")}</Text>
            <Text style={styles.subtitle}>{pick("Poți reveni la Ghiduri și alege altă situație.", "You can return to Guides and choose another situation.")}</Text>
          </View>
          <Button mode="contained" onPress={() => navigation.goBack()}>{pick("Înapoi la exersare", "Back to practice")}</Button>
        </View>
      </SafeAreaView>
    );
  }

  if (!node) {
    return (
      <SafeAreaView style={styles.container}>
        <AppScreenHeader title={pick("Exersare", "Practice")} navigation={navigation} showMenu={false} />
        <View style={styles.content}><Text style={styles.title}>{pick("Protocol indisponibil", "Protocol unavailable")}</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Exersare protocol", "Protocol practice")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.badge}><Text style={styles.badgeText}>{pick("MOD EXERSARE", "PRACTICE MODE")}</Text></View>
        <View style={[styles.protocolCard, { marginTop: 12 }]}>
          <Text style={styles.protocolTitle}>{node.title}</Text>
          <Text style={styles.protocolText}>{text}</Text>
          {node.warning ? <View style={styles.warningBox}><Text style={styles.warningText}>{node.warning}</Text></View> : null}
          {node.note ? <View style={styles.noteBox}><Text style={styles.noteText}>{node.note}</Text></View> : null}
          <Button mode="text" icon={speaking ? "stop-circle-outline" : "volume-high"} onPress={speaking ? () => { void stopSpeaking(); setSpeaking(false); } : readAloud}>
            {speaking ? pick("Oprește citirea", "Stop reading") : pick("Citește cu voce tare", "Read aloud")}
          </Button>
        </View>
        {node.cpr ? <CPRMetronome bpm={node.cpr.bpm} label={node.cpr.label} /> : null}
        <View style={styles.actions}>
          {node.actions.map((action, index) => (
            <Button key={`${action.label}-${index}`} mode={index === 0 ? "contained" : "outlined"} contentStyle={{ minHeight: 52 }} onPress={() => handleAction(action)}>
              {action.kind === "call112" ? `${action.label} · ${pick("simulare", "simulation")}` : action.label}
            </Button>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
