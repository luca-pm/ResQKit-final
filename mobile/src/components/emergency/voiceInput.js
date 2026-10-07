import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { requireOptionalNativeModule } from "expo-modules-core";
import useLocale from "../../hooks/useLocale";
import { COLORS } from "../../design";
import styles from "./voiceInput.styles";

const SpeechRecognition = requireOptionalNativeModule("ExpoSpeechRecognition");

export default function VoiceInput({ value = "", onTranscript, disabled = false }) {
  const { language, pick } = useLocale();
  const locale = language === "en" ? "en-US" : "ro-RO";
  const [checking, setChecking] = useState(Boolean(SpeechRecognition));
  const [available, setAvailable] = useState(false);
  const [listening, setListening] = useState(false);
  const [modelMissing, setModelMissing] = useState(false);
  const committedRef = useRef(value);
  const valueRef = useRef(value);
  const lastEmittedRef = useRef("");

  const module = useMemo(() => SpeechRecognition, []);

  useEffect(() => {
    valueRef.current = value;
    if (value !== lastEmittedRef.current) committedRef.current = value;
  }, [value]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      if (!module) {
        setChecking(false);
        setAvailable(false);
        return;
      }
      try {
        const recognitionAvailable = typeof module.isRecognitionAvailable === "function"
          ? module.isRecognitionAvailable()
          : true;
        const onDevice = typeof module.supportsOnDeviceRecognition === "function"
          ? module.supportsOnDeviceRecognition()
          : true;
        if (!recognitionAvailable || !onDevice) {
          if (alive) setAvailable(false);
          return;
        }

        if (Platform.OS === "android" && typeof module.getSupportedLocales === "function") {
          const result = await module.getSupportedLocales({
            androidRecognitionServicePackage: "com.google.android.as",
          });
          const installed = result?.installedLocales || [];
          if (installed.length && !installed.includes(locale)) {
            if (alive) {
              setModelMissing(true);
              setAvailable(true);
            }
            return;
          }
        }
        if (alive) setAvailable(true);
      } catch {
        if (alive) setAvailable(false);
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => { alive = false; };
  }, [locale, module]);

  useEffect(() => {
    if (!module?.addListener) return undefined;
    const listeners = [
      module.addListener("start", () => {
        committedRef.current = valueRef.current;
        setListening(true);
      }),
      module.addListener("end", () => setListening(false)),
      module.addListener("result", (event) => {
        const transcript = event?.results?.[0]?.transcript;
        if (!transcript) return;
        let next;
        if (event.isFinal) {
          committedRef.current = committedRef.current
            ? `${committedRef.current} ${transcript}`
            : transcript;
          next = committedRef.current;
        } else {
          next = committedRef.current ? `${committedRef.current} ${transcript}` : transcript;
        }
        lastEmittedRef.current = next;
        onTranscript?.(next);
      }),
      module.addListener("error", () => setListening(false)),
    ];
    return () => {
      listeners.forEach((listener) => listener?.remove?.());
      try { module.abort?.(); } catch {}
    };
  }, [module, onTranscript]);

  async function downloadModel() {
    if (!module?.androidTriggerOfflineModelDownload) return;
    try {
      const result = await module.androidTriggerOfflineModelDownload({ locale });
      if (result?.status === "download_success") setModelMissing(false);
    } catch {}
  }

  async function toggle() {
    if (!module || disabled) return;
    if (listening) {
      module.stop?.();
      return;
    }
    if (modelMissing) {
      await downloadModel();
      return;
    }
    try {
      const permission = await module.requestPermissionsAsync?.();
      if (permission && permission.granted === false) return;
      module.start?.({
        lang: locale,
        interimResults: true,
        continuous: true,
        requiresOnDeviceRecognition: true,
        ...(Platform.OS === "android"
          ? { androidIntentOptions: { EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 5000 } }
          : {}),
      });
    } catch {
      setListening(false);
    }
  }

  if (checking) {
    return <ActivityIndicator size="small" color={COLORS.primary} />;
  }

  if (!module || !available) {
    return (
      <View>
        <View style={[styles.button, styles.unavailable]}>
          <MaterialCommunityIcons name="microphone-off" size={18} color={COLORS.textSecondary} />
          <Text style={styles.text}>{pick("Răspuns vocal", "Voice answer")}</Text>
        </View>
        <Text style={styles.hint}>{pick("Recunoașterea vocală necesită un Development Build cu modulul nativ expo-speech-recognition.", "Voice recognition requires a Development Build with the native expo-speech-recognition module.")}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={toggle}
      disabled={disabled}
      style={[styles.button, listening && styles.listening]}
      accessibilityRole="button"
      accessibilityLabel={listening ? pick("Oprește răspunsul vocal", "Stop voice input") : pick("Răspunde vocal", "Answer by voice")}
    >
      {listening ? (
        <ActivityIndicator size="small" color={COLORS.error} />
      ) : (
        <MaterialCommunityIcons name={modelMissing ? "microphone-off" : "microphone"} size={18} color={COLORS.text} />
      )}
      <Text style={[styles.text, listening && styles.listeningText]}>
        {listening
          ? pick("Ascult... apasă pentru oprire", "Listening… tap to stop")
          : modelMissing
            ? pick("Descarcă modelul vocal", "Download voice model")
            : pick("Răspunde vocal", "Answer by voice")}
      </Text>
    </Pressable>
  );
}
