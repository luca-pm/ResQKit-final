import { useState } from "react";
import { Alert, Linking, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import FloatingAIButton from "../../components/home/aiButton";
import PrimaryCard from "../../components/common/primaryCard";
import PrimaryButton from "../../components/buttons/primaryButtons";
import useLocale from "../../hooks/useLocale";
import { ROUTES } from "../../constants/routes";
import { COLORS } from "../../design";
import styles from "./contactScreen.styles";
import { openScreen } from "../../utils/navigation";

const SUPPORT_EMAIL = "support@resqkit.com";

export default function ContactScreen({ navigation }) {
  const { pick } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      return Alert.alert(pick("Câmpuri incomplete", "Incomplete fields"), pick("Completează subiectul și mesajul înainte de trimitere.", "Enter a subject and message before sending."));
    }
    const body = [message.trim(), "", name.trim() ? `${pick("Nume", "Name")}: ${name.trim()}` : "", email.trim() ? `Email: ${email.trim()}` : ""].filter(Boolean).join("\n");
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(pick("Email indisponibil", "Email unavailable"), pick(`Deschide manual aplicația de email și scrie la ${SUPPORT_EMAIL}.`, `Open your email app manually and write to ${SUPPORT_EMAIL}.`));
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title="Contact" navigation={navigation} onProfilePress={() => navigation.navigate(ROUTES.ACCOUNT)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.title}>{pick("Contactează echipa ResQKit", "Contact the ResQKit team")}</Text>
          <Text style={styles.description}>{pick("Mesajul se deschide în aplicația ta de email; backend-ul actual nu are endpoint pentru formular de contact.", "The message opens in your email app; the current backend does not provide a contact-form endpoint.")}</Text>
        </View>
        <PrimaryCard style={styles.infoCard}>
          <View style={styles.infoRow}><View style={styles.iconContainer}><MaterialCommunityIcons name="email-outline" size={22} color={COLORS.primary} /></View><View style={styles.infoContent}><Text style={styles.infoTitle}>{pick("Email suport", "Support email")}</Text><Text style={styles.infoValue} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}>{SUPPORT_EMAIL}</Text></View></View>
        </PrimaryCard>
        <Text style={styles.sectionTitle}>{pick("Trimite un mesaj", "Send a message")}</Text>
        <Text style={styles.label}>{pick("Nume", "Name")}</Text><TextInput value={name} onChangeText={setName} placeholder={pick("Nume Prenume", "Full name")} placeholderTextColor={COLORS.textSecondary} style={styles.input} />
        <Text style={styles.label}>Email</Text><TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" placeholderTextColor={COLORS.textSecondary} style={styles.input} />
        <Text style={styles.label}>{pick("Subiect", "Subject")}</Text><TextInput value={subject} onChangeText={setSubject} placeholder={pick("Subiect", "Subject")} placeholderTextColor={COLORS.textSecondary} style={styles.input} />
        <Text style={styles.label}>{pick("Mesaj", "Message")}</Text><TextInput value={message} onChangeText={setMessage} placeholder={pick("Scrie mesajul...", "Write your message...")} placeholderTextColor={COLORS.textSecondary} style={[styles.input, styles.messageInput]} multiline textAlignVertical="top" />
        <PrimaryButton title={pick("Deschide email", "Open email")} onPress={handleSend} />
        <Text style={styles.note}>{pick("Pentru situații de urgență, nu folosi formularul de contact. Apelează 112.", "For emergencies, do not use the contact form. Call 112.")}</Text>
      </ScrollView>
      <FloatingAIButton onPress={() => openScreen(navigation, ROUTES.AI)} />
    </SafeAreaView>
  );
}
