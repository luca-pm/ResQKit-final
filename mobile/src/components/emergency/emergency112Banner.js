import { Alert, Linking, Text, View } from "react-native";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { COLORS } from "../../design";
import styles from "./emergency112Banner.styles";

export default function Emergency112Banner({ compact = false }) {
  const { incident, updateIncident } = useApp();
  const { pick } = useLocale();

  if (!incident || incident.called112 === "called" || incident.called112 === "already_called") {
    return null;
  }

  async function callNow() {
    updateIncident({ called112: "called", called112At: new Date().toISOString() });
    try {
      await Linking.openURL("tel:112");
    } catch {
      Alert.alert(
        pick("Sună la 112", "Call 112"),
        pick("Telefonul nu a putut porni apelul automat. Apelează manual 112.", "The phone could not start the call automatically. Dial 112 manually.")
      );
    }
  }

  function confirmAlreadyCalled() {
    updateIncident({ called112: "already_called", called112At: new Date().toISOString() });
  }

  return (
    <View style={[styles.container, compact && { marginHorizontal: 0, marginTop: 0 }]}> 
      <View style={styles.row}>
        <MaterialCommunityIcons name="phone-alert" size={22} color={COLORS.error} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{pick("Apelul la 112 nu este confirmat", "112 call not confirmed")}</Text>
          <Text style={styles.text}>{pick("Într-o urgență, anunță 112 înainte sau concomitent cu primul ajutor și urmează indicațiile dispeceratului.", "In an emergency, call 112 before or while giving first aid and follow the dispatcher's instructions.")}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button style={styles.action} mode="contained" buttonColor={COLORS.error} icon="phone" onPress={callNow}>
          {pick("Sună la 112", "Call 112")}
        </Button>
        <Button style={styles.action} mode="outlined" onPress={confirmAlreadyCalled}>
          {pick("A fost deja apelat", "Already called")}
        </Button>
      </View>
    </View>
  );
}
