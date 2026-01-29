import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ChatType = "org" | "friend";

type Message = {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
};

type Chat = {
  id: string;
  type: ChatType;
  name: string;
  subtitle: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  avatarText: string;
  messages: Message[];
};

const colors = {
  bg: "#F7F3E8", // beige
  card: "rgba(255,255,255,0.75)",
  cardSolid: "#FFFFFF",
  border: "#E6DDC7",
  forest: "#1F5B3A", // deep green
  moss: "#2E7D55",
  moss2: "#6C7F72",
  leaf: "#B7D9C4", // pastel green
  paper: "#FBFAF5",
  ink: "#18211B",
};

const initialChats: Chat[] = [
  {
    id: "c1",
    type: "org",
    name: "Second Harvest CLT",
    subtitle: "Food Pantry • Nonprofit",
    lastMessage: "You’re all set for Saturday’s shift — thank you!",
    lastTime: "2h",
    unread: 2,
    avatarText: "SH",
    messages: [
      { id: "m1", fromMe: false, text: "Hi Sherin! Can you make Saturday 10–12?", time: "9:14 AM" },
      { id: "m2", fromMe: true, text: "Yes! I can do 10–12. 😊", time: "9:16 AM" },
      { id: "m3", fromMe: false, text: "Perfect. Please arrive 10 minutes early for check-in.", time: "9:18 AM" },
      { id: "m4", fromMe: false, text: "You’re all set for Saturday’s shift — thank you!", time: "9:20 AM" },
    ],
  },
  {
    id: "c2",
    type: "org",
    name: "Trees for Charlotte",
    subtitle: "Environmental • Volunteer",
    lastMessage: "Bring closed-toe shoes and a water bottle 🌿",
    lastTime: "1d",
    unread: 0,
    avatarText: "TC",
    messages: [
      { id: "m1", fromMe: false, text: "Reminder: planting event is this Sunday at 1 PM.", time: "Yesterday" },
      { id: "m2", fromMe: true, text: "Got it! Is parking available nearby?", time: "Yesterday" },
      { id: "m3", fromMe: false, text: "Yes — there’s a lot across the street.", time: "Yesterday" },
      { id: "m4", fromMe: false, text: "Bring closed-toe shoes and a water bottle 🌿", time: "Yesterday" },
    ],
  },
  {
    id: "c3",
    type: "friend",
    name: "Maya Patel",
    subtitle: "Friend",
    lastMessage: "Wait that org sounds so cool 👀",
    lastTime: "3d",
    unread: 1,
    avatarText: "MP",
    messages: [
      { id: "m1", fromMe: true, text: "I signed up to volunteer this weekend!", time: "Mon" },
      { id: "m2", fromMe: false, text: "Omg where??", time: "Mon" },
      { id: "m3", fromMe: true, text: "Second Harvest CLT — packing meals.", time: "Mon" },
      { id: "m4", fromMe: false, text: "Wait that org sounds so cool 👀", time: "Mon" },
    ],
  },
  {
    id: "c4",
    type: "friend",
    name: "Jordan Lee",
    subtitle: "Friend",
    lastMessage: "Let’s go together next time!",
    lastTime: "5d",
    unread: 0,
    avatarText: "JL",
    messages: [
      { id: "m1", fromMe: false, text: "Did you end up going to that volunteer event?", time: "Fri" },
      { id: "m2", fromMe: true, text: "Not yet 😭 but I’m scheduled this Saturday", time: "Fri" },
      { id: "m3", fromMe: false, text: "Let’s go together next time!", time: "Fri" },
    ],
  },
];

export default function ChatScreen() {
  const [chats] = useState<Chat[]>(initialChats); // stays fake/static (for show)
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<ChatType>("org");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const inputRef = useRef<TextInput>(null);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? null,
    [chats, activeChatId]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return chats.filter((c) => {
      if (c.type !== tab) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q)
      );
    });
  }, [chats, query, tab]);

  // ✅ when you open a chat, focus input so keyboard pops (real messages feel)
  useEffect(() => {
    if (activeChatId) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [activeChatId]);

  const onSend = () => {
    // For show only: we don't save anything — we just keep keyboard open
    if (!draft.trim()) return;
    setDraft("");
    // keep keyboard up like a real chat
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  if (activeChat) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Header */}
          <View style={styles.chatHeader}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                setActiveChatId(null);
              }}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={22} color={colors.forest} />
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={styles.chatTitle}>{activeChat.name}</Text>
              <Text style={styles.chatSub}>{activeChat.subtitle}</Text>
            </View>

            <View style={styles.headerActions}>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="call-outline" size={18} color={colors.forest} />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Ionicons name="information-circle-outline" size={18} color={colors.forest} />
              </Pressable>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            data={activeChat.messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            renderItem={({ item }) => (
              <View style={[styles.bubbleRow, item.fromMe ? { justifyContent: "flex-end" } : null]}>
                {!item.fromMe ? (
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>{activeChat.avatarText}</Text>
                  </View>
                ) : null}

                <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                  <Text style={[styles.bubbleText, { color: colors.ink }]}>{item.text}</Text>
                  <Text style={styles.bubbleTime}>{item.time}</Text>
                </View>
              </View>
            )}
          />

          {/* Composer (tap anywhere to focus, keyboard pops) */}
          <Pressable style={styles.composer} onPress={() => inputRef.current?.focus()}>
            <Ionicons name="happy-outline" size={18} color={colors.forest} />
            <TextInput
              ref={inputRef}
              value={draft}
              onChangeText={setDraft}
              placeholder="Message..."
              placeholderTextColor={colors.moss2}
              style={styles.composerInput}
              autoFocus
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={onSend}
            />
            <Pressable onPress={onSend} style={styles.sendBtn}>
              <Ionicons name="send" size={16} color={colors.paper} />
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Chat list screen
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.header}>Messages</Text>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={16} color={colors.moss2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search messages..."
            placeholderTextColor={colors.moss2}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.segment}>
          <Pressable
            onPress={() => setTab("org")}
            style={[styles.segmentBtn, tab === "org" && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, tab === "org" && styles.segmentActiveText]}>
              Organizations
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("friend")}
            style={[styles.segmentBtn, tab === "friend" && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, tab === "friend" && styles.segmentActiveText]}>
              Friends
            </Text>
          </Pressable>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setActiveChatId(item.id);
                setTimeout(() => inputRef.current?.focus(), 250);
              }}
              style={styles.chatItem}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatarText}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.chatTime}>{item.lastTime}</Text>
                </View>

                <Text style={styles.chatPreview} numberOfLines={1}>
                  {item.lastMessage}
                </Text>

                <Text style={styles.chatMeta} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              </View>

              {item.unread > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.unread}</Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color={colors.moss2} />
              )}
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={{ paddingTop: 18 }}>
              <Text style={{ color: colors.moss2, fontWeight: "700" }}>No chats found.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, paddingTop: 8, paddingHorizontal: 16, backgroundColor: colors.bg },

  header: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.forest,
    letterSpacing: 0.2,
  },

  searchWrap: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.card,
    gap: 8,
  },
  searchInput: { flex: 1, color: colors.ink, fontWeight: "700" },

  segment: {
    flexDirection: "row",
    marginTop: 14,
    backgroundColor: colors.cardSolid,
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 999, alignItems: "center" },
  segmentActive: { backgroundColor: colors.forest },
  segmentText: { color: colors.moss2, fontWeight: "800" },
  segmentActiveText: { color: colors.paper, fontWeight: "900" },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.leaf,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A8CBB6",
  },
  avatarText: { fontWeight: "900", color: colors.forest },

  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  chatName: { fontWeight: "900", color: colors.ink, maxWidth: "80%" },
  chatPreview: { color: colors.moss2, marginTop: 3, fontWeight: "700" },
  chatMeta: { color: "#8B9A90", marginTop: 3, fontWeight: "700", fontSize: 12 },
  chatTime: { color: "#7C8A80", fontSize: 12, fontWeight: "800" },

  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 999,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.paper, fontWeight: "900", fontSize: 12 },

  // Chat detail
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  chatTitle: { fontWeight: "900", color: colors.ink, fontSize: 16 },
  chatSub: { fontWeight: "800", color: colors.moss2, fontSize: 12, marginTop: 1 },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: colors.border,
  },

  bubbleRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 10, gap: 8 },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.leaf,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A8CBB6",
  },
  smallAvatarText: { fontWeight: "900", color: colors.forest, fontSize: 11 },

  bubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  bubbleMe: {
    backgroundColor: "#EAF3EC",
    borderColor: "#CFE3D6",
  },
  bubbleThem: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderColor: colors.border,
  },
  bubbleText: { fontWeight: "700", lineHeight: 18 },
  bubbleTime: { marginTop: 6, fontSize: 11, color: "#7C8A80", fontWeight: "800" },

  composer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  composerInput: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.ink,
    fontWeight: "800",
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
});
