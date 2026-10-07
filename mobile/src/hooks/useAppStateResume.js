import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export default function useAppStateResume({ onResume, onSuspend } = {}) {
  const previous = useRef(AppState.currentState);
  const onResumeRef = useRef(onResume);
  const onSuspendRef = useRef(onSuspend);

  useEffect(() => {
    onResumeRef.current = onResume;
    onSuspendRef.current = onSuspend;
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      const wasActive = previous.current === "active";
      const isActive = next === "active";
      if (wasActive && !isActive) onSuspendRef.current?.();
      if (!wasActive && isActive) onResumeRef.current?.();
      previous.current = next;
    });

    return () => subscription.remove();
  }, []);
}
