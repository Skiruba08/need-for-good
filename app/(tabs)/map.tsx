import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  FlatList,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Platform,
  Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

type Category = "AI" | "Food" | "Animals" | "Environment" | "Community";

type Friend = {
  id: string;
  name: string;
  avatar: string;
  place: string;
  minutesAgo: number;
  miles: number;
  x: number;
  y: number;
};

type Opportunity = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<Category, "AI">;
  miles: number;
  address: string;
  x: number;
  y: number;
};

const CATS: Category[] = ["AI", "Food", "Animals", "Environment", "Community"];

function timeLabel(minutesAgo: number) {
  if (minutesAgo < 60) return `${minutesAgo} mins ago`;
  if (minutesAgo < 120) return `1 hour ago`;
  return `${Math.floor(minutesAgo / 60)} hours ago`;
}

function openDirections(addressOrLabel: string) {
  const encoded = encodeURIComponent(addressOrLabel);
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?q=${encoded}`
      : `https://www.google.com/maps/search/?api=1&query=${encoded}`;
  Linking.openURL(url);
}

function pinColor(cat: Opportunity["category"]) {
  if (cat === "Food") return "#F97316";
  if (cat === "Animals") return "#0A7A5A";
  if (cat === "Environment") return "#0A7A5A";
  return "#A16207";
}

export default function MapScreen() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<Category>("AI");

  // ✅ from Profile screen: oppId
  const { oppId } = useLocalSearchParams<{ oppId?: string }>();

  const [selected, setSelected] = useState<
    | { kind: "friend"; id: string }
    | { kind: "opp"; id: string }
    | null
  >(null);

  const [activeFriendId, setActiveFriendId] = useState<string>("f1");

  function goToUserProfile(userId: string) {
    router.push({ pathname: "/(tabs)/profile", params: { userId } });
  }

  const friends: Friend[] = [
    {
      id: "f1",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=32",
      place: "Animal Shelter",
      minutesAgo: 5,
      miles: 3.1,
      x: 0.72,
      y: 0.22,
    },
    {
      id: "f2",
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
      place: "Beach Cleanup",
      minutesAgo: 15,
      miles: 4.5,
      x: 0.66,
      y: 0.45,
    },
    {
      id: "f3",
      name: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=47",
      place: "Community Garden",
      minutesAgo: 60,
      miles: 1.8,
      x: 0.82,
      y: 0.18,
    },
  ];

  const opportunities: Opportunity[] = [
    {
      id: "o1",
      title: "Charlotte Food Bank",
      subtitle: "Food sorting and distribution",
      category: "Food",
      miles: 2.3,
      address: "3609 Latrobe Dr, Charlotte, NC",
      x: 0.18,
      y: 0.25,
    },
    {
      id: "o2",
      title: "Animal Shelter",
      subtitle: "Dog walking and care",
      category: "Animals",
      miles: 3.1,
      address: "8315 Byrum Dr, Charlotte, NC",
      x: 0.70,
      y: 0.28,
    },
    {
      id: "o3",
      title: "Community Garden",
      subtitle: "Garden maintenance",
      category: "Environment",
      miles: 1.8,
      address: "1234 Garden St, Charlotte, NC",
      x: 0.44,
      y: 0.42,
    },
    {
      id: "o4",
      title: "Beach Cleanup",
      subtitle: "Coastal conservation",
      category: "Environment",
      miles: 4.5,
      address: "5678 Beach Rd, Charlotte, NC",
      x: 0.84,
      y: 0.38,
    },
  ];

  // ✅ If Profile navigated here with oppId, auto-open popup + show it even if category filter hides it
  useEffect(() => {
    if (!oppId) return;

    const exists = opportunities.some((o) => o.id === oppId);
    if (!exists) return;

    setActiveCat("AI"); // ensure visible regardless of filter
    setSelected({ kind: "opp", id: oppId });
  }, [oppId]);

  const filteredOpps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return opportunities
      .filter((o) => (activeCat === "AI" ? true : o.category === activeCat))
      .filter(
        (o) =>
          !q ||
          o.title.toLowerCase().includes(q) ||
          o.subtitle.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q)
      );
  }, [query, activeCat]);

  const selectedFriend =
    selected?.kind === "friend" ? friends.find((f) => f.id === selected.id) : null;

  const selectedOpp =
    selected?.kind === "opp" ? opportunities.find((o) => o.id === selected.id) : null;

  return (
    <View style={styles.page}>
      <View style={styles.mapWrap}>
        <ImageBackground
          source={require("../../assets/maps/charlotte.png")}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        >
          <View pointerEvents="none" style={styles.mapTint} />
          <GridOverlay />

          {/* opportunity pins */}
          {filteredOpps.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => {
                setSelected({ kind: "opp", id: o.id });
              }}
              style={[
                styles.pin,
                {
                  left: `${o.x * 100}%`,
                  top: `${o.y * 100}%`,
                  backgroundColor: pinColor(o.category),
                },
              ]}
            >
              <Text style={styles.pinIcon}>⌁</Text>
            </Pressable>
          ))}

          {/* friend pins */}
          {friends.map((f) => (
            <Pressable
              key={f.id}
              onPress={() => {
                setSelected({ kind: "friend", id: f.id });
                setActiveFriendId(f.id);
              }}
              style={[
                styles.friendPin,
                { left: `${f.x * 100}%`, top: `${f.y * 100}%` },
              ]}
            >
              <Image source={{ uri: f.avatar }} style={styles.friendAvatar} />
              <View style={styles.friendDot} />
            </Pressable>
          ))}

          <View style={styles.topOverlay}>
            <Text style={styles.h1}>Find Opportunities</Text>

            <View style={styles.searchBar}>
              <Text style={styles.searchIcon}>⌕</Text>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search Charlotte..."
                placeholderTextColor="#8BA39A"
                style={styles.searchInput}
              />
            </View>
          </View>

          {selected && (
            <View style={styles.popupCard}>
              {selectedFriend ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: selectedFriend.avatar }}
                    style={{ width: 44, height: 44, borderRadius: 22 }}
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.popupTitle}>{selectedFriend.name}</Text>
                    <Text style={styles.popupTime}>
                      {timeLabel(selectedFriend.minutesAgo)}
                    </Text>
                    <Text style={styles.popupLabel}>Volunteered at:</Text>
                    <Text style={styles.popupBold}>{selectedFriend.place}</Text>
                  </View>
                </View>
              ) : selectedOpp ? (
                <View>
                  <Text style={styles.popupTitle}>{selectedOpp.title}</Text>
                  <Text style={styles.popupSub}>{selectedOpp.subtitle}</Text>
                  <View style={{ marginTop: 10, alignSelf: "flex-start" }}>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: pinColor(selectedOpp.category) },
                      ]}
                    >
                      <Text style={styles.badgeText}>{selectedOpp.category}</Text>
                    </View>
                  </View>
                </View>
              ) : null}

              <View style={styles.popupActions}>
                <Pressable style={styles.popupBtn} onPress={() => setSelected(null)}>
                  <Text style={styles.popupBtnText}>Close</Text>
                </Pressable>

                {selectedFriend && (
                  <Pressable
                    style={[styles.popupBtn, styles.popupBtnPrimary]}
                    onPress={() => goToUserProfile(selectedFriend.id)}
                  >
                    <Text style={[styles.popupBtnText, { color: "white" }]}>
                      View Profile
                    </Text>
                  </Pressable>
                )}

                {selectedOpp && (
                  <Pressable
                    style={[styles.popupBtn, styles.popupBtnPrimary]}
                    onPress={() => openDirections(selectedOpp.address)}
                  >
                    <Text style={[styles.popupBtnText, { color: "white" }]}>
                      Directions
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </ImageBackground>
      </View>

      <View style={styles.chipsWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATS.map((c) => {
            const active = c === activeCat;
            return (
              <Pressable
                key={c}
                onPress={() => setActiveCat(c)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {c}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOpps}
        keyExtractor={(x) => x.id}
        contentContainerStyle={{ paddingBottom: 22 }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
            <Text style={styles.sectionTitle}>Friends Volunteering Nearby</Text>

            <View style={styles.panel}>
              {friends.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() => {
                    setSelected({ kind: "friend", id: f.id });
                    setActiveFriendId(f.id);
                  }}
                  style={[
                    styles.friendRow,
                    activeFriendId === f.id && styles.friendRowActive,
                  ]}
                >
                  <Image source={{ uri: f.avatar }} style={styles.rowAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>
                      {f.name} <Text style={styles.friendSub}>volunteered at</Text>
                    </Text>
                    <Text style={styles.friendPlace}>{f.place}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.friendTime}>{timeLabel(f.minutesAgo)}</Text>
                    <Text style={styles.friendMiles}>{f.miles} miles</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 14 }]}>
              Available Opportunities
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.oppCard}>
            <Pressable onPress={() => setSelected({ kind: "opp", id: item.id })}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={styles.oppTitle}>{item.title}</Text>
                  <Text style={styles.oppSub}>{item.subtitle}</Text>
                  <Text style={styles.oppMeta}>
                    📍 {item.miles} miles · {item.address}
                  </Text>
                </View>

                <View style={[styles.badge, { backgroundColor: pinColor(item.category) }]}>
                  <Text style={styles.badgeText}>{item.category}</Text>
                </View>
              </View>
            </Pressable>

            <Pressable style={styles.cta} onPress={() => openDirections(item.address)}>
              <Text style={styles.ctaText}>Get Directions</Text>
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

function GridOverlay() {
  const rows = 8;
  const cols = 10;

  return (
    <View pointerEvents="none" style={styles.gridWrap}>
      {Array.from({ length: cols }).map((_, i) => (
        <View
          key={`v-${i}`}
          style={[styles.gridLineV, { left: `${(i / (cols - 1)) * 100}%` }]}
        />
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <View
          key={`h-${i}`}
          style={[styles.gridLineH, { top: `${(i / (rows - 1)) * 100}%` }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7F4EA" },
  mapWrap: {
    height: 360,
    margin: 16,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#F7F4EA",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  mapTint: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(247, 244, 234, 0.20)" },

  gridWrap: { ...StyleSheet.absoluteFillObject, opacity: 0.35 },
  gridLineV: { position: "absolute", top: 0, bottom: 0, width: 2, backgroundColor: "rgba(185, 230, 198, 0.8)" },
  gridLineH: { position: "absolute", left: 0, right: 0, height: 2, backgroundColor: "rgba(185, 230, 198, 0.8)" },

  topOverlay: { position: "absolute", top: 14, left: 14, right: 14 },
  h1: { fontSize: 34, fontWeight: "900", color: "#0A7A5A" },

  searchBar: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F4EA",
    borderWidth: 2,
    borderColor: "#B9E6C6",
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: { fontSize: 18, opacity: 0.55, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#142018" },

  pin: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -23,
    marginTop: -23,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  pinIcon: { color: "white", fontWeight: "900" },

  friendPin: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#2BB673",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -26,
    marginTop: -26,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  friendAvatar: { width: 40, height: 40, borderRadius: 20 },
  friendDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    right: -1,
    bottom: -1,
    backgroundColor: "#2BB673",
    borderWidth: 2,
    borderColor: "white",
  },

  popupCard: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 70,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },

  popupTitle: { fontSize: 18, fontWeight: "900", color: "#142018" },
  popupTime: { marginTop: 2, color: "#0A7A5A", fontWeight: "800" },
  popupLabel: { marginTop: 10, color: "#6E8179" },
  popupBold: { marginTop: 2, fontWeight: "900", color: "#142018" },
  popupSub: { marginTop: 6, color: "#3F5B50", fontWeight: "700" },

  popupActions: { flexDirection: "row", gap: 10, marginTop: 12 },
  popupBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9DED1",
    backgroundColor: "#F1F5F2",
    alignItems: "center",
    justifyContent: "center",
  },
  popupBtnPrimary: { backgroundColor: "#0A7A5A", borderColor: "#0A7A5A" },
  popupBtnText: { fontWeight: "900", color: "#0A7A5A" },

  chipsWrap: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 6 },
  chip: {
    borderWidth: 2,
    borderColor: "#B9E6C6",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    marginRight: 10,
    backgroundColor: "white",
  },
  chipActive: { backgroundColor: "#0A7A5A", borderColor: "#0A7A5A" },
  chipText: { color: "#0A7A5A", fontWeight: "800" },
  chipTextActive: { color: "white" },

  sectionTitle: { marginTop: 10, marginBottom: 10, fontSize: 16, fontWeight: "800", color: "#142018" },

  panel: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },

  friendRow: { flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 16 },
  friendRowActive: { borderWidth: 2, borderColor: "#2BB673", backgroundColor: "#EAF7F1" },

  rowAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },

  friendName: { fontWeight: "800", color: "#142018" },
  friendSub: { fontWeight: "400", color: "#3F5B50" },
  friendPlace: { marginTop: 2, color: "#3F5B50" },
  friendTime: { color: "#0A7A5A", fontWeight: "800" },
  friendMiles: { marginTop: 2, color: "#6E8179" },

  oppCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  oppTitle: { fontSize: 18, fontWeight: "900", color: "#142018" },
  oppSub: { marginTop: 6, color: "#3F5B50" },
  oppMeta: { marginTop: 10, color: "#6E8179" },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, alignSelf: "flex-start" },
  badgeText: { color: "white", fontWeight: "800", fontSize: 12 },

  cta: {
    marginTop: 14,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#0A7A5A",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { color: "white", fontWeight: "900" },
});
