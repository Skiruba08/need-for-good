import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

export function PostComposerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={open} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.topRow}>
            <Text style={styles.title}>Share Your Journey 🌿</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.x}>✕</Text></TouchableOpacity>
          </View>

          <TextInput
            placeholder="Share your volunteer experience..."
            multiline
            style={styles.textarea}
          />

          <Text style={styles.section}>Privacy</Text>
          {["Public - Everyone can see", "Friends Only", "Volunteers Only", "Private - Only me"].map((t) => (
            <View key={t} style={styles.radioRow}>
              <View style={styles.radioDot} />
              <Text style={styles.radioText}>{t}</Text>
            </View>
          ))}

          <Text style={styles.section}>Share to Social Media</Text>
          {["Instagram", "Facebook", "TikTok", "LinkedIn"].map((t) => (
            <View key={t} style={styles.checkRow}>
              <View style={styles.checkbox} />
              <Text style={styles.radioText}>{t}</Text>
            </View>
          ))}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postBtn}>
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 18 },
  sheet: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 16 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "900", color: "#0E8F6C" },
  x: { fontSize: 18, color: "#666" },

  textarea: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#BFEBD9",
    borderRadius: 16,
    padding: 12,
    height: 110,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  section: { marginTop: 14, fontWeight: "900", color: "#333" },

  radioRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#0E8F6C" },
  radioText: { color: "#333" },

  checkRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  checkbox: { width: 14, height: 14, borderRadius: 4, borderWidth: 1, borderColor: "#AAA" },

  btnRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, borderWidth: 1, borderColor: "#CFEFE4", borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  cancelText: { fontWeight: "800", color: "#0E8F6C" },
  postBtn: { flex: 1, backgroundColor: "#0E8F6C", borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  postText: { fontWeight: "900", color: "white" },
});
