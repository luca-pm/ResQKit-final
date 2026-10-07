import { apiRequest } from "./apiClient";
import { appendChatConversation } from "./storageService";

function isEnglish(language) {
  return String(language || "ro").toLowerCase().startsWith("en");
}

export async function sendAIMessage(messages, language = "ro") {
  const result = await apiRequest("/api/v1/resqkit/chat", {
    method: "POST",
    auth: false,
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  });

  return {
    reply:
      result?.reply ||
      result?.message ||
      result?.content ||
      (isEnglish(language)
        ? "No response was received from the assistant."
        : "Nu am primit un răspuns de la asistent."),
    raw: result,
  };
}

export async function saveAIConversation(
  messages,
  conversationId = null,
  language = "ro"
) {
  if (!messages?.length) return conversationId;

  const firstUser =
    messages.find((message) => message.role === "user")?.content ||
    (isEnglish(language) ? "AI conversation" : "Conversație AI");

  const id = conversationId || `chat-${Date.now()}`;

  await appendChatConversation({
    id,
    title: firstUser.slice(0, 70),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages,
  });

  return id;
}
