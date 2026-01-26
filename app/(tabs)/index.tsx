import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PostComposerModal } from "../../src/components/PostComposerModal";

export default function FeedScreen() {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Do Good</Text>
        <TouchableOpacity style={styles.plusBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#888" />
        <TextInput placeholder="Search opportunities..." style={styles.searchInput} />
      </View>

      <View style={styles.chips}>
        <View style={[styles.chip, styles.chipActive]}><Text style={styles.chipActiveText}>All</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Public</Text></View>
        <View style={styles.chip}><Text style={styles.chipText}>Organizations</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* TODO: map posts from Supabase */}
        <View style={styles.postCard}>
          <Text style={styles.postTitle}>Sarah Johnson</Text>
          <Text style={styles.postBody}>Had an amazing time at the food bank today! 💜</Text>
          <View style={styles.postActions}>
            <Text>♡ 124</Text>
            <Text>💬 18</Text>
          </View>
        </View>
      </ScrollView>

      <PostComposerModal open={open} onClose={() => setOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 18, paddingHorizontal: 16, backgroundColor: "white" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  header: { fontSize: 22, fontWeight: "900", color: "#0E8F6C" },
  plusBtn: { width: 34, height: 34, borderRadius: 17, backgroundColor: "#0E8F6C", alignItems: "center", justifyContent: "center" },

  searchWrap: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFEFE4",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F6FBF8",
    gap: 8,
  },
  searchInput: { flex: 1 },

  chips: { flexDirection: "row", gap: 10, marginTop: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "#F2F2F2" },
  chipText: { color: "#444", fontWeight: "600" },
  chipActive: { backgroundColor: "#0E8F6C" },
  chipActiveText: { color: "white", fontWeight: "800" },

  postCard: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: "white",
    padding: 14,
    borderWidth: 1,
    borderColor: "#EDEDED",
  },
  postTitle: { fontWeight: "800" },
  postBody: { marginTop: 6, color: "#333" },
  postActions: { flexDirection: "row", gap: 18, marginTop: 10 },
});
