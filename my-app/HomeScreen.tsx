import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
} from "react-native";

const COLORS = {
  crimson: "#981E32",
  crimsonDark: "#7f1628",
  bg: "#ffffff",
  card: "#ffffff",
  text: "#1a1a1a",
  muted: "#6b7280",
  border: "#e5e7eb",
  softRedBg: "#fff5f6",
  softRedBorder: "#ffd5db",
  greenBg: "#eafff1",
  greenBorder: "#b7f2ce",
  redBg: "#fff1f2",
  redBorder: "#ffc7cf",
};

type LogItem = {
  id: string;
  time: string;
  status: "Answered" | "Missed" | "Declined";
  transcript: string;
  hasAudio: boolean;
};

export default function ChronHomeScreen() {
  const [enabled, setEnabled] = useState(true);

  const logs: LogItem[] = useMemo(
    () => [
      {
        id: "1",
        time: "10:15 AM",
        status: "Answered",
        transcript: "Feeling stressed and tired.",
        hasAudio: true,
      },
      {
        id: "2",
        time: "08:05 AM",
        status: "Missed",
        transcript: "Meeting was hectic.",
        hasAudio: false,
      },
      {
        id: "3",
        time: "06:00 AM",
        status: "Answered",
        transcript: "Morning workout at the gym.",
        hasAudio: true,
      },
    ],
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Topbar */}
        <View style={styles.topbar}>
          <View style={styles.titleWrap}>
            <Text style={styles.h1}>Chron</Text>
            <Text style={styles.subtitle}>Automate your daily logs</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.iconBtn,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            onPress={() => {
              /* navigation placeholder */
            }}
          >
            <Text style={styles.iconGlyph}>⚙️</Text>
          </Pressable>
        </View>

        {/* Status card */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>
                Chron is {enabled ? "ENABLED" : "DISABLED"}
              </Text>
            </View>

            <Text style={styles.nextCheckin}>Next check-in: 11:00 AM</Text>
          </View>

          {/* Toggle (visual + clickable) */}
          <Pressable
            onPress={() => setEnabled((v) => !v)}
            accessibilityRole="switch"
            accessibilityState={{ checked: enabled }}
            style={({ pressed }) => [
              styles.toggle,
              enabled && styles.toggleOn,
              pressed && { opacity: 0.9 },
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                enabled ? styles.toggleKnobOn : styles.toggleKnobOff,
              ]}
            />
          </Pressable>
        </View>

        {/* Primary action */}
        <Pressable
          style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Record Log Now"
          onPress={() => {
            /* placeholder */
          }}
        >
          <View style={styles.primaryLeft}>
            <Text style={styles.primaryIcon}>🎙️</Text>
            <Text style={styles.primaryText}>Record Log Now</Text>
          </View>
          <Text style={styles.primaryChevron}>›</Text>
        </Pressable>

        {/* Quick actions */}
        <View style={styles.quick}>
          <QuickTile label={"Vault &\nMemos"} icon="📁" onPress={() => {}} />
          <QuickTile label="Events" icon="📅" onPress={() => {}} />
          <QuickTile label={"Edit\nMemos"} icon="✏️" onPress={() => {}} />
          <QuickTile label={"View\nDays"} icon="🗓️" onPress={() => {}} />
        </View>

        {/* Activity section */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Activity Log (Last 24 Hours)</Text>
            <View style={styles.dots} accessibilityLabel="More">
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          <View style={styles.list}>
            {logs.map((l) => (
              <LogRow key={l.id} item={l} />
            ))}

            <Text style={styles.note}>Visual mock only (no functionality).</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickTile({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={styles.tileText}>{label}</Text>
    </Pressable>
  );
}

function LogRow({ item }: { item: LogItem }) {
  const isBad = item.status === "Missed";
  const statusColor =
    item.status === "Missed" ? "#b91c1c" : COLORS.crimson;

  return (
    <Pressable
      onPress={() => {
        /* open daily note placeholder */
      }}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.badge,
          isBad ? styles.badgeBad : styles.badgeOk,
        ]}
      >
        <Text style={styles.badgeIcon}>{isBad ? "✕" : "✓"}</Text>
      </View>

      <View style={styles.itemMain}>
        <View style={styles.meta}>
          <Text style={styles.time}>{item.time}</Text>
          <Text style={[styles.status, { color: statusColor }]}>
            {item.status}
          </Text>
        </View>
        <Text style={styles.snippet}>{item.transcript}</Text>
      </View>

      <View style={styles.right}>
        {item.hasAudio ? (
          <Text style={styles.paperclip} accessibilityLabel="Has audio memo">
            📎
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1, backgroundColor: COLORS.bg },

  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    maxWidth: 430,
    alignSelf: "center",
    width: "100%",
  },

  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  titleWrap: { flexDirection: "column" },
  h1: { fontSize: 22, fontWeight: "800", letterSpacing: 0.2, color: COLORS.text },
  subtitle: { marginTop: 6, fontSize: 13, color: COLORS.muted },

  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  iconGlyph: { fontSize: 18 },

  statusCard: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 14,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  statusLeft: { flexDirection: "column", gap: 6 },

  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.softRedBg,
    borderWidth: 1,
    borderColor: COLORS.softRedBorder,
  },
  pillText: { fontSize: 12, fontWeight: "700", color: COLORS.crimsonDark },

  nextCheckin: { fontSize: 12, color: COLORS.muted },

  toggle: {
    width: 56,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#e5e7eb",
    padding: 3,
    justifyContent: "center",
  },
  toggleOn: { backgroundColor: COLORS.crimson, borderColor: COLORS.crimson },
  toggleKnob: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  toggleKnobOff: { alignSelf: "flex-start" },
  toggleKnobOn: { alignSelf: "flex-end" },

  primary: {
    marginTop: 14,
    width: "100%",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: COLORS.crimson,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: COLORS.crimson,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 14 },
    elevation: 3,
  },
  primaryLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  primaryIcon: { fontSize: 18, color: "#fff" },
  primaryText: { fontSize: 16, fontWeight: "800", color: "#fff" },
  primaryChevron: { fontSize: 26, color: "#fff", opacity: 0.9, marginRight: 2 },

  quick: {
    marginTop: 14,
    flexDirection: "row",
    gap: 10,
  },
  tile: {
    flex: 1,
    minHeight: 92,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  tileIcon: { fontSize: 22, marginBottom: 8 },
  tileText: { fontSize: 12, fontWeight: "700", color: "#111827", textAlign: "center" },

  section: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  sectionHead: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#fff",
  },
  sectionTitle: { fontSize: 14, fontWeight: "900", letterSpacing: 0.2, color: COLORS.text },
  dots: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 999, backgroundColor: "#d1d5db" },

  list: { paddingHorizontal: 8, paddingTop: 6, paddingBottom: 10 },

  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f1f3",
    backgroundColor: "#fff",
    marginTop: 8,
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeOk: { backgroundColor: COLORS.greenBg, borderWidth: 1, borderColor: COLORS.greenBorder },
  badgeBad: { backgroundColor: COLORS.redBg, borderWidth: 1, borderColor: COLORS.redBorder },
  badgeIcon: { fontSize: 16, fontWeight: "900", color: "#111827" },

  itemMain: { flex: 1 },
  meta: { flexDirection: "row", gap: 8, alignItems: "baseline", flexWrap: "wrap" },
  time: { fontSize: 13, fontWeight: "900", color: COLORS.text },
  status: { fontSize: 13, fontWeight: "900" },
  snippet: { marginTop: 4, fontSize: 13, color: COLORS.muted, lineHeight: 17 },

  right: { width: 28, alignItems: "flex-end", justifyContent: "center" },
  paperclip: { fontSize: 16 },

  note: { marginTop: 10, fontSize: 12, color: COLORS.muted, paddingHorizontal: 4 },

  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },
});