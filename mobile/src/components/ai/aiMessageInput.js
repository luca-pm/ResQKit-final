import {
  useState,
} from "react";

import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import {
  useTranslation,
} from "react-i18next";

import {
  COLORS,
} from "../../design";

import styles from "./aiMessageInput.styles";

export default function AIMessageInput({
  onSend,
  onCameraPress,
  onAttachmentPress,
  disabled = false,
}) {
  const [message, setMessage] =
    useState("");

  const { t } =
    useTranslation();

  function handleSend() {
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage ||
      disabled
    ) {
      return;
    }

    onSend?.(
      trimmedMessage
    );

    setMessage("");
  }

  const canSend =
    message.trim().length > 0 &&
    !disabled;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          style={
            styles.actionButton
          }
          onPress={
            onAttachmentPress
          }
          disabled={disabled}
        >
          <MaterialCommunityIcons
            name="paperclip"
            size={23}
            color={
              COLORS.textSecondary
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={
            styles.actionButton
          }
          onPress={
            onCameraPress
          }
          disabled={disabled}
        >
          <MaterialCommunityIcons
            name="camera-outline"
            size={23}
            color={
              COLORS.textSecondary
            }
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder={t(
            "ai.messagePlaceholder"
          )}
          placeholderTextColor={
            COLORS.textSecondary
          }
          value={message}
          onChangeText={
            setMessage
          }
          multiline
          editable={!disabled}
          returnKeyType="send"
          blurOnSubmit={false}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            !canSend &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <MaterialCommunityIcons
            name="send"
            size={21}
            color={
              COLORS.white
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}