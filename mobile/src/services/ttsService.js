import { Platform } from "react-native";
import * as Speech from "expo-speech";
import { speechLanguageFromLanguage } from "../hooks/useLocale";

function baseLanguage(tag) {
  return String(tag || "").toLowerCase().split("-")[0];
}

export async function stopSpeaking() {
  try {
    await Speech.stop();
  } catch {
    // Stopping an idle synthesizer is safe.
  }
}

export async function speakText(
  text,
  {
    language = "ro",
    rate = 0.93,
    onStart,
    onDone,
    onError,
  } = {}
) {
  const cleanText = String(text || "").trim();
  if (!cleanText) return false;

  const languageTag = speechLanguageFromLanguage(language);

  try {
    await stopSpeaking();

    Speech.speak(cleanText, {
      language: languageTag,
      rate,
      pitch: 1,
      volume: 1,
      // On iOS this lets the system manage the speech audio session itself.
      ...(Platform.OS === "ios" ? { useApplicationAudioSession: false } : {}),
      onStart: () => onStart?.(),
      onDone: () => onDone?.(),
      onStopped: () => onDone?.(),
      onError: (error) => onError?.(error),
    });

    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
}

export async function getSpeechDiagnostics(language = "ro") {
  const languageTag = speechLanguageFromLanguage(language);

  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const matching = (voices || []).filter(
      (voice) => baseLanguage(voice.language) === baseLanguage(languageTag)
    );

    return {
      languageTag,
      totalVoices: Array.isArray(voices) ? voices.length : 0,
      matchingVoices: matching.length,
      voice: matching[0]?.identifier || null,
      isSpeaking: await Speech.isSpeakingAsync(),
    };
  } catch (error) {
    return {
      languageTag,
      totalVoices: 0,
      matchingVoices: 0,
      voice: null,
      isSpeaking: false,
      error: error?.message || String(error),
    };
  }
}
