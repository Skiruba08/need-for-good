import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, TextInput, Image, StyleSheet } from "react-native";

type EventItem = {
  id: string;
  title: string;
  org: string;
  dateLabel: string;
  timeLabel: string;
  location: string;
  category: "Food" | "Education" | "Environment" | "Animals" | "Community" | "Health";
  imageUrl: string;
  description: string;
};

const CATEGORIES: Array<EventItem["category"] | "All"> = [
  "All",
  "Food",
  "Education",
  "Environment",
  "Animals",
  "Community",
  "Health",
];

const SEED: Omit<EventItem, "id">[] = [
  {
    title: "Food Pantry Packing",
    org: "Community Harvest",
    dateLabel: "Sat, Feb 3",
    timeLabel: "10:00 AM – 12:00 PM",
    location: "East Charlotte",
    category: "Food",
    imageUrl:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=60",
    description:
      "Help sort and pack pantry items for families. Light lifting, great for first-time volunteers.",
  },
  {
    title: "Park Cleanup + Trail Walk",
    org: "GreenCity Crew",
    dateLabel: "Sun, Feb 4",
    timeLabel: "9:00 AM – 11:30 AM",
    location: "Freedom Park",
    category: "Environment",
    imageUrl:
      "https://images.unsplash.com/photo-1520962917960-1a7b39d3c4b4?auto=format&fit=crop&w=1200&q=60",
    description:
      "Bring gloves if you have them. We’ll provide bags, grabbers, and snacks.",
  },
  {
    title: "After-School STEM Tutor",
    org: "Bright Futures",
    dateLabel: "Tue, Feb 6",
    timeLabel: "4:00 PM – 6:00 PM",
    location: "University Area",
    category: "Education",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=60",
    description:
      "Support middle school students with homework + fun STEM activities. No teaching license needed.",
  },
  {
    title: "Animal Shelter Enrichment",
    org: "Paws & Care",
    dateLabel: "Wed, Feb 7",
    timeLabel: "5:30 PM – 7:00 PM",
    location: "South End",
    category: "Animals",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=60",
    description:
      "Playtime and enrichment for dogs & cats. Perfect if you miss your pets back home 😭",
  },
  {
    title: "Neighborhood Meal Delivery",
    org: "Care Runners",
    dateLabel: "Thu, Feb 8",
    timeLabel: "6:00 PM – 8:00 PM",
    location: "Uptown",
    category: "Health",
    imageUrl:
      "https://images.unsplash.com/photo-1603398938378-e54c0c13c6c8?auto=format&fit=crop&w=1200&q=60",
    description:
      "Deliver prepared meals to seniors. You’ll get a route + contactless instructions.",
  },
  {
    title: "Community Garden Build",
    org: "Grow Together",
    dateLabel: "Sat, Feb 10",
    timeLabel: "9:30 AM – 1:00 PM",
    location: "NoDa",
    category: "Community",
    imageUrl:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=1200&q=60",
    description:
      "Assemble raised beds and prep soil. Wear closed-toe shoes. Tools provided.",
  },
];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeFakeEvents(count: number): EventItem[] {
  const rng = mulberry32(42);

  const titles = [
    "Food Drive Sorting",
    "Volunteer Orientation",
    "Soup Kitchen Shift",
    "Mentor Meetup",
    "Clothing Closet Helper",
    "Community Cleanup",
    "Senior Tech Help",
    "School Supply Packing",
    "Habitat Build Support",
    "Library Reading Buddy",
  ];

  const orgs = [
    "Charlotte Cares",
    "Hearts United",
    "Volunteer Wave",
    "Helping Hands",
    "Neighborhood Alliance",
    "Second Chance Team",
    "Kindness Collective",
  ];

  const locations = ["Uptown", "South End", "NoDa", "Plaza Midwood", "University Area", "East Charlotte"];

  const images = [
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1520975958225-5e6c34b1f3b2?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1559027615-cdcb6b6f1b0a?auto=format&fit=crop&w=1200&q=60",
    "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=60",
  ];

  const cats: EventItem["category"][] = ["Food", "Education", "Environment", "Animals", "Community", "Health"];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const out: EventItem[] = [];
  for (let i = 0; i < count; i++) {
    const title = titles[Math.floor(rng() * titles.length)];
    const org = orgs[Math.floor(rng() * orgs.length)];
    const location = locations[Math.floor(rng() * locations.length)];
    const imageUrl = images[Math.floor(rng() * images.length)];
    const category = cats[Math.floor(rng() * cats.length)];

    const day = days[Math.floor(rng() * days.length)];
    const month = months[Math.floor(rng() * months.length)];
    const dateNum = 1 + Math.floor(rng() * 27);

    const startHour = 8 + Math.floor(rng() * 9);
    const startMin = rng() > 0.5 ? "00" : "30";
    const endHour = startHour + 2;

    const ampm = startHour >= 12 ? "PM" : "AM";
    const startHour12 = ((startHour + 11) % 12) + 1;
    const endHour12 = ((endHour + 11) % 12) + 1;
    const endAmpm = endHour >= 12 ? "PM" : "AM";

    out.push({
      id: `fake-${i}-${Math.floor(rng() * 1e9)}`,
      title,
      org,
      dateLabel: `${day}, ${month} ${dateNum}`,
      timeLabel: `${startHour12}:${startMin} ${ampm} – ${endHour12}:${startMin} ${endAmpm}`,
      location,
      category,
      imageUrl,
      description:
        "A friendly volunteer shift. Bring water, wear comfy clothes, and expect good vibes.",
    });
  }
  return out;
}

export default function EventsScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const data = useMemo(() => {
    const base: EventItem[] = [
      ...SEED.map((e, idx) => ({ ...e, id: `seed-${idx}` })),
      ...makeFakeEvents(18),
    ];

    const q = query.trim().toLowerCase();

    return base
      .filter((e) => (category === "All" ? true : e.category === category))
      .filter((e) => {
        if (!q) return true;
        return (
          e.title.toLowerCase().includes(q) ||
          e.org.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
        );
      });
  }, [query, category]);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Events</Text>
      <Text style={styles.sub}></Text>

      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search title, org, location..."
          placeholderTextColor="#9AA3AE"
          style={styles.search}
        />
      </View>

      <View style={styles.pillsRow}>
        {CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={[styles.pill, active && styles.pillActive]}
            >
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{c}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => {}}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImg} />
            <View style={styles.cardBody}>
              <View style={styles.cardTopRow}>
                <Text style={styles.badge}>{item.category}</Text>
                <Text style={styles.meta}>{item.dateLabel}</Text>
              </View>

              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.org} numberOfLines={1}>
                {item.org} • {item.location}
              </Text>
              <Text style={styles.meta} numberOfLines={1}>
                {item.timeLabel}
              </Text>

              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.actionsRow}>
                <Pressable style={styles.btnSecondary} onPress={() => {}}>
                  <Text style={styles.btnSecondaryText}>Details</Text>
                </Pressable>
                <Pressable style={styles.btnPrimary} onPress={() => {}}>
                  <Text style={styles.btnPrimaryText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    backgroundColor: "#F5F1EB", // beige
  },

  h1: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2F2F2F", // dark text
  },

  sub: {
    marginTop: 4,
    color: "#6B7280", // muted gray
  },

  searchRow: { marginTop: 14 },

  search: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D6D3D1", // soft beige border
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#2F2F2F",
  },

  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
  },

  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D6D3D1",
    backgroundColor: "#EFEAE3", // light beige
  },

  pillActive: {
    backgroundColor: "#7FA68A", // sage
    borderColor: "#7FA68A",
  },

  pillText: {
    color: "#5B5B5B",
    fontWeight: "700",
    fontSize: 12,
  },

  pillTextActive: {
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E1DB",
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  cardImg: {
    width: "100%",
    height: 140,
  },

  cardBody: {
    padding: 12,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  badge: {
    backgroundColor: "#EAF1EC", // pale sage
    borderColor: "#C9DED1",
    borderWidth: 1,
    color: "#5E8C72", // dark sage
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
  },

  title: {
    marginTop: 8,
    color: "#2F2F2F",
    fontSize: 16,
    fontWeight: "800",
  },

  org: {
    marginTop: 6,
    color: "#5E8C72", // sage
    fontWeight: "700",
  },

  meta: {
    marginTop: 4,
    color: "#6B7280",
  },

  desc: {
    marginTop: 8,
    color: "#4B5563",
    lineHeight: 18,
  },

  actionsRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },

  btnSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#C9DED1",
    backgroundColor: "#F1F5F2", // light sage
    alignItems: "center",
  },

  btnSecondaryText: {
    color: "#5E8C72",
    fontWeight: "800",
  },

  btnPrimary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#7FA68A", // sage
    alignItems: "center",
  },

  btnPrimaryText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});

