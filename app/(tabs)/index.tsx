import { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PostComposerModal } from "../../src/components/PostComposerModal";

type PostType = "Public" | "Organizations";

type Post = {
  id: string;
  author: string;
  type: PostType;
  time: string;
  body: string;
  likes: number;
  comments: number;
  tag?: string;
};

const FAKE_POSTS: Post[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    type: "Public",
    time: "2h",
    body: "Had an amazing time at the food bank today! Everyone was so kind 💚",
    likes: 124,
    comments: 18,
    tag: "Food Security",
  },
  {
    id: "2",
    author: "Charlotte Clean Streets",
    type: "Organizations",
    time: "5h",
    body: "Saturday cleanup crew needed in South End — bags/gloves provided. Come through 🌿",
    likes: 211,
    comments: 34,
    tag: "Environment",
  },
  {
    id: "3",
    author: "Maya Patel",
    type: "Public",
    time: "1d",
    body: "If anyone wants a volunteering buddy for this weekend, DM me! I’m new to CLT 🫶",
    likes: 89,
    comments: 9,
    tag: "Community",
  },
  {
    id: "4",
    author: "Habitat CLT Region",
    type: "Organizations",
    time: "2d",
    body: "Build Day signups are open! No experience needed — we’ll train you on site 🧰",
    likes: 342,
    comments: 52,
    tag: "Housing",
  },
  {
    id: "5",
    author: "Nina Chen",
    type: "Public",
    time: "3d",
    body: "I volunteered at an animal shelter today and my heart is FULL 😭🐾",
    likes: 158,
    comments: 21,
    tag: "Animals",
  },
];

export default function FeedScreen() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<"All" | PostType>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAKE_POSTS.filter((p) => {
      const matchesChip = chip === "All" ? true : p.type === chip;
      const matchesQuery =
        !q ||
        p.author.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        (p.tag ?? "").toLowerCase().includes(q);

      return matchesChip && matchesQuery;
    });
  }, [query, chip]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.header}>DoGood</Text>
          <Text style={styles.sub}>See what people are doing in Charlotte</Text>
        </View>

        <TouchableOpacity style={styles.plusBtn} onPress={() => setOpen(true)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="#6B7280" />
        <TextInput
          placeholder="Search posts, orgs, causes..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View style={styles.chips}>
        <TouchableOpacity
          onPress={() => setChip("All")}
          style={[styles.chip, chip === "All" && styles.chipActive]}
        >
          <Text style={[styles.chipText, chip === "All" && styles.chipActiveText]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setChip("Public")}
          style={[styles.chip, chip === "Public" && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              chip === "Public" && styles.chipActiveText,
            ]}
          >
            Public
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setChip("Organizations")}
          style={[styles.chip, chip === "Organizations" && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              chip === "Organizations" && styles.chipActiveText,
            ]}
          >
            Organizations
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {filtered.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postTopRow}>
              <View>
                <Text style={styles.postTitle}>{post.author}</Text>
                <Text style={styles.postMeta}>
                  {post.type} • {post.time}
                </Text>
              </View>

              {post.tag ? <Text style={styles.badge}>{post.tag}</Text> : null}
            </View>

            <Text style={styles.postBody}>{post.body}</Text>

            <View style={styles.postActions}>
              <View style={styles.actionItem}>
                <Ionicons name="heart-outline" size={16} color="#5E8C72" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </View>

              <View style={styles.actionItem}>
                <Ionicons name="chatbubble-ellipses-outline" size={16} color="#5E8C72" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </View>

              <View style={{ flex: 1 }} />

              <TouchableOpacity style={styles.smallBtn}>
                <Text style={styles.smallBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No matches</Text>
            <Text style={styles.emptySub}>Try a different keyword or chip.</Text>
          </View>
        ) : null}
      </ScrollView>

      <PostComposerModal open={open} onClose={() => setOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Beige + Sage theme
  container: {
    flex: 1,
    paddingTop: 18,
    paddingHorizontal: 16,
    backgroundColor: "#F5F1EB", // beige
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  header: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2F2F2F",
    letterSpacing: 0.2,
  },

  sub: {
    marginTop: 4,
    color: "#6B7280",
    fontWeight: "600",
  },

  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#7FA68A", // sage
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  searchWrap: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D6D3D1",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },

  searchInput: {
    flex: 1,
    color: "#2F2F2F",
    fontWeight: "600",
  },

  chips: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginBottom: 6,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#EFEAE3",
    borderWidth: 1,
    borderColor: "#D6D3D1",
  },

  chipText: {
    color: "#5B5B5B",
    fontWeight: "700",
  },

  chipActive: {
    backgroundColor: "#7FA68A",
    borderColor: "#7FA68A",
  },

  chipActiveText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  postCard: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E1DB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  postTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  postTitle: {
    fontWeight: "900",
    color: "#2F2F2F",
    fontSize: 16,
  },

  postMeta: {
    marginTop: 2,
    color: "#6B7280",
    fontWeight: "700",
    fontSize: 12,
  },

  badge: {
    backgroundColor: "#EAF1EC",
    borderColor: "#C9DED1",
    borderWidth: 1,
    color: "#5E8C72",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden",
  },

  postBody: {
    marginTop: 10,
    color: "#374151",
    lineHeight: 19,
    fontWeight: "600",
  },

  postActions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 14,
    alignItems: "center",
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#F1F5F2",
    borderWidth: 1,
    borderColor: "#C9DED1",
  },

  actionText: {
    color: "#5E8C72",
    fontWeight: "900",
  },

  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#7FA68A",
  },

  smallBtnText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  emptyState: {
    marginTop: 30,
    alignItems: "center",
    padding: 16,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#2F2F2F",
  },

  emptySub: {
    marginTop: 6,
    color: "#6B7280",
    fontWeight: "600",
  },
});
