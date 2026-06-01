import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

const SUBJECTS = [
  { code: "CS5001", name: "Data Structures", conducted: 45, attended: 36, faculty: "Dr. Priya Sharma" },
  { code: "CS5002", name: "Computer Networks", conducted: 42, attended: 30, faculty: "Dr. A. Kumar" },
  { code: "CS5003", name: "Database Management", conducted: 40, attended: 35, faculty: "Mr. S. Rajan" },
  { code: "CS5004", name: "Web Technologies", conducted: 36, attended: 27, faculty: "Dr. Priya Sharma" },
  { code: "CS5005", name: "Operating Systems", conducted: 44, attended: 28, faculty: "Dr. M. Venkat" },
  { code: "HS5001", name: "Soft Skills", conducted: 24, attended: 22, faculty: "Ms. T. Lakshmi" },
];

const CALENDAR_DATA: Record<string, "P" | "A" | "L"> = {
  "2026-05-01": "P", "2026-05-04": "P", "2026-05-05": "P", "2026-05-06": "A", "2026-05-07": "P", "2026-05-08": "P",
  "2026-05-11": "P", "2026-05-12": "L", "2026-05-13": "P", "2026-05-14": "P", "2026-05-15": "P",
  "2026-05-18": "P", "2026-05-19": "P", "2026-05-20": "A", "2026-05-21": "P", "2026-05-22": "P",
  "2026-05-25": "P",
};

const WEEKLY_DATA = [
  { day: "Mon", rate: 100 },
  { day: "Tue", rate: 80 },
  { day: "Wed", rate: 60 },
  { day: "Thu", rate: 100 },
  { day: "Fri", rate: 100 },
];

function AttendanceBar({ pct, colors }: { pct: number; colors: any }) {
  const color = pct >= 75 ? colors.success : pct >= 65 ? colors.warning : colors.destructive;
  return (
    <View style={{ marginTop: 8 }}>
      <View style={[ab.track, { backgroundColor: colors.muted }]}>
        <View style={[ab.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}
const ab = StyleSheet.create({
  track: { height: 6, borderRadius: 3, overflow: "hidden" },
  fill: { height: 6, borderRadius: 3 },
});

export default function StudentAttendance() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [showNotifPreview, setShowNotifPreview] = useState(true);
  
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const overall = Math.round(SUBJECTS.reduce((s, x) => s + (x.attended / x.conducted) * 100, 0) / SUBJECTS.length);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>{t("attendance")}</Text>
        <Text style={styles.subtitle}>Semester 5 · Section A</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {/* Real-time Alert Notification Preview Card */}
        {showNotifPreview && (
          <View style={styles.notifWrapper}>
            <View style={[styles.notifCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
              <View style={styles.notifHeader}>
                <View style={styles.notifTitleRow}>
                  <View style={[styles.bellCircle, { backgroundColor: colors.primary + "12" }]}>
                    <Feather name="bell" size={12} color={colors.primary} />
                  </View>
                  <Text style={[styles.notifAlertTitle, { color: colors.foreground }]}>Timely Attendance Alert</Text>
                </View>
                <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowNotifPreview(false); }}>
                  <Feather name="x" size={14} color={colors.mutedForeground} />
                </Pressable>
              </View>
              <Text style={[styles.notifAlertBody, { color: colors.mutedForeground }]}>
                "You were marked <Text style={{ color: colors.success, fontFamily: "Inter_600SemiBold" }}>PRESENT</Text> for Data Structures (CS5001) in Period 1 (8:00 AM - 9:00 AM) today."
              </Text>
              <Text style={styles.notifAlertTime}>Just now</Text>
            </View>
          </View>
        )}

        {/* Overall card */}
        <View style={[styles.overallCard, { backgroundColor: colors.primary }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.overallLabel}>{t("overall")} {t("attendance")}</Text>
            <Text style={styles.overallPct}>{overall}%</Text>
            <Text style={styles.overallSub}>{overall >= 75 ? t("eligible") : t("low_attendance")}</Text>
          </View>
          <View style={[styles.overallCircle, { borderColor: "#FFFFFF40", backgroundColor: "#FFFFFF15" }]}>
            <Feather name={overall >= 75 ? "check-circle" : "alert-triangle"} size={32} color="#FFF" />
          </View>
        </View>

        {/* Weekly Attendance Graph */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Weekly Attendance Rate</Text>
          <View style={[styles.graphCard, { backgroundColor: colors.card }]}>
            <View style={styles.graphRow}>
              {WEEKLY_DATA.map((w) => (
                <View key={w.day} style={styles.graphCol}>
                  <View style={[styles.barContainer, { backgroundColor: colors.muted }]}>
                    <View style={[styles.barFill, { height: `${w.rate}%` as any, backgroundColor: w.rate >= 80 ? colors.success : colors.warning }]} />
                  </View>
                  <Text style={[styles.graphDayText, { color: colors.mutedForeground }]}>{w.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Subject list */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>{t("subject_wise")}</Text>
          {SUBJECTS.map((s) => {
            const pct = Math.round((s.attended / s.conducted) * 100);
            const color = pct >= 75 ? colors.success : pct >= 65 ? colors.warning : colors.destructive;
            const needed = pct < 75 ? Math.ceil((0.75 * s.conducted - s.attended) / 0.25) : 0;
            const isOpen = selectedSubject === s.code;
            return (
              <Pressable
                key={s.code}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedSubject(isOpen ? null : s.code); }}
                style={[styles.subjectCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.subjectRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.subjectName, { color: colors.foreground }]}>{s.name}</Text>
                    <Text style={[styles.subjectCode, { color: colors.mutedForeground }]}>{s.code} · {s.faculty}</Text>
                    <AttendanceBar pct={pct} colors={colors} />
                  </View>
                  <View style={{ alignItems: "flex-end", paddingLeft: 12 }}>
                    <Text style={[styles.pctBig, { color }]}>{pct}%</Text>
                    <Text style={[styles.pctSub, { color: colors.mutedForeground }]}>{s.attended}/{s.conducted}</Text>
                  </View>
                </View>
                {isOpen && (
                  <View style={[styles.expanded, { borderTopColor: colors.border }]}>
                    <Text style={[styles.expandedText, { color: colors.mutedForeground }]}>Conducted: {s.conducted} classes</Text>
                    <Text style={[styles.expandedText, { color: colors.mutedForeground }]}>Attended: {s.attended} classes</Text>
                    {needed > 0 ? (
                      <View style={[styles.expandBadge, { backgroundColor: colors.destructive + "12" }]}>
                        <Feather name="info" size={12} color={colors.destructive} style={{ marginRight: 6 }} />
                        <Text style={[styles.expandedAlert, { color: colors.destructive }]}>
                          Attend next {needed} consecutive classes to reach 75%
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.expandBadge, { backgroundColor: colors.success + "12" }]}>
                        <Feather name="check-circle" size={12} color={colors.success} style={{ marginRight: 6 }} />
                        <Text style={[styles.expandedGood, { color: colors.success }]}>
                          {t("eligible")}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Heatmap Calendar */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>May 2026 Heatmap</Text>
          <View style={[styles.calendarCard, { backgroundColor: colors.card }]}>
            <View style={styles.calDaysRow}>
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <Text key={i} style={[styles.calDay, { color: colors.mutedForeground }]}>{d}</Text>
              ))}
            </View>
            <View style={styles.calGrid}>
              {/* Add empty padding cells for 2026-05-01 starting on a Friday */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.calCellEmpty} />
              ))}
              
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const key = `2026-05-${String(day).padStart(2, "0")}`;
                const status = CALENDAR_DATA[key];
                return (
                  <View
                    key={i}
                    style={[
                      styles.calCell,
                      status === "P" ? { backgroundColor: colors.success + "18" } :
                      status === "A" ? { backgroundColor: colors.destructive + "18" } :
                      status === "L" ? { backgroundColor: colors.warning + "18" } : {},
                    ]}
                  >
                    <Text style={[styles.calNum, { color: status ? (status === "P" ? colors.success : status === "A" ? colors.destructive : colors.warning) : colors.foreground }]}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
            
            {/* Calendar Legend */}
            <View style={[styles.calLegend, { borderTopColor: colors.border }]}>
              {[
                [colors.success, t("present")],
                [colors.destructive, t("absent")],
                [colors.warning, t("late")],
              ].map(([c, label]) => (
                <View key={label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: c }]} />
                  <Text style={[styles.legendLabel, { color: colors.mutedForeground }]}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  notifWrapper: { paddingHorizontal: 16, marginTop: 12 },
  notifCard: { borderLeftWidth: 3, borderRadius: 12, padding: 14, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  notifHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  notifTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bellCircle: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  notifAlertTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  notifAlertBody: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 6, lineHeight: 18 },
  notifAlertTime: { fontSize: 10, fontFamily: "Inter_500Medium", color: "#94A3B8", marginTop: 6 },
  overallCard: { margin: 16, borderRadius: 18, padding: 20, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  overallLabel: { color: "#FFFFFFB3", fontSize: 13, fontFamily: "Inter_500Medium" },
  overallPct: { color: "#FFF", fontSize: 38, fontFamily: "Inter_700Bold", marginVertical: 4 },
  overallSub: { color: "#FFFFFFB3", fontSize: 11, fontFamily: "Inter_400Regular" },
  overallCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  sectionHeader: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  graphCard: { borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 6, elevation: 1 },
  graphRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", height: 80 },
  graphCol: { alignItems: "center" },
  barContainer: { width: 16, height: 60, borderRadius: 8, overflow: "hidden", marginBottom: 6, justifyContent: "flex-end" },
  barFill: { width: 16, borderRadius: 8 },
  graphDayText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  subjectCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8 },
  subjectRow: { flexDirection: "row", alignItems: "center" },
  subjectName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  subjectCode: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  pctBig: { fontSize: 18, fontFamily: "Inter_700Bold" },
  pctSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  expanded: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, gap: 6 },
  expandedText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  expandBadge: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginTop: 4 },
  expandedAlert: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1 },
  expandedGood: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1 },
  calendarCard: { borderRadius: 16, padding: 16, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 6, elevation: 1 },
  calDaysRow: { flexDirection: "row", marginBottom: 10 },
  calDay: { flex: 1, textAlign: "center", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  calGrid: { flexDirection: "row", flexWrap: "wrap" },
  calCellEmpty: { width: "14.28%", aspectRatio: 1 },
  calCell: { width: "14.28%", aspectRatio: 1, alignItems: "center", justifyContent: "center", borderRadius: 8, marginVertical: 2 },
  calNum: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  calLegend: { flexDirection: "row", gap: 16, marginTop: 14, paddingTop: 14, borderTopWidth: 1, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
});
