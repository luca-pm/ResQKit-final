import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import AppScreenHeader from "../../components/common/appScreenHeader/appScreenHeader";
import PrimaryCard from "../../components/common/primaryCard";
import useApp from "../../hooks/useApp";
import useLocale from "../../hooks/useLocale";
import { createRegisteredKit, deleteRegisteredKit, listRegisteredKits, updateRegisteredKit } from "../../services/kitService";
import styles from "../emergency/emergencyScreen.styles";
import { COLORS } from "../../design";

const emptyForm = { label: "", kit_type: "vehicle", location_note: "", contents: "", missing_items: "" };

export default function RegisteredKitsScreen({ navigation }) {
  const { isLoggedIn } = useApp();
  const { pick } = useLocale();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try { setItems(await listRegisteredKits()); } catch (error) { Alert.alert(pick("Kituri", "Kits"), error.message); }
    finally { setLoading(false); }
  }, [isLoggedIn, pick]);

  useEffect(() => { void load(); }, [load]);

  async function save() {
    if (!form.label.trim() || !form.kit_type.trim()) return Alert.alert(pick("Date incomplete", "Incomplete information"), pick("Completează denumirea și tipul kitului.", "Enter the kit name and type."));
    const payload = { ...form, label: form.label.trim(), kit_type: form.kit_type.trim(), last_checked: new Date().toISOString() };
    setLoading(true);
    try {
      if (editingId) await updateRegisteredKit(editingId, payload);
      else await createRegisteredKit(payload);
      setEditingId(null); setForm(emptyForm); await load();
    } catch (error) { Alert.alert(pick("Salvare eșuată", "Save failed"), error.message); }
    finally { setLoading(false); }
  }

  function edit(item) {
    setEditingId(item.id);
    setForm({ label: item.label || "", kit_type: item.kit_type || "vehicle", location_note: item.location_note || "", contents: item.contents || "", missing_items: item.missing_items || "" });
  }

  async function remove(id) {
    try { await deleteRegisteredKit(id); await load(); } catch (error) { Alert.alert(pick("Ștergere eșuată", "Delete failed"), error.message); }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppScreenHeader title={pick("Kituri înregistrate", "Registered kits")} navigation={navigation} showMenu={false} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isLoggedIn ? (
          <PrimaryCard><Text style={styles.listTitle}>{pick("Autentificare necesară", "Sign-in required")}</Text><Text style={styles.listDescription}>{pick("CRUD-ul pentru kituri este stocat în backend și necesită cont.", "Registered kits are stored in the backend and require an account.")}</Text></PrimaryCard>
        ) : (
          <>
            <PrimaryCard style={{ marginBottom: 16 }}>
              <Text style={styles.sectionTitle}>{editingId ? pick("Editează kitul", "Edit kit") : pick("Adaugă kit", "Add kit")}</Text>
              <TextInput style={styles.input} mode="outlined" label={pick("Denumire", "Name")} value={form.label} onChangeText={(value) => setForm((prev) => ({ ...prev, label: value }))} />
              <TextInput style={styles.input} mode="outlined" label={pick("Tip", "Type")} value={form.kit_type} onChangeText={(value) => setForm((prev) => ({ ...prev, kit_type: value }))} />
              <TextInput style={styles.input} mode="outlined" label={pick("Locație", "Location")} value={form.location_note} onChangeText={(value) => setForm((prev) => ({ ...prev, location_note: value }))} />
              <TextInput style={styles.input} multiline mode="outlined" label={pick("Conținut", "Contents")} value={form.contents} onChangeText={(value) => setForm((prev) => ({ ...prev, contents: value }))} />
              <TextInput style={styles.input} multiline mode="outlined" label={pick("Elemente lipsă", "Missing items")} value={form.missing_items} onChangeText={(value) => setForm((prev) => ({ ...prev, missing_items: value }))} />
              <Button mode="contained" loading={loading} onPress={save}>{editingId ? pick("Salvează modificările", "Save changes") : pick("Adaugă", "Add")}</Button>
              {editingId ? <Button mode="text" onPress={() => { setEditingId(null); setForm(emptyForm); }}>{pick("Anulează editarea", "Cancel editing")}</Button> : null}
            </PrimaryCard>
            <Text style={styles.sectionTitle}>{pick("Kiturile mele", "My kits")}</Text>
            {items.map((item) => (
              <PrimaryCard key={item.id} style={{ marginBottom: 12 }}>
                <Text style={styles.listTitle}>{item.label}</Text>
                <Text style={styles.listDescription}>{item.kit_type} · {item.location_note || pick("fără locație", "no location")}</Text>
                <Text style={[styles.muted, { marginTop: 8 }]}>{pick("Conținut", "Contents")}: {item.contents || "—"}</Text>
                <Text style={styles.muted}>{pick("Lipsă", "Missing")}: {item.missing_items || "—"}</Text>
                <View style={[styles.row, { marginTop: 12 }]}><Button onPress={() => edit(item)}>{pick("Editează", "Edit")}</Button><Button textColor={COLORS.destructive} onPress={() => Alert.alert(pick("Ștergi kitul?", "Delete this kit?"), item.label, [{ text: pick("Anulează", "Cancel") }, { text: pick("Șterge", "Delete"), style: "destructive", onPress: () => remove(item.id) }])}>{pick("Șterge", "Delete")}</Button></View>
              </PrimaryCard>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
