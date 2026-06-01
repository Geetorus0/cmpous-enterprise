import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const COLLEGE_STATS = {
  totalStudents: 1842,
  totalFaculty: 98,
  totalDepts: 8,
  totalSections: 42,
  avgAttendance: 83,
  activeNow: 1621,
};

const DEPT_OVERVIEW = [
  { name: "CSE", students: 245, faculty: 14, avg: 82 },
  { name: "ECE", students: 238, faculty: 12, avg: 79 },
  { name: "Mech", students: 192, faculty: 13, avg: 85 },
  { name: "Civil", students: 178, faculty: 11, avg: 81 },
  { name: "EEE", students: 165, faculty: 10, avg: 76 },
  { name: "IT", students: 210, faculty: 11, avg: 84 },
  { name: "MBA", students: 120, faculty: 8, avg: 88 },
  { name: "MCA", students: 98, faculty: 6, avg: 86 },
];

const RECENT_ACTIVITY = [
  { icon: "user-plus", msg: "12 new students enrolled in CSE", time: "2h ago", color: "#1565C0" },
  { icon: "alert-circle", msg: "Attendance below 75% for 34 students", time: "4h ago", color: "#DC2626" },
  { icon: "check-circle", msg: "Exam timetable published", time: "Yesterday", color: "#059669" },
  { icon: "upload", msg: "Question papers uploaded for Sem 5", time: "Yesterday", color: "#7C3AED" },
  { icon: "dollar-sign", msg: "Fee collection: ₹18.4L this month", time: "2d ago", color: "#D97706" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.collegeName}>Al-Ameen Engineering College</Text>
            <Text style={styles.adminLabel}>Admin Control Panel</Text>
          </View>
          <View style={[styles.liveBadge, { backgroundColor: "#10B98120" }]}>
            <View style={[styles.liveDot, { backgroundColor: "#10B981" }]} />
            <Text style={[styles.liveText, { color: "#10B981" }]}>Live</Text>
          </View>
        </View>
        <View style={styles.headerStatsRow}>
          {[
            { label: "Students", value: COLLEGE_STATS.totalStudents.toLocaleString() },
            { label: "Faculty", value: COLLEGE_STATS.totalFaculty },
            { label: "Depts", value: COLLEGE_STATS.totalDepts },
            { label: "Online", value: COLLEGE_STATS.activeNow.toLocaleString() },
          ].map((s) => (
            <View key={s.label} style={[styles.headerStat, { backgroundColor: "#FFFFFF15" }]}>
              <Text style={styles.headerStatVal}>{s.value}</Text>
              <Text style={styles.headerStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* College-wide avg attendance */}
        <View style={[styles.attendanceCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.attendanceLabel, { color: colors.mutedForeground }]}>College Avg Attendance</Text>
            <Text style={[styles.attendanceVal, { color: colors.primary }]}>{COLLEGE_STATS.avgAttendance}%</Text>
            <View style={[styles.attendanceBar, { backgroundColor: colors.muted }]}>
              <View style={[styles.attendanceFill, { width: `${COLLEGE_STATS.avgAttendance}%` as any, backgroundColor: colors.primary }]} />
            </View>
          </View>
          <View style={[styles.sectionsBadge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.sectionsBadgeText, { color: colors.primary }]}>{COLLEGE_STATS.totalSections}</Text>
            <Text style={[styles.sectionsBadgeLabel, { color: colors.primary + "99" }]}>sections</Text>
          </View>
        </View>

        {/* Department table */}
        <View style={{ paddingHorizontal: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Department Overview</Text>
          <View style={[styles.tableContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.tableHeader, { backgroundColor: colors.muted }]}>
              {["Dept", "Students", "Faculty", "Attendance"].map((h) => (
                <Text key={h} style={[styles.tableHeadCell, { color: colors.mutedForeground }]}>{h}</Text>
              ))}
            </View>
            {DEPT_OVERVIEW.map((d, i) => (
              <View key={d.name} style={[styles.tableBodyRow, { borderTopColor: colors.border, borderTopWidth: i === 0 ? 0 : 1 }]}>
                <Text style={[styles.tableBodyCell, { color: colors.foreground, fontFamily: "Inter_700Bold" }]}>{d.name}</Text>
                <Text style={[styles.tableBodyCell, { color: colors.foreground }]}>{d.students}</Text>
                <Text style={[styles.tableBodyCell, { color: colors.foreground }]}>{d.faculty}</Text>
                <Text style={[styles.tableBodyCell, { color: d.avg >= 80 ? colors.success : d.avg >= 75 ? colors.warning : colors.destructive, fontFamily: "Inter_700Bold" }]}>{d.avg}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent activity */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Recent Activity</Text>
          {RECENT_ACTIVITY.map((a, i) => (
            <View key={i} style={[styles.activityRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.activityIcon, { backgroundColor: a.color + "20" }]}>
                <Feather name={a.icon as any} size={16} color={a.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.activityMsg, { color: colors.foreground }]}>{a.msg}</Text>
                <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 },
  collegeName: { fontSize: 16, color: "#FFF", fontFamily: "Inter_700Bold" },
  adminLabel: { fontSize: 12, color: "#93C5FD", fontFamily: "Inter_500Medium", marginTop: 2 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  headerStatsRow: { flexDirection: "row", gap: 8 },
  headerStat: { flex: 1, borderRadius: 10, padding: 8, alignItems: "center" },
  headerStatVal: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  headerStatLabel: { color: "#93C5FD", fontSize: 9, fontFamily: "Inter_500Medium", marginTop: 2 },
  attendanceCard: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16, flexDirection: "row", alignItems: "center", gap: 16 },
  attendanceLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginBottom: 4 },
  attendanceVal: { fontSize: 36, fontFamily: "Inter_700Bold", marginBottom: 8 },
  attendanceBar: { height: 8, borderRadius: 4, overflow: "hidden" },
  attendanceFill: { height: 8, borderRadius: 4 },
  sectionsBadge: { borderRadius: 14, padding: 14, alignItems: "center" },
  sectionsBadgeText: { fontSize: 28, fontFamily: "Inter_700Bold" },
  sectionsBadgeLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },
  sectionHeader: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 10 },
  tableContainer: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  tableHeader: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 10 },
  tableHeadCell: { flex: 1, fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  tableBodyRow: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 12 },
  tableBodyCell: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  activityIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  activityMsg: { fontSize: 13, fontFamily: "Inter_500Medium", marginBottom: 2 },
  activityTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
