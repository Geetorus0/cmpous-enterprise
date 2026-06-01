import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TIMETABLE: Record<string, { time: string; subject: string; section: string; room: string }[]> = {
  Mon: [
    { time: "8:00–9:00", subject: "Data Structures", section: "CSE-A", room: "CSE-301" },
    { time: "9:00–10:00", subject: "Computer Networks", section: "CSE-B", room: "CSE-302" },
    { time: "11:15–12:15", subject: "Data Structures", section: "CSE-C", room: "CSE-401" },
    { time: "2:30–3:30", subject: "DBMS", section: "CSE-B", room: "CSE-302" },
  ],
  Tue: [
    { time: "8:00–9:00", subject: "Computer Networks", section: "CSE-A", room: "CSE-301" },
    { time: "10:15–11:15", subject: "DBMS", section: "CSE-A", room: "CSE-Lab" },
    { time: "2:30–3:30", subject: "Data Structures", section: "CSE-B", room: "CSE-301" },
  ],
  Wed: [
    { time: "9:00–10:00", subject: "Data Structures", section: "CSE-A", room: "CSE-401" },
    { time: "11:15–12:15", subject: "Computer Networks", section: "CSE-C", room: "CSE-302" },
    { time: "3:30–4:30", subject: "DBMS", section: "CSE-C", room: "CSE-301" },
  ],
  Thu: [
    { time: "8:00–9:00", subject: "DBMS", section: "CSE-A", room: "CSE-Lab" },
    { time: "10:15–11:15", subject: "Data Structures", section: "CSE-C", room: "CSE-401" },
    { time: "2:30–3:30", subject: "Computer Networks", section: "CSE-B", room: "CSE-302" },
  ],
  Fri: [
    { time: "9:00–10:00", subject: "Computer Networks", section: "CSE-A", room: "CSE-301" },
    { time: "11:15–12:15", subject: "DBMS", section: "CSE-B", room: "CSE-302" },
  ],
  Sat: [
    { time: "8:00–9:00", subject: "Data Structures", section: "CSE-A", room: "CSE-301" },
    { time: "9:00–10:00", subject: "Computer Networks", section: "CSE-C", room: "CSE-401" },
  ],
};

const SUBJECT_COLORS: Record<string, string> = {
  "Data Structures": "#1565C0",
  "Computer Networks": "#0EA5E9",
  DBMS: "#7C3AED",
};

export default function FacultySchedule() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const today = new Date().getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayShort = dayNames[today];
  const [selectedDay, setSelectedDay] = useState(DAYS.includes(todayShort) ? todayShort : "Mon");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const classes = TIMETABLE[selectedDay] ?? [];
  const weeklyTotal = Object.values(TIMETABLE).flat().length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>My Schedule</Text>
        <View style={styles.statsRow}>
          {[{ label: "Classes/Week", value: `${weeklyTotal}` }, { label: "Subjects", value: "3" }, { label: "Sections", value: "3" }].map((s) => (
            <View key={s.label} style={[styles.statChip, { backgroundColor: "#FFFFFF15" }]}>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Day selector */}
      <View style={[styles.daySelector, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {DAYS.map((d) => (
            <Pressable
              key={d}
              onPress={() => setSelectedDay(d)}
              style={[
                styles.dayBtn,
                {
                  backgroundColor: selectedDay === d ? colors.primary : colors.muted,
                  borderColor: selectedDay === d ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.dayText, { color: selectedDay === d ? "#FFF" : colors.mutedForeground }]}>{d}</Text>
              {d === todayShort && <View style={[styles.todayDot, { backgroundColor: selectedDay === d ? "#FFFFFF80" : colors.primary }]} />}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {classes.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="calendar" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No classes on {selectedDay}</Text>
          </View>
        ) : (
          classes.map((cls, i) => {
            const subColor = SUBJECT_COLORS[cls.subject] ?? colors.primary;
            return (
              <View key={i} style={[styles.classCard, { backgroundColor: colors.card, borderColor: colors.border, borderLeftColor: subColor }]}>
                <View style={styles.timeCol}>
                  <Text style={[styles.timeText, { color: colors.mutedForeground }]}>{cls.time.split("–")[0]}</Text>
                  <View style={[styles.timeDot, { backgroundColor: subColor }]} />
                  <Text style={[styles.timeText, { color: colors.mutedForeground }]}>{cls.time.split("–")[1]}</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 14 }}>
                  <Text style={[styles.subjectName, { color: colors.foreground }]}>{cls.subject}</Text>
                  <View style={styles.metaRow}>
                    <View style={[styles.sectionBadge, { backgroundColor: subColor + "20" }]}>
                      <Text style={[styles.sectionText, { color: subColor }]}>{cls.section}</Text>
                    </View>
                    <Text style={[styles.roomText, { color: colors.mutedForeground }]}>{cls.room}</Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 10 },
  statChip: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignItems: "center" },
  statVal: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { color: "#93C5FD", fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 2 },
  daySelector: { borderBottomWidth: 1, paddingVertical: 12 },
  dayBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8, alignItems: "center", position: "relative" },
  dayText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  todayDot: { width: 4, height: 4, borderRadius: 2, position: "absolute", bottom: 4 },
  classCard: { borderRadius: 14, borderWidth: 1, borderLeftWidth: 4, padding: 14, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  timeCol: { width: 50, alignItems: "center", gap: 4 },
  timeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  timeDot: { width: 6, height: 6, borderRadius: 3 },
  subjectName: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 6 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  sectionText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  roomText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
