import { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useLocale from "../../hooks/useLocale";
import useAppStateResume from "../../hooks/useAppStateResume";
import { COLORS } from "../../design";
import styles from "./cprMetronome.styles";

const CLICK = require("../../assets/metronome-click.wav");

export default function CPRMetronome({ bpm = 110, label = "RCP" }) {
  const { pick } = useLocale();
  const player = useAudioPlayer(CLICK);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);
  const [wasInterrupted, setWasInterrupted] = useState(false);
  const timerRef = useRef(null);
  const wasRunningBeforeSuspend = useRef(false);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  }, []);

  const tick = useCallback(() => {
    setCount((value) => value + 1);
    try {
      void player.seekTo(0);
      player.play();
    } catch {}
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, [player]);

  const start = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setWasInterrupted(false);
    tick();
    timerRef.current = setInterval(tick, Math.round(60000 / bpm));
    setRunning(true);
  }, [bpm, tick]);

  useAppStateResume({
    onSuspend: () => {
      wasRunningBeforeSuspend.current = Boolean(timerRef.current);
      stop();
    },
    onResume: () => {
      if (wasRunningBeforeSuspend.current) {
        wasRunningBeforeSuspend.current = false;
        setWasInterrupted(true);
      }
    },
  });

  useEffect(() => stop, [stop]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.pulse}><MaterialCommunityIcons name="heart-pulse" size={34} color={COLORS.error} /></View>
        <View style={styles.textWrap}><Text style={styles.title}>{pick("Metronom RCP", "CPR metronome")}</Text><Text style={styles.subtitle}>{bpm} BPM · {label}</Text></View>
        <Text style={styles.count}>{count || "—"}</Text>
      </View>

      {wasInterrupted ? (
        <View style={{ marginBottom: 12, padding: 12, borderRadius: 10, backgroundColor: COLORS.warningTint, borderWidth: 1, borderColor: COLORS.warning }}>
          <Text style={{ color: COLORS.text, fontWeight: "700" }}>{pick("Metronomul a fost oprit când aplicația a ieșit în fundal.", "The metronome was stopped when the app went to the background.")}</Text>
          <Text style={{ marginTop: 4, color: COLORS.textSecondary, lineHeight: 18 }}>{pick("Repornește ritmul manual când ești pregătit. Nu îl reluăm automat pentru a evita un ritm decalibrat după revenirea din apelul 112.", "Restart the beat manually when ready. It is not resumed automatically to avoid a drifted rhythm after returning from the 112 call.")}</Text>
        </View>
      ) : null}

      <Button mode={running ? "outlined" : "contained"} onPress={running ? stop : start}>{running ? pick("Oprește metronomul", "Stop metronome") : pick("Pornește metronomul", "Start metronome")}</Button>
      <Text style={styles.note}>{pick("Click audio + vibrație la fiecare bătaie. La ieșirea din aplicație, ritmul se oprește în siguranță și trebuie repornit manual la revenire.", "Audio click + vibration on every beat. When the app leaves the foreground, the beat stops safely and must be restarted manually when you return.")}</Text>
    </View>
  );
}
