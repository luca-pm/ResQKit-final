import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  useAgent,
  useCopilotKit,
} from "@copilotkit/react-native/headless";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";

import AIEmptyState from "../../components/ai/aiEmptyState";

import AIMessageInput from "../../components/ai/aiMessageInput";

import AIChatBubble from "../../components/ai/aiChatBubble";
import AINavigationCard from "../../components/ai/aiNavigationCard/aiNavigationCard";

import QuickActionsSection from "../../sections/ai/quickActionSection";

import useLocale from "../../hooks/useLocale";
import useApp from "../../hooks/useApp";

import {
  saveAIConversation,
} from "../../services/aiService";

import { openScreen } from "../../utils/navigation";
import { COLORS } from "../../design";
import { resolveFastIntent } from "../../ai/fastIntentRouter";

import styles from "./aiScreen.styles";


export default function AIScreen({
  navigation,
}) {
  const {
    language,
    pick,
  } = useLocale();

  const {
    incident,
    aiNavigationAction,
    setAiNavigationAction,
    clearAiNavigationAction,
    aiConversationScope,
    setAiConversationScope,
  } = useApp();

  const scrollViewRef =
    useRef(null);

  const conversationIdRef =
    useRef(null);

  const [
    connectionError,
    setConnectionError,
  ] = useState(null);

  const [
    uiBusy,
    setUiBusy,
  ] = useState(false);

  // Not rendered anywhere — only read/written synchronously inside
  // processMessage, across possibly-queued sends. A ref (not state) so
  // each queued message sees the value the previous one just set, instead
  // of a stale one from before React re-renders.
  const pendingMedicalContextRef = useRef(null);

  const assistantCountAtSendRef = useRef(0);

  // uiBusy is React state, read from a stale closure until the next render
  // commits — two rapid taps (double-tap, or a second Quick Action before
  // the UI disables) can both pass the uiBusy check before either update
  // lands, both call copilotkit.runAgent on the same agent, and the server
  // throws "Thread already running" on the second one. This ref is set
  // synchronously, in the same tick, so a second call is blocked for real.
  const isSendingRef = useRef(false);

  // Messages sent while isSendingRef is true wait here instead of being
  // dropped or blocked — the user can keep typing/sending, and each one
  // runs in order once the one before it finishes. queuedCount is just
  // for the small "N mesaje în așteptare" note; the ref is the real queue.
  const messageQueueRef = useRef([]);
  const [queuedCount, setQueuedCount] = useState(0);

  // Always points at the latest processMessage (freshest agent/incident/
  // language closure) so a message popped off the queue after several
  // renders doesn't run against stale values from when it was queued.
  const processMessageRef = useRef(null);


  const {
    copilotkit,
  } = useCopilotKit();


  const {
    agent,
    isReady,
  } = useAgent({
    agentId: "default",
  });

  useEffect(() => {
    if (!isReady || !agent) return;

    const desiredScope = incident?.id
      ? `incident:${incident.id}`
      : "general";

    if (aiConversationScope !== desiredScope) {
      agent.setMessages([]);
      setAiConversationScope(desiredScope);
      clearAiNavigationAction();
      setConnectionError(null);
      setUiBusy(false);
      pendingMedicalContextRef.current = null;
      // A queued message belonged to the incident/scope that just ended —
      // sending it into the new scope would be talking about the wrong
      // session. isSendingRef is left alone: an in-flight request finishes
      // on its own rather than racing a new one for the same agent.
      messageQueueRef.current = [];
      setQueuedCount(0);
      conversationIdRef.current = null;
    }
  }, [
    isReady,
    agent,
    incident?.id,
    aiConversationScope,
    setAiConversationScope,
    clearAiNavigationAction,
  ]);


  const messages =
    useMemo(() => {
      if (!agent?.messages) {
        return [];
      }

      return agent.messages.flatMap(
        (
          message,
          index
        ) => {
          const visibleRole =
            message.role ===
              "user" ||
            message.role ===
              "assistant";

          const hasText =
            typeof message.content ===
              "string" &&
            message.content.trim();

          if (
            !visibleRole ||
            !hasText
          ) {
            return [];
          }

          return [
            {
              id:
                message.id ||
                `${message.role}-${index}`,

              role:
                message.role,

              content:
                message.content,
            },
          ];
        }
      );
    }, [
      agent?.messages,
    ]);


  const assistantMessageCount = useMemo(
    () => messages.filter((message) => message.role === "assistant").length,
    [messages]
  );

  const sending = uiBusy;



  useEffect(() => {
    if (
      !messages.length &&
      !connectionError
    ) {
      return undefined;
    }

    const timer =
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd(
          {
            animated: true,
          }
        );
      }, 100);

    return () =>
      clearTimeout(timer);
  }, [
    messages,
    sending,
    connectionError,
    aiNavigationAction,
  ]);


  useEffect(() => {
    if (
      sending ||
      !messages.length
    ) {
      return;
    }

    async function saveConversation() {
      try {
        conversationIdRef.current =
          await saveAIConversation(
            messages,
            conversationIdRef.current,
            language
          );
      } catch (error) {
        console.log(
          "AI conversation save error:",
          error
        );
      }
    }

    void saveConversation();
  }, [
    messages,
    sending,
    language,
  ]);


  // Processes exactly one message: fast-router first, then the agent run
  // if nothing matched. Always called either directly (nothing else was
  // running) or by the queue drain below (something just finished) — never
  // both at once, so this never overlaps itself.
  const processMessage =
    useCallback(
      async (cleanText) => {
        isSendingRef.current = true;

        try {
          setConnectionError(null);
          clearAiNavigationAction();

          const now = Date.now();

          const userMessage = {
            id: `user-${now}`,
            role: "user",
            content: cleanText,
          };

          // Fast deterministic path for obvious app intents and first-aid
          // routing. pendingMedicalContextRef keeps short follow-up answers
          // tied to the previous medical category (e.g. burn -> "more
          // extensive with blisters") so they cannot accidentally route to
          // another guide.
          const fastResult = resolveFastIntent({
            text: cleanText,
            language,
            incident,
            pendingMedicalContext: pendingMedicalContextRef.current,
          });

          if (fastResult) {
            const assistantMessage = {
              id: `assistant-local-${now}`,
              role: "assistant",
              content: fastResult.assistantText,
            };

            const currentMessages = Array.isArray(agent.messages)
              ? agent.messages
              : [];

            // Apply both messages atomically. This immediately leaves the
            // empty/quick-action state even when no LLM run is needed.
            agent.setMessages([
              ...currentMessages,
              userMessage,
              assistantMessage,
            ]);

            if (fastResult.navigationAction) {
              setAiNavigationAction(fastResult.navigationAction);
            }

            pendingMedicalContextRef.current = Object.prototype.hasOwnProperty.call(
              fastResult,
              "nextMedicalContext"
            )
              ? fastResult.nextMedicalContext
              : null;

            return;
          }

          // Anything nuanced still goes through CopilotKit + Llama.
          pendingMedicalContextRef.current = null;

          agent.addMessage(userMessage);

          assistantCountAtSendRef.current = assistantMessageCount;
          setUiBusy(true);

          try {
            await copilotkit.runAgent({
              agent,
            });
          } catch (error) {
            console.log(
              "ResQ AI error:",
              error
            );

            setConnectionError(
              pick(
                "Nu mă pot conecta momentan la ResQ AI. Verifică dacă serverul local și Ollama sunt pornite.",
                "I cannot connect to ResQ AI right now. Check that the local server and Ollama are running."
              )
            );
          } finally {
            setUiBusy(false);
          }
        } finally {
          isSendingRef.current = false;

          const next = messageQueueRef.current.shift();
          setQueuedCount(messageQueueRef.current.length);

          if (next !== undefined) {
            // Always the freshest closure, not this one — by the time a
            // queued message's turn comes, incident/language/agent may
            // have moved on to a new render.
            void processMessageRef.current?.(next);
          }
        }
      },
      [
        agent,
        copilotkit,
        pick,
        language,
        incident,
        setAiNavigationAction,
        clearAiNavigationAction,
        assistantMessageCount,
      ]
    );

  processMessageRef.current = processMessage;

  // Lightweight dispatcher: never awaits, never blocks the input. If
  // something is already running, the message just waits its turn.
  const handleSend = useCallback(
    (text) => {
      const cleanText = text?.trim();

      if (!cleanText || !isReady || !agent) {
        return;
      }

      if (isSendingRef.current) {
        messageQueueRef.current.push(cleanText);
        setQueuedCount(messageQueueRef.current.length);
        return;
      }

      void processMessageRef.current?.(cleanText);
    },
    [isReady, agent]
  );

  const handleNavigationAction = useCallback(() => {
    if (!aiNavigationAction) return;

    const target = aiNavigationAction.kind === "tab" ? aiNavigationAction.tab : aiNavigationAction.route;
    if (target) openScreen(navigation, target, aiNavigationAction.params);

    clearAiNavigationAction();
  }, [aiNavigationAction, navigation, clearAiNavigationAction]);

  const handleNewConversation = useCallback(() => {
    if (!agent) return;

    agent.setMessages([]);
    clearAiNavigationAction();
    setConnectionError(null);
    setUiBusy(false);
    pendingMedicalContextRef.current = null;
    messageQueueRef.current = [];
    setQueuedCount(0);
    conversationIdRef.current = null;
  }, [agent, clearAiNavigationAction]);


  return (
    <SafeAreaView
      style={
        styles.container
      }
    >
      <AppScreenHeader
        title={pick(
          "Asistent AI",
          "AI Assistant"
        )}
        navigation={
          navigation
        }
        showMenu={false}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <ScrollView
        ref={
          scrollViewRef
        }
        style={
          styles.scrollView
        }
        contentContainerStyle={[
          styles.content,

          messages.length ===
            0 &&
            !connectionError &&
            styles.emptyContent,
        ]}
        showsVerticalScrollIndicator={
          false
        }
        keyboardShouldPersistTaps="handled"
      >
        {messages.length > 0 ? (
          <View style={styles.newChatRow}>
            <TouchableOpacity
              style={styles.newChatButton}
              onPress={handleNewConversation}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.newChatText}>
                {pick("Conversație nouă", "New conversation")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {messages.length ===
          0 &&
        !connectionError ? (
          <>
            <AIEmptyState />

            <QuickActionsSection
              hasActiveIncident={Boolean(incident)}

              onStartEmergency={() =>
                handleSend(
                  pick(
                    "Vreau să încep o sesiune de urgență. Deschide ecranul de început al intervenției și lasă-mă pe mine să confirm pornirea sesiunii.",
                    "I want to start an emergency session. Open the intervention start screen and let me confirm starting the session."
                  )
                )
              }

              onContinueEmergency={() =>
                handleSend(
                  pick(
                    "Continuă sesiunea mea de urgență activă și deschide ecranul potrivit pentru starea curentă.",
                    "Continue my active emergency session and open the appropriate screen for its current state."
                  )
                )
              }

              onExplainCurrentStep={() =>
                handleSend(
                  pick(
                    "Explică-mi simplu pasul curent din protocolul sesiunii active. Folosește numai pasul determinist din ResQKit și nu marca nimic ca finalizat.",
                    "Explain the current step of the active session protocol in simple terms. Use only the deterministic ResQKit step and do not mark anything as completed."
                  )
                )
              }

              onAnalyzeWound={() =>
                handleSend(
                  pick(
                    "Vreau ajutor pentru evaluarea unei răni. Dacă este o urgență activă, spune-mi clar să apelez 112.",
                    "I want help assessing a wound. If this is an active emergency, clearly tell me to call 112."
                  )
                )
              }

              onFirstAid={() =>
                handleSend(
                  pick(
                    "Am nevoie de informații generale de prim ajutor.",
                    "I need general first-aid information."
                  )
                )
              }


              onAskQuestion={() =>
                handleSend(
                  pick(
                    "Ce este ResQKit și cu ce mă poate ajuta?",
                    "What is ResQKit and how can it help me?"
                  )
                )
              }
            />
          </>
        ) : (
          <>
            {messages.map(
              (message) => (
                <AIChatBubble
                  key={
                    message.id
                  }
                  role={
                    message.role
                  }
                  message={
                    message.content
                  }
                />
              )
            )}

            {connectionError ? (
              <AIChatBubble
                role="assistant"
                message={
                  connectionError
                }
              />
            ) : null}
          </>
        )}

        {aiNavigationAction ? (
          <AINavigationCard
            title={aiNavigationAction.title}
            description={aiNavigationAction.description}
            buttonLabel={aiNavigationAction.buttonLabel}
            onPress={handleNavigationAction}
          />
        ) : null}

        {sending &&
        assistantMessageCount <= assistantCountAtSendRef.current ? (
          <AIChatBubble
            role="assistant"
            message={pick(
              "Se generează răspunsul...",
              "Generating response..."
            )}
          />
        ) : null}
      </ScrollView>

      {queuedCount > 0 ? (
        <View style={styles.queuedRow}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color={COLORS.textSecondary}
          />
          <Text style={styles.queuedText}>
            {queuedCount === 1
              ? pick("1 mesaj în așteptare", "1 message waiting")
              : pick(`${queuedCount} mesaje în așteptare`, `${queuedCount} messages waiting`)}
          </Text>
        </View>
      ) : null}

      <AIMessageInput
        onSend={
          handleSend
        }

        onCameraPress={() =>
          Alert.alert(
            pick(
              "Cameră",
              "Camera"
            ),
            pick(
              "Analiza foto va fi conectată ulterior la ResQ AI.",
              "Photo analysis will be connected to ResQ AI later."
            )
          )
        }

        onAttachmentPress={() =>
          Alert.alert(
            pick(
              "Atașamente",
              "Attachments"
            ),
            pick(
              "Atașamentele vor fi conectate ulterior la ResQ AI.",
              "Attachments will be connected to ResQ AI later."
            )
          )
        }

        disabled={
          !isReady
        }
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}