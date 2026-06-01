import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const SECTIONS = ["CSE-A", "CSE-B", "CSE-C", "CSE-D", "CSE-E"];

const SECTION_DATA: Record<string, { avg: number; students: number; low: number; subjects: { name: string; avg: number }[] }> = {
  "CSE-A": { avg: 86, students: 62, low: 3, subjects: [{ name: "Data Structures", avg: 88 }, { name: "Networks", avg: 84 }, { name: "DBMS", avg: 87 }] },
  "CSE-B": { avg: 79, students: 58, low: 7, subjects: [{ name: "Data Structures", avg: 82 }, { name: "Networks", avg: 76 }, { name: "DBMS", avg: 79 }] },
  "CSE-C": { avg: 83, students: 60, low: 5, subjects: [{ name: "Data Structures", avg: 85 }, { name: "Networks", avg: 80 }, { name: "DBMS", avg: 83 }] },
  "CSE-D": { avg: 74, students: 55, low: 11, subjects: [{ name: "Data Structures", avg: 74 }, { name: "Networks", avg: 73 }, { name: "DBMS", avg: 76 }] },
  "CSE-E": { avg: 81, students: 10, low: 2, subjects: [{ name: "Data Structures", avg: 83 }, { name: "Networks", avg: 79 }, { name: "DBMS", avg: 81 }] },
};

const CRITICAL_STUDENTS = [
  { name: "Arjun K", regNo: "22CS011", section: "CSE-D", pct: 58, risk: "High" },
  { name: "Priya R", regNo: "22CS034", section: "CSE-B", pct: 63, risk: "High" },
  { name: "Karthik M", regNo: "22CS045", section: "CSE-D", pct: 65, risk: "Medium" },
  { name: "Deepa S", regNo: "22CS067", section: "CSE-B", pct: 68, risk: "Medium" },
  { name: "Mahesh V", regNo: "22CS078", section: "CSE-D", pct: 70, risk: "Medium" },
];

export default function HODMonitor() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedSection, setSelectedSection] = useState("CSE-A");
  const [tab, setTab] = useState<"sections" | "students">("sections");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const data = SECTION_DATA[selectedSection];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>Department Monitor</Text>
        <Text style={styles.subtitle}>Real-time attendance overview</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["sections", "students"] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
            <Text style={[styles.tabLabel, { color: tab === t ? colors.primary : colors.mutedForeground }]}>
              {t === "sections" ? "By Section" : "Critical Students"}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {tab === "sections" ? (
          <>
            {/* Section selector */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }} contentContainerStyle={{ gap: 8 }}>
              {SECTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setSelectedSection(s)}
                  style={[styles.sectionBtn, { backgroundColor: selectedSection === s ? colors.primary : colors.card, borderColor: selectedSection === s ? colors.primary : colors.border }]}
                >
                  <Text style={[styles.sectionBtnText, { color: selectedSection === s ? "#FFF" : colors.foreground }]}>{s}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Section card */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.sectionCardHeader}>
                <Text style={[styles.sectionName, { color: colors.foreground }]}>{selectedSection}</Text>
                <Text style={[styles.sectionStudents, { color: colors.mutedForeground }]}>{data.students} students</Text>
              </View>
              <View style={styles.avgRow}>
                <Text style={[styles.avgLabel, { color: colors.mutedForeground }]}>Dept Average</Text>
                <Text style={[styles.avgVal, { color: data.avg >= 75 ? colors.success : colors.destructive }]}>{data.avg}%</Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                <View style={[styles.progressFill, { width: `${data.avg}%` as any, backgroundColor: data.avg >= 75 ? colors.success : colors.destructive }]} />
              </View>
              <View style={styles.alertRow}>
                <View style={[styles.alertChip, { backgroundColor: colors.destructive + "20" }]}>
                  <Feather name="alert-triangle" size={12} color={colors.destructive} />
                  <Text style={[styles.alertChipText, { color: colors.destructive }]}>{data.low} students below 75%</Text>
                </View>
              </View>
            </View>

            {/* Subject-wise */}
            <Text style={[styles.sectionHeader2, { color: colors.foreground }]}>Subject-wise ({selectedSection})</Text>
            {data.subjects.map((s, i) => (
              <View key={i} style={[styles.subjectRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subjectName, { color: colors.foreground }]}>{s.name}</Text>
                  <View style={[styles.miniTrack, { backgroundColor: colors.muted }]}>
                    <View style={[styles.miniFill, { width: `${s.avg}%` as any, backgroundColor: s.avg >= 75 ? colors.success : colors.destructive }]} />
                  </View>
                </View>
                <Text style={[styles.subjectPct, { color: s.avg >= 75 ? colors.success : colors.destructive }]}>{s.avg}%</Text>
              </View>
            ))}

            {/* All sections overview */}
            <Text style={[styles.sectionHeader2, { color: colors.foreground }]}>All Sections</Text>
            {SECTIONS.map((s) => {
              const d = SECTION_DATA[s];
              return (
                <Pressable key={s} onPress={() => setSelectedSection(s)} style={[styles.allSectRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={[styles.allSectName, { color: colors.foreground }]}>{s}</Text>
                  <View style={{ flex: 1, paddingHorizontal: 14 }}>
                    <View style={[styles.miniTrack, { backgroundColor: colors.muted }]}>
                      <View style={[styles.miniFill, { width: `${d.avg}%` as any, backgroundColor: d.avg >= 75 ? colors.success : colors.destructive }]} />
                    </View>
                  </View>
                  <Text style={[styles.allSectPct, { color: d.avg >= 75 ? colors.success : colors.destructive }]}>{d.avg}%</Text>
                </Pressable>
              );
            })}
          </>
        ) : (
          <>
            <View style={[styles.criticalBanner, { backgroundColor: colors.destructive + "15", borderColor: colors.destructive + "30" }]}>
              <Feather name="alert-circle" size={18} color={colors.destructive} />
              <Text style={[styles.criticalBannerText, { color: colors.destructive }]}>
                {CRITICAL_STUDENTS.length} students need immediate attention
              </Text>
            </View>
            {CRITICAL_STUDENTS.map((s, i) => (
              <View key={i} style={[styles.criticalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.criticalAvatar, { backgroundColor: s.risk === "High" ? colors.destructive + "20" : colors.warning + "20" }]}>
                  <Text style={[styles.criticalAvatarText, { color: s.risk === "High" ? colors.destructive : colors.warning }]}>{s.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.criticalName, { color: colors.foreground }]}>{s.name}</Text>
                  <Text style={[styles.criticalMeta, { color: colors.mutedForeground }]}>{s.regNo} · {s.section}</Text>
                  <View style={[styles.miniTrack, { backgroundColor: colors.muted, marginTop: 6 }]}>
                    <View style={[styles.miniFill, { width: `${s.pct}%` as any, backgroundColor: colors.destructive }]} />
                  </View>
                </View>
                <View style={{ alignItems: "flex-end", paddingLeft: 10 }}>
                  <Text style={[styles.criticalPct, { color: colors.destructive }]}>{s.pct}%</Text>
                  <View style={[styles.riskBadge, { backgroundColor: s.risk === "High" ? colors.destructive + "20" : colors.warning + "20" }]}>
                    <Text style={[styles.riskText, { color: s.risk === "High" ? colors.destructive : colors.warning }]}>{s.risk}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: {},
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sectionBtn: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 8 },
  sectionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  sectionCardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  sectionName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  sectionStudents: { fontSize: 13, fontFamily: "Inter_400Regular" },
  avgRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  avgLabel: { fontSize: 13, fontFamily: "Inter_500Medium" },
  avgVal: { fontSize: 28, fontFamily: "Inter_700Bold" },
  progressBg: { height: 8, borderRadius: 4, overflow: "hidden", marginBottom: 12 },
  progressFill: { height: 8, borderRadius: 4 },
  alertRow: { flexDirection: "row" },
  alertChip: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  alertChipText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionHeader2: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  subjectRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  subjectName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  miniTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  miniFill: { height: 6, borderRadius: 3 },
  subjectPct: { fontSize: 16, fontFamily: "Inter_700Bold" },
  allSectRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  allSectName: { fontSize: 13, fontFamily: "Inter_700Bold", width: 50 },
  allSectPct: { fontSize: 14, fontFamily: "Inter_700Bold", width: 44, textAlign: "right" },
  criticalBanner: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 12 },
  criticalBannerText: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1 },
  criticalCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  criticalAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  criticalAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  criticalName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  criticalMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  criticalPct: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 4 },
  riskBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  riskText: { fontSize: 10, fontFamily: "Inter_700Bold" },
});
