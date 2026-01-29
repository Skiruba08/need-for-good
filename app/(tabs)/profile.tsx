import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { supabase } from "../../src/lib/supabase";

type SavedItem = {
  id: string; // MUST match map opportunity id: o1,o2,o3,o4
  title: string;
  location: string;
  date: string;
  category: "Food" | "Environment" | "Animals" | "Community" | "Health" | "Education";
};

type ProfileModel = {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  tagline?: string;
  stats?: { friends: number; hours: number; posts: number };
  connected?: string[];
  saved?: SavedItem[];
  completed?: SavedItem[];
};

function badgeColor(cat: SavedItem["category"]) {
  switch (cat) {
    case "Food":
      return "#F97316";
    case "Environment":
    case "Animals":
    case "Community":
    case "Health":
    case "Education":
    default:
      return "#0A7A5A";
  }
}

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId?: string }>();
  const [meEmail, setMeEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<"Saved" | "Completed">("Saved");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setMeEmail(data.user?.email ?? null);
    });
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
  }

  // Fake friend profiles for now
  const friendsDb: ProfileModel[] = useMemo(
    () => [
      {
        id: "f1",
        name: "Sarah Johnson",
        avatar: "https://i.pravatar.cc/150?img=32",
        email: "sarah@example.com",
        tagline: "Helping paws & people 🐾",
        stats: { friends: 120, hours: 14, posts: 7 },
        connected: ["Instagram", "Facebook", "LinkedIn"],
        saved: [
          { id: "o2", title: "Animal Shelter", location: "Charlotte, NC", date: "Jan 12, 2025", category: "Animals" },
        ],
        completed: [
          { id: "o3", title: "Community Garden", location: "Charlotte, NC", date: "Dec 10, 2024", category: "Environment" },
        ],
      },
      {
        id: "f2",
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?img=12",
        email: "michael@example.com",
        tagline: "Clean streets, clean mind ✨",
        stats: { friends: 88, hours: 22, posts: 10 },
        connected: ["Instagram", "LinkedIn"],
        saved: [
          { id: "o4", title: "Beach Cleanup", location: "Charlotte, NC", date: "Jan 5, 2025", category: "Environment" },
        ],
        completed: [
          { id: "o1", title: "Charlotte Food Bank", location: "Charlotte, NC", date: "Nov 21, 2024", category: "Food" },
        ],
      },
      {
        id: "f3",
        name: "Emily Davis",
        avatar: "https://i.pravatar.cc/150?img=47",
        email: "emily@example.com",
        tagline: "Making a difference 🌿",
        stats: { friends: 145, hours: 18, posts: 12 },
        connected: ["Instagram", "Facebook", "LinkedIn"],
        saved: [
          { id: "o1", title: "Charlotte Food Bank", location: "Charlotte, NC", date: "Dec 28, 2024", category: "Food" },
          { id: "o4", title: "Beach Cleanup", location: "Charlotte, NC", date: "Jan 5, 2025", category: "Environment" },
          { id: "o2", title: "Animal Shelter", location: "Charlotte, NC", date: "Jan 12, 2025", category: "Animals" },
        ],
        completed: [
          { id: "o3", title: "Community Garden", location: "Charlotte, NC", date: "Dec 2, 2024", category: "Community" },
        ],
      },
    ],
    []
  );

  // Logged-in user mock
  const myProfile: ProfileModel = useMemo(
    () => ({
      id: "me",
      name: "natalie",
      avatar: "https://i.pravatar.cc/150?img=5",
      email: meEmail ?? "",
      tagline: "Making a difference 🌿",
      stats: { friends: 145, hours: 18, posts: 12 },
      connected: ["Instagram", "Facebook", "LinkedIn"],
      saved: [
        { id: "o1", title: "Charlotte Food Bank", location: "Charlotte, NC", date: "Dec 28, 2024", category: "Food" },
        { id: "o4", title: "Beach Cleanup Event", location: "Charlotte, NC", date: "Jan 5, 2025", category: "Environment" },
        { id: "o2", title: "Animal Shelter Help", location: "Charlotte, NC", date: "Jan 12, 2025", category: "Animals" },
      ],
      completed: [
        { id: "o3", title: "Community Garden", location: "Charlotte, NC", date: "Dec 2, 2024", category: "Community" },
      ],
    }),
    [meEmail]
  );

  const friend = useMemo(() => {
    if (!userId) return null;
    return friendsDb.find((f) => f.id === userId) ?? null;
  }, [userId, friendsDb]);

  const showing = friend ?? myProfile;
  const listData = tab === "Saved" ? showing.saved ?? [] : showing.completed ?? [];

  function openOnMap(opportunityId: string) {
    router.replace({ pathname: "/(tabs)/map", params: { oppId: opportunityId } });
  }

  return (
    <View style={styles.page}>
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          {/* ✅ Back goes to Map */}
          <Pressable onPress={() => router.replace("/(tabs)/map")} style={styles.iconBtn} hitSlop={10}>
            <Text style={styles.iconTxt}>‹</Text>
          </Pressable>

          <View style={{ flex: 1 }} />

          <Pressable onPress={() => alert("Settings (later)")} style={styles.iconBtn} hitSlop={10}>
            <Text style={styles.iconSmall}>⚙</Text>
          </Pressable>

          <Pressable onPress={logout} style={styles.iconBtn} hitSlop={10}>
            <Text style={styles.iconSmall}>⇢</Text>
          </Pressable>
        </View>

        <Text style={styles.headerTitle}>Profile</Text>

        <Image source={{ uri: showing.avatar }} style={styles.avatar} />
        <Text style={styles.username}>{showing.name}</Text>
        {!!showing.email && <Text style={styles.email}>{showing.email}</Text>}
        {!!showing.tagline && <Text style={styles.tagline}>{showing.tagline}</Text>}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{showing.stats?.friends ?? 0}</Text>
            <Text style={styles.statLbl}>Friends</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{showing.stats?.hours ?? 0}</Text>
            <Text style={styles.statLbl}>Hours</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{showing.stats?.posts ?? 0}</Text>
            <Text style={styles.statLbl}>Posts</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 26 }}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          <View style={styles.chipsRow}>
            {(showing.connected ?? []).map((c) => (
              <View key={c} style={styles.accountChip}>
                <Text style={styles.accountChipTxt}>{c}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.segmentWrap}>
          <Pressable
            onPress={() => setTab("Saved")}
            style={[styles.segmentBtn, tab === "Saved" && styles.segmentActive]}
          >
            <Text style={[styles.segmentTxt, tab === "Saved" && styles.segmentTxtActive]}>Saved</Text>
          </Pressable>

          <Pressable
            onPress={() => setTab("Completed")}
            style={[styles.segmentBtn, tab === "Completed" && styles.segmentActive]}
          >
            <Text style={[styles.segmentTxt, tab === "Completed" && styles.segmentTxtActive]}>Completed</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          {listData.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => openOnMap(item.id)}
              style={styles.itemCard}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={styles.itemMetaRow}>
                  <Text style={styles.itemMeta}>📍 {item.location}</Text>
                  <Text style={styles.itemMeta}>🕒 {item.date}</Text>
                </View>
              </View>

              <View style={[styles.badge, { backgroundColor: badgeColor(item.category) }]}>
                <Text style={styles.badgeTxt}>{item.category}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7F4EA" },

  headerCard: {
    backgroundColor: "#0A7A5A",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },

  headerTopRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  iconTxt: { color: "white", fontSize: 28, fontWeight: "900", marginTop: -2 },
  iconSmall: { color: "white", fontSize: 18, fontWeight: "900" },

  headerTitle: { color: "white", fontSize: 26, fontWeight: "900", marginTop: 8 },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    alignSelf: "center",
    marginTop: 16,
    borderWidth: 3,
    borderColor: "white",
  },

  username: {
    textAlign: "center",
    color: "white",
    fontSize: 22,
    fontWeight: "900",
    marginTop: 14,
    textTransform: "lowercase",
  },

  email: { textAlign: "center", color: "white", opacity: 0.95, marginTop: 6, fontWeight: "700" },
  tagline: { textAlign: "center", color: "white", marginTop: 6, fontWeight: "800" },

  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 18, paddingBottom: 10 },
  stat: { alignItems: "center" },
  statNum: { color: "white", fontSize: 22, fontWeight: "900" },
  statLbl: { color: "white", opacity: 0.95, marginTop: 4, fontWeight: "700" },

  sectionCard: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  sectionTitle: { fontSize: 16, fontWeight: "900", color: "#2F2F2F" },
  chipsRow: { flexDirection: "row", gap: 10, marginTop: 12, flexWrap: "wrap" },

  accountChip: { backgroundColor: "#DDF7EA", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  accountChipTxt: { color: "#0A7A5A", fontWeight: "900" },

  segmentWrap: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 999,
    padding: 6,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  segmentBtn: { flex: 1, height: 44, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  segmentActive: { backgroundColor: "#0A7A5A" },
  segmentTxt: { fontWeight: "900", color: "#2F2F2F" },
  segmentTxtActive: { color: "white" },

  itemCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  itemTitle: { fontSize: 18, fontWeight: "900", color: "#2F2F2F" },
  itemMetaRow: { flexDirection: "row", gap: 14, marginTop: 10, flexWrap: "wrap" },
  itemMeta: { color: "#3F5B50", fontWeight: "700" },

  badge: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  badgeTxt: { color: "white", fontWeight: "900", fontSize: 12 },
});
