import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const MONTHLY_ATTENDANCE = [
  { month: "Aug", pct: 84 }, { month: "Sep", pct: 81 }, { month: "Oct", pct: 79 },
  { month: "Nov", pct: 86 }, { month: "Dec", pct: 83 }, { month: "Jan", pct: 82 },
];

const FEE_DATA = [
  { dept: "CSE", collected: 1820000, total: 2080000 },
  { dept: "ECE", collected: 1650000, total: 2040000 },
  { dept: "Mech", collected: 1420000, total: 1750000 },
  { dept: "Civil", collected: 1280000, total: 1650000 },
  { dept: "EEE", collected: 1120000, total: 1480000 },
  { dept: "IT", collected: 1560000, total: 1890000 },
];

const EXAM_STATS = [
  { label: "Pass %", value: "91%", color: "#059669" },
  { label: "Arrears", value: "124", color: "#DC2626" },
  { label: "Distinctions", value: "312", color: "#1565C0" },
  { label: "First Class", value: "876", color: "#7C3AED" },
];

type Tab = "attendance" | "fees" | "exams";

export default function AdminReports() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>("attendance");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const maxPct = Math.max(...MONTHLY_ATTENDANCE.map((m) => m.pct));

  const totalFeeCollected = FEE_DATA.reduce((s, d) => s + d.collected, 0);
  const totalFeeTarget = FEE_DATA.reduce((s, d) => s + d.total, 0);
  const feeCollectedPct = Math.round((totalFeeCollected / totalFeeTarget) * 100);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>Reports & Analytics</Text>
        <Text style={styles.subtitle}>Academic Year 2025-26</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["attendance", "fees", "exams"] as Tab[]).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[styles.tabBtn, tab === t && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
            <Text style={[styles.tabLabel, { color: tab === t ? colors.primary : colors.mutedForeground }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {tab === "attendance" && (
          <>
            {/* Bar chart */}
            <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.chartTitle, { color: colors.foreground }]}>Monthly Attendance Trend</Text>
              <View style={styles.barChart}>
                {MONTHLY_ATTENDANCE.map((m) => {
                  const h = (m.pct / maxPct) * 120;
                  const barColor = m.pct >= 83 ? colors.success : m.pct >= 78 ? colors.warning : colors.destructive;
                  return (
                    <View key={m.month} style={styles.barWrapper}>
                      <Text style={[styles.barPct, { color: barColor }]}>{m.pct}%</Text>
                      <View style={[styles.bar, { height: h, backgroundColor: barColor + "CC" }]} />
                      <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{m.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* College average */}
            <View style={[styles.summaryCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
              <Feather name="trending-up" size={20} color={colors.success} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.summaryLabel, { color: colors.success }]}>College Average Attendance</Text>
                <Text style={[styles.summaryVal, { color: colors.success }]}>83%</Text>
              </View>
            </View>

            {/* Dept breakdown */}
            <Text style={[styles.sectionHeader, { color: colors.foreground }]}>By Department</Text>
            {[
              { name: "CSE", pct: 82 }, { name: "ECE", pct: 79 }, { name: "Mech", pct: 85 },
              { name: "Civil", pct: 81 }, { name: "EEE", pct: 76 }, { name: "IT", pct: 84 },
            ].map((d) => (
              <View key={d.name} style={[styles.deptRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.deptName, { color: colors.foreground }]}>{d.name}</Text>
                <View style={{ flex: 1, paddingHorizontal: 14 }}>
                  <View style={[styles.miniTrack, { backgroundColor: colors.muted }]}>
                    <View style={[styles.miniFill, { width: `${d.pct}%` as any, backgroundColor: d.pct >= 80 ? colors.success : d.pct >= 75 ? colors.warning : colors.destructive }]} />
                  </View>
                </View>
                <Text style={[styles.deptPct, { color: d.pct >= 80 ? colors.success : d.pct >= 75 ? colors.warning : colors.destructive }]}>{d.pct}%</Text>
              </View>
            ))}
          </>
        )}

        {tab === "fees" && (
          <>
            <View style={[styles.feeOverview, { backgroundColor: colors.navy }]}>
              <Text style={styles.feeOverviewLabel}>Total Fee Collection</Text>
              <Text style={styles.feeOverviewVal}>₹{(totalFeeCollected / 100000).toFixed(1)}L</Text>
              <Text style={styles.feeOverviewOf}>of ₹{(totalFeeTarget / 100000).toFixed(1)}L target</Text>
              <View style={styles.feeBar}>
                <View style={[styles.feeBarFill, { width: `${feeCollectedPct}%` as any }]} />
              </View>
              <Text style={styles.feeBarLabel}>{feeCollectedPct}% collected</Text>
            </View>

            <Text style={[styles.sectionHeader, { color: colors.foreground }]}>By Department</Text>
            {FEE_DATA.map((d) => {
              const pct = Math.round((d.collected / d.total) * 100);
              return (
                <View key={d.dept} style={[styles.feeRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.feeRowHeader}>
                      <Text style={[styles.feeDept, { color: colors.foreground }]}>{d.dept}</Text>
                      <Text style={[styles.feePct, { color: pct >= 80 ? colors.success : colors.warning }]}>{pct}%</Text>
                    </View>
                    <Text style={[styles.feeMeta, { color: colors.mutedForeground }]}>₹{(d.collected / 100000).toFixed(1)}L of ₹{(d.total / 100000).toFixed(1)}L</Text>
                    <View style={[styles.miniTrack, { backgroundColor: colors.muted, marginTop: 6 }]}>
                      <View style={[styles.miniFill, { width: `${pct}%` as any, backgroundColor: pct >= 80 ? colors.success : colors.warning }]} />
                    </View>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {tab === "exams" && (
          <>
            <View style={styles.examGrid}>
              {EXAM_STATS.map((s) => (
                <View key={s.label} style={[styles.examCard, { backgroundColor: s.color + "10", borderColor: s.color + "30" }]}>
                  <Text style={[styles.examVal, { color: s.color }]}>{s.value}</Text>
                  <Text style={[styles.examLabel, { color: s.color + "CC" }]}>{s.label}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.examSummaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.examSummaryTitle, { color: colors.foreground }]}>Semester 5 Results</Text>
              {[
                { label: "Total Students Appeared", value: "1842" },
                { label: "Passed (All Clear)", value: "1674 (91%)" },
                { label: "Arrear in 1+ subjects", value: "124" },
                { label: "Toppers (≥90%)", value: "47" },
              ].map(({ label, value }) => (
                <View key={label} style={[styles.examSummaryRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.examSummaryKey, { color: colors.mutedForeground }]}>{label}</Text>
                  <Text style={[styles.examSummaryVal, { color: colors.foreground }]}>{value}</Text>
                </View>
              ))}
            </View>
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
  chartCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  chartTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 16 },
  barChart: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-around", height: 160 },
  barWrapper: { alignItems: "center", gap: 6 },
  barPct: { fontSize: 10, fontFamily: "Inter_700Bold" },
  bar: { width: 28, borderRadius: 6, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  barLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  summaryCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 16 },
  summaryLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  summaryVal: { fontSize: 28, fontFamily: "Inter_700Bold" },
  sectionHeader: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 10 },
  deptRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  deptName: { fontSize: 13, fontFamily: "Inter_700Bold", width: 44 },
  miniTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  miniFill: { height: 8, borderRadius: 4 },
  deptPct: { fontSize: 14, fontFamily: "Inter_700Bold", width: 40, textAlign: "right" },
  feeOverview: { borderRadius: 16, padding: 20, marginBottom: 16, alignItems: "center" },
  feeOverviewLabel: { color: "#93C5FD", fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 8 },
  feeOverviewVal: { color: "#FFF", fontSize: 40, fontFamily: "Inter_700Bold" },
  feeOverviewOf: { color: "#FFFFFF80", fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 12 },
  feeBar: { width: "100%", height: 10, backgroundColor: "#FFFFFF20", borderRadius: 5, overflow: "hidden", marginBottom: 6 },
  feeBarFill: { height: 10, backgroundColor: "#6EE7B7", borderRadius: 5 },
  feeBarLabel: { color: "#FFFFFF80", fontSize: 12, fontFamily: "Inter_400Regular" },
  feeRow: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8 },
  feeRowHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  feeDept: { fontSize: 14, fontFamily: "Inter_700Bold" },
  feePct: { fontSize: 14, fontFamily: "Inter_700Bold" },
  feeMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  examGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  examCard: { width: "47%", borderRadius: 14, borderWidth: 1, padding: 16, alignItems: "center" },
  examVal: { fontSize: 28, fontFamily: "Inter_700Bold", marginBottom: 4 },
  examLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  examSummaryCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  examSummaryTitle: { fontSize: 15, fontFamily: "Inter_700Bold", padding: 14, paddingBottom: 10 },
  examSummaryRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1 },
  examSummaryKey: { fontSize: 12, fontFamily: "Inter_500Medium", flex: 1 },
  examSummaryVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
