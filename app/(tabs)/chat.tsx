import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#888" />
        <TextInput placeholder="Search messages..." style={{ flex: 1 }} />
      </View>

      <View style={styles.segment}>
        <View style={[styles.segmentBtn, styles.segmentActive]}>
          <Text style={styles.segmentActiveText}>Organizations</Text>
        </View>
        <View style={styles.segmentBtn}>
          <Text style={styles.segmentText}>Friends</Text>
        </View>
      </View>

      {/* TODO: list chats from Supabase */}
      <View style={styles.chatItem}>
        <View style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.chatName}>Charlotte Food Bank</Text>
          <Text style={styles.chatPreview}>Thank you for volunteering!</Text>
        </View>
        <Text style={styles.chatTime}>2h ago</Text>
        <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 18, paddingHorizontal: 16, backgroundColor: "#FBF3FF" },
  header: { fontSize: 22, fontWeight: "900", color: "#C14EF0" },

  searchWrap: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9C9FF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    gap: 8,
  },

  segment: { flexDirection: "row", marginTop: 14, backgroundColor: "white", borderRadius: 999, padding: 4 },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center" },
  segmentActive: { backgroundColor: "#C14EF0" },
  segmentActiveText: { color: "white", fontWeight: "900" },
  segmentText: { color: "#555", fontWeight: "700" },

  chatItem: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 18,
    padding: 12,
    gap: 12,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E2D6FF" },
  chatName: { fontWeight: "900", color: "#222" },
  chatPreview: { color: "#666", marginTop: 2 },
  chatTime: { color: "#777", fontSize: 12 },
  badge: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#C14EF0", alignItems: "center", justifyContent: "center" },
  badgeText: { color: "white", fontWeight: "900", fontSize: 12 },
});
