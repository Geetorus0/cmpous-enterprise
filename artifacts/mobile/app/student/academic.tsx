import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const SEMESTERS = [
  { sem: 1, sgpa: "8.2", subjects: [{ name: "Engineering Maths I", max: 100, scored: 82, grade: "B+" }, { name: "Engineering Physics", max: 100, scored: 76, grade: "B" }, { name: "Programming in C", max: 100, scored: 91, grade: "A+" }] },
  { sem: 2, sgpa: "8.5", subjects: [{ name: "Engineering Maths II", max: 100, scored: 85, grade: "A" }, { name: "Data Structures", max: 100, scored: 88, grade: "A" }, { name: "Digital Electronics", max: 100, scored: 82, grade: "B+" }] },
  { sem: 3, sgpa: "7.9", subjects: [{ name: "Discrete Maths", max: 100, scored: 78, grade: "B" }, { name: "OOP with Java", max: 100, scored: 80, grade: "B+" }, { name: "Computer Architecture", max: 100, scored: 75, grade: "B" }] },
  { sem: 4, sgpa: "8.8", subjects: [{ name: "Algorithms", max: 100, scored: 90, grade: "A+" }, { name: "Database Systems", max: 100, scored: 88, grade: "A" }, { name: "Software Engineering", max: 100, scored: 86, grade: "A" }] },
];

const INTERNAL_MARKS = [
  { subject: "Data Structures", ca1: 24, ca2: 22, ca3: 23, max: 25, total: 45, maxTotal: 50 },
  { subject: "Computer Networks", ca1: 21, ca2: 19, ca3: 22, max: 25, total: 38, maxTotal: 50 },
  { subject: "Database Management", ca1: 24, ca2: 23, ca3: 24, max: 25, total: 47, maxTotal: 50 },
  { subject: "Web Technologies", ca1: 22, ca2: 21, ca3: 23, max: 25, total: 42, maxTotal: 50 },
  { subject: "Operating Systems", ca1: 19, ca2: 18, ca3: 20, max: 25, total: 35, maxTotal: 50 },
];

export default function StudentAcademic() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"marks" | "internal">("marks");
  const [expandedSem, setExpandedSem] = useState<number | null>(4);
  const [downloading, setDownloading] = useState(false);
  const cgpa = "8.40";
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleDownloadMarksheet = (sem: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        t("success"),
        `Semester ${sem} Marksheet (AEC_SEM${sem}_Result.pdf) has been downloaded to your local storage.`
      );
    }, 1500);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>{t("academic_records")}</Text>
        <View style={styles.cgpaRow}>
          <View style={[styles.cgpaBadge, { backgroundColor: "#FFFFFF20" }]}>
            <Text style={styles.cgpaLabel}>{t("cgpa")}</Text>
            <Text style={styles.cgpaVal}>{cgpa}</Text>
          </View>
          <View style={[styles.cgpaBadge, { backgroundColor: "#FFFFFF20" }]}>
            <Text style={styles.cgpaLabel}>{t("arrears")}</Text>
            <Text style={styles.cgpaVal}>0</Text>
          </View>
          <View style={[styles.cgpaBadge, { backgroundColor: "#FFFFFF20" }]}>
            <Text style={styles.cgpaLabel}>Sem</Text>
            <Text style={styles.cgpaVal}>5</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["marks", "internal"] as const).map((tId) => (
          <Pressable
            key={tId}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTab(tId); }}
            style={[styles.tabBtn, tab === tId && [styles.tabActive, { borderBottomColor: colors.primary }]]}
          >
            <Text style={[styles.tabLabel, { color: tab === tId ? colors.primary : colors.mutedForeground }]}>
              {tId === "marks" ? t("semester_marks") : t("internal_marks")}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {downloading && (
          <View style={[styles.downloadBox, { backgroundColor: colors.primary + "15", borderColor: colors.primary }]}>
            <ActivityIndicator color={colors.primary} size="small" style={{ marginRight: 10 }} />
            <Text style={[styles.downloadText, { color: colors.primary }]}>{t("downloading")}</Text>
          </View>
        )}

        {tab === "marks" ? (
          <View>
            {/* Visual Analytics Progress Card */}
            <View style={[styles.analyticsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.analyticsTitle, { color: colors.foreground }]}>Semester Trend Analysis</Text>
              <View style={styles.chartWrapper}>
                {SEMESTERS.map((s) => {
                  const val = parseFloat(s.sgpa);
                  const maxVal = 10;
                  const pct = (val / maxVal) * 100;
                  return (
                    <View key={s.sem} style={styles.chartCol}>
                      <View style={[styles.chartBarWrapper, { backgroundColor: colors.muted }]}>
                        <View style={[styles.chartBarFill, { height: `${pct}%` as any, backgroundColor: colors.primary }]} />
                      </View>
                      <Text style={[styles.chartLabel, { color: colors.mutedForeground }]}>Sem {s.sem}</Text>
                      <Text style={[styles.chartVal, { color: colors.foreground }]}>{s.sgpa}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Semester Details */}
            {SEMESTERS.map((s) => (
              <Pressable
                key={s.sem}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setExpandedSem(expandedSem === s.sem ? null : s.sem); }}
                style={[styles.semCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={styles.semHeader}>
                  <View style={[styles.semBadge, { backgroundColor: colors.primary + "18" }]}>
                    <Text style={[styles.semBadgeText, { color: colors.primary }]}>Sem {s.sem}</Text>
                  </View>
                  <View style={{ flex: 1, paddingLeft: 12 }}>
                    <Text style={[styles.sgpaText, { color: colors.foreground }]}>SGPA: <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold" }}>{s.sgpa}</Text></Text>
                  </View>
                  <Feather name={expandedSem === s.sem ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
                </View>
                {expandedSem === s.sem && (
                  <View style={[styles.subjectTable, { borderTopColor: colors.border }]}>
                    <View style={[styles.tableRow, { backgroundColor: colors.muted }]}>
                      <Text style={[styles.tableHead, { color: colors.mutedForeground, flex: 2 }]}>Subject</Text>
                      <Text style={[styles.tableHead, { color: colors.mutedForeground, textAlign: "center" }]}>Score</Text>
                      <Text style={[styles.tableHead, { color: colors.mutedForeground, textAlign: "center" }]}>Grade</Text>
                    </View>
                    {s.subjects.map((sub, i) => (
                      <View key={i} style={[styles.tableRow, { borderTopColor: colors.border, borderTopWidth: i === 0 ? 0 : 1 }]}>
                        <Text style={[styles.tableCell, { color: colors.foreground, flex: 2, fontSize: 13 }]} numberOfLines={2}>{sub.name}</Text>
                        <Text style={[styles.tableCell, { color: colors.foreground, textAlign: "center" }]}>{sub.scored}/{sub.max}</Text>
                        <View style={{ alignItems: "center" }}>
                          <View style={[styles.gradeBadge, { backgroundColor: sub.scored >= 85 ? colors.success + "20" : sub.scored >= 75 ? colors.primary + "20" : colors.warning + "20" }]}>
                            <Text style={[styles.gradeText, { color: sub.scored >= 85 ? colors.success : sub.scored >= 75 ? colors.primary : colors.warning }]}>{sub.grade}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                    <Pressable
                      onPress={() => handleDownloadMarksheet(s.sem)}
                      style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
                    >
                      <Feather name="download" size={14} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.downloadBtnText}>{t("download_marksheet")}</Text>
                    </Pressable>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        ) : (
          <View>
            <View style={[styles.internalHeader, { backgroundColor: colors.muted, borderRadius: 10 }]}>
              <Text style={[styles.internalHead, { color: colors.mutedForeground, flex: 2.2, textAlign: "left" }]}>Subject</Text>
              <Text style={[styles.internalHead, { color: colors.mutedForeground }]}>CA1</Text>
              <Text style={[styles.internalHead, { color: colors.mutedForeground }]}>CA2</Text>
              <Text style={[styles.internalHead, { color: colors.mutedForeground }]}>CA3</Text>
              <Text style={[styles.internalHead, { color: colors.mutedForeground, flex: 1.2 }]}>Total</Text>
            </View>
            {INTERNAL_MARKS.map((m, i) => {
              const pct = (m.total / m.maxTotal) * 100;
              const color = pct >= 80 ? colors.success : pct >= 70 ? colors.primary : colors.warning;
              return (
                <View key={i} style={[styles.internalCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.internalDataRow}>
                    <Text style={[styles.internalCell, { color: colors.foreground, flex: 2.2, fontFamily: "Inter_600SemiBold", textAlign: "left" }]} numberOfLines={1}>{m.subject}</Text>
                    <Text style={[styles.internalCell, { color: colors.mutedForeground }]}>{m.ca1}</Text>
                    <Text style={[styles.internalCell, { color: colors.mutedForeground }]}>{m.ca2}</Text>
                    <Text style={[styles.internalCell, { color: colors.mutedForeground }]}>{m.ca3}</Text>
                    <View style={{ flex: 1.2, alignItems: "center" }}>
                      <Text style={[styles.internalCell, { color, fontFamily: "Inter_700Bold" }]}>{m.total}/{m.maxTotal}</Text>
                    </View>
                  </View>
                  {/* Visual performance bars */}
                  <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                    <View style={[styles.progressFill, { width: `${pct}%` as any, backgroundColor: color }]} />
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 18 },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold", marginBottom: 12 },
  cgpaRow: { flexDirection: "row", gap: 10 },
  cgpaBadge: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, alignItems: "center", minWidth: 70 },
  cgpaLabel: { color: "#93C5FD", fontSize: 11, fontFamily: "Inter_500Medium" },
  cgpaVal: { color: "#FFF", fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 2 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabActive: {},
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  downloadBox: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 14 },
  downloadText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  analyticsCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 14 },
  analyticsTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 16 },
  chartWrapper: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", height: 110, paddingBottom: 4 },
  chartCol: { alignItems: "center" },
  chartBarWrapper: { width: 14, height: 60, borderRadius: 7, overflow: "hidden", marginBottom: 6, justifyContent: "flex-end" },
  chartBarFill: { width: 14, borderRadius: 7 },
  chartLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  chartVal: { fontSize: 11, fontFamily: "Inter_700Bold", marginTop: 2 },
  semCard: { borderRadius: 16, borderWidth: 1, marginBottom: 12, overflow: "hidden" },
  semHeader: { flexDirection: "row", alignItems: "center", padding: 14 },
  semBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  semBadgeText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  sgpaText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  subjectTable: { borderTopWidth: 1, padding: 14 },
  tableRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 10 },
  tableHead: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, textTransform: "uppercase" },
  tableCell: { fontSize: 13, fontFamily: "Inter_400Regular" },
  gradeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, minWidth: 32, alignItems: "center" },
  gradeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  downloadBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 10, paddingVertical: 10, marginTop: 14 },
  downloadBtnText: { color: "#FFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  internalHeader: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, paddingHorizontal: 16 },
  internalHead: { fontSize: 10, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  internalCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 8, paddingHorizontal: 16 },
  internalDataRow: { flexDirection: "row", alignItems: "center" },
  internalCell: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden", marginTop: 10 },
  progressFill: { height: 4, borderRadius: 2 },
});
