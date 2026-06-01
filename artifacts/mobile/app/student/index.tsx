import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, StudentUser } from "@/context/AuthContext";
import { useTranslation } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

const SUBJECTS = [
  { code: "CS5001", name: "Data Structures", attendance: 80, minRequired: 75 },
  { code: "CS5002", name: "Computer Networks", attendance: 72, minRequired: 75 },
  { code: "CS5003", name: "Database Management", attendance: 88, minRequired: 75 },
  { code: "CS5004", name: "Web Technologies", attendance: 75, minRequired: 75 },
  { code: "CS5005", name: "Operating Systems", attendance: 65, minRequired: 75 },
  { code: "HS5001", name: "Soft Skills", attendance: 92, minRequired: 75 },
];

const TODAY_TIMETABLE = [
  { time: "8:00 - 9:00", subject: "Data Structures", room: "CSE-301", faculty: "Dr. Priya Sharma", status: "done" },
  { time: "9:00 - 10:00", subject: "Computer Networks", room: "CSE-302", faculty: "Dr. Kumar", status: "current" },
  { time: "10:15 - 11:15", subject: "Database Management", room: "CSE-Lab", faculty: "Mr. Rajan", status: "upcoming" },
  { time: "11:15 - 12:15", subject: "Web Technologies", room: "CSE-301", faculty: "Dr. Priya Sharma", status: "upcoming" },
];

const NOTIFICATIONS = [
  { id: "1", title: "Attendance Warning", body: "OS attendance below 75% — 65%", type: "warning", time: "2h ago" },
  { id: "2", title: "Fee Due", body: "Term fee ₹35,000 due by Jan 15", type: "error", time: "1d ago" },
  { id: "3", title: "Assignment", body: "DS Assignment 3 uploaded", type: "info", time: "2d ago" },
];

function StatCard({ label, value, color, icon, colors, onPress }: { label: string; value: string; color: string; icon: string; colors: any; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.statCard, { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 }]}>
      <View style={[styles.statIconWrapper, { backgroundColor: color + "12" }]}>
        <Feather name={icon as any} size={16} color={color} />
      </View>
      <View style={{ marginTop: 8 }}>
        <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

function AttendanceRing({ pct, colors }: { pct: number; colors: any }) {
  const color = pct >= 75 ? colors.success : pct >= 65 ? colors.warning : colors.destructive;
  return (
    <View style={[ar.ring, { borderColor: color + "30", backgroundColor: color + "10" }]}>
      <Text style={[ar.pct, { color }]}>{pct}%</Text>
      <Text style={[ar.sub, { color: colors.mutedForeground }]}>Overall</Text>
    </View>
  );
}
const ar = StyleSheet.create({
  ring: { width: 88, height: 88, borderRadius: 44, borderWidth: 4.5, alignItems: "center", justifyContent: "center" },
  pct: { fontSize: 20, fontFamily: "Inter_700Bold" },
  sub: { fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 1 },
});

export default function StudentDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const student = user as StudentUser;

  const overallAttendance = Math.round(SUBJECTS.reduce((s, x) => s + x.attendance, 0) / SUBJECTS.length);
  const lowAttendance = SUBJECTS.filter((s) => s.attendance < 75);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleStatPress = (target: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (target === "fees") {
      router.push("/student/fees");
    } else if (target === "attendance") {
      router.push("/student/attendance");
    } else if (target === "academic") {
      router.push("/student/academic");
    } else {
      router.push("/student/more");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Container */}
      <View style={{ overflow: "hidden", borderBottomLeftRadius: 32, borderBottomRightRadius: 32, elevation: 8, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10 }}>
        <LinearGradient colors={["#0A1628", "#1A365D", "#15427E"]} style={[styles.headerGradient, { paddingTop: topPad + 12 }]}>
          <View style={styles.headerRow}>
            {/* Hamburger menu trigger */}
            <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setMenuOpen(true); }} style={styles.headerIconBtn}>
              <Feather name="menu" size={20} color="#FFF" />
            </Pressable>
            
            <View style={{ alignItems: "center" }}>
              <Text style={styles.greeting}>{t("good_morning")}</Text>
              <Text style={styles.name}>{student?.name?.split(" ")[0] ?? "Student"}</Text>
            </View>

            {/* Notification bell */}
            <Pressable onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} style={styles.headerIconBtn}>
              <Feather name="bell" size={20} color="#FFF" />
              <View style={styles.notifDot} />
            </Pressable>
          </View>

          {/* Student Profile Info */}
          <View style={styles.profileMetaRow}>
            <View style={[styles.avatarWrapper, { borderColor: colors.primary }]}>
              <Text style={styles.avatarText}>{student?.avatar ?? "S"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileRegNo}>{student?.registerNumber ?? "22CS001"}</Text>
              <Text style={styles.profileDept}>{student?.course ?? "B.E. Computer Science"}</Text>
              <Text style={styles.profileSem}>Semester {student?.semester ?? 5} · Section {student?.section ?? "A"}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90, paddingTop: 8 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Futuristic AI Insights Banner */}
        <View style={styles.aiBannerWrapper}>
          <LinearGradient colors={[colors.primary + "12", colors.accent + "18"]} style={[styles.aiBanner, { borderColor: colors.border }]}>
            <View style={styles.aiHeader}>
              <Feather name="cpu" size={16} color={colors.primary} />
              <Text style={[styles.aiTitle, { color: colors.primary }]}>{t("ai_assistant").toUpperCase()}</Text>
            </View>
            <Text style={[styles.aiMessage, { color: colors.foreground }]}>
              "Your attendance is healthy at {overallAttendance}%. You have outstanding internal scores in Database Management (45/50). Pay Sem 5 fees of ₹35k before Jan 15."
            </Text>
          </LinearGradient>
        </View>

        {/* Overall Attendance Card */}
        <Pressable onPress={() => handleStatPress("attendance")} style={({ pressed }) => [styles.attCard, { backgroundColor: colors.card, opacity: pressed ? 0.95 : 1 }]}>
          <View style={styles.attRow}>
            <AttendanceRing pct={overallAttendance} colors={colors} />
            <View style={{ flex: 1, paddingLeft: 18 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{t("attendance")}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </View>
              {lowAttendance.length > 0 ? (
                <View style={[styles.alertBadge, { backgroundColor: colors.destructive + "15" }]}>
                  <Feather name="alert-triangle" size={12} color={colors.destructive} />
                  <Text style={[styles.alertText, { color: colors.destructive }]}>
                    {lowAttendance.length} {t("subjects")} {t("low_attendance")}
                  </Text>
                </View>
              ) : (
                <View style={[styles.alertBadge, { backgroundColor: colors.success + "15" }]}>
                  <Feather name="check" size={12} color={colors.success} />
                  <Text style={[styles.alertText, { color: colors.success }]}>
                    {t("eligible")}
                  </Text>
                </View>
              )}
              <Text style={[styles.lowSubjectText, { color: colors.mutedForeground }]}>
                {SUBJECTS[4].name}: <Text style={{ color: colors.destructive, fontFamily: "Inter_600SemiBold" }}>{SUBJECTS[4].attendance}%</Text>
              </Text>
            </View>
          </View>
        </Pressable>

        {/* Dashboard Grid Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            label={t("cgpa")}
            value={student?.cgpa ?? "8.40"}
            color={colors.primary}
            icon="star"
            colors={colors}
            onPress={() => handleStatPress("academic")}
          />
          <StatCard
            label={t("fees_due")}
            value="₹35,000"
            color={colors.destructive}
            icon="dollar-sign"
            colors={colors}
            onPress={() => handleStatPress("fees")}
          />
          <StatCard
            label={t("scholarship")}
            value="Active"
            color={colors.success}
            icon="award"
            colors={colors}
            onPress={() => handleStatPress("more")}
          />
          <StatCard
            label={t("arrears")}
            value="0"
            color="#A855F7"
            icon="alert-circle"
            colors={colors}
            onPress={() => handleStatPress("academic")}
          />
        </View>

        {/* Timetable schedule list */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeader, { color: colors.foreground }]}>{t("schedule")}</Text>
            <Feather name="calendar" size={16} color={colors.mutedForeground} />
          </View>
          {TODAY_TIMETABLE.map((cls, i) => (
            <View
              key={i}
              style={[
                styles.classCard,
                {
                  backgroundColor: cls.status === "current" ? colors.primary + "12" : colors.card,
                  borderColor: cls.status === "current" ? colors.primary + "50" : colors.border,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.classSubject, { color: colors.foreground }]}>{cls.subject}</Text>
                <Text style={[styles.classMeta, { color: colors.mutedForeground }]}>{cls.faculty} · {cls.room}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.classTime, { color: cls.status === "current" ? colors.primary : colors.mutedForeground }]}>{cls.time}</Text>
                {cls.status === "current" ? (
                  <View style={[styles.liveBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.liveBadgeText}>NOW</Text>
                  </View>
                ) : cls.status === "done" ? (
                  <Feather name="check-circle" size={14} color={colors.success} style={{ marginTop: 4 }} />
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeader, { color: colors.foreground }]}>{t("notifications")}</Text>
            <Feather name="bell" size={16} color={colors.mutedForeground} />
          </View>
          {NOTIFICATIONS.map((n) => (
            <View key={n.id} style={[styles.notifCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.notifIcon, { backgroundColor: n.type === "warning" ? colors.warning + "18" : n.type === "error" ? colors.destructive + "18" : colors.info + "18" }]}>
                <Feather
                  name={n.type === "warning" ? "alert-triangle" : n.type === "error" ? "credit-card" : "file-text"}
                  size={14}
                  color={n.type === "warning" ? colors.warning : n.type === "error" ? colors.destructive : colors.info}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.notifTitle, { color: colors.foreground }]}>{n.title}</Text>
                <Text style={[styles.notifBody, { color: colors.mutedForeground }]}>{n.body}</Text>
              </View>
              <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{n.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Simulated Hamburger Drawer Modal */}
      <Modal transparent visible={menuOpen} animationType="fade" onRequestClose={() => setMenuOpen(false)}>
        <Pressable onPress={() => setMenuOpen(false)} style={styles.modalOverlay}>
          <View style={[styles.drawerContainer, { backgroundColor: colors.card }]}>
            <View style={[styles.drawerHeader, { backgroundColor: colors.navy }]}>
              <View style={[styles.avatarWrapper, { width: 44, height: 44, borderRadius: 14 }]}>
                <Text style={styles.avatarText}>{student?.avatar ?? "S"}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={styles.drawerName}>{student?.name}</Text>
                <Text style={styles.drawerEmail}>{student?.email}</Text>
              </View>
            </View>

            <View style={styles.drawerMenu}>
              {[
                { icon: "user", label: "Profile" },
                { icon: "message-square", label: "AI Assistant", path: "/student/ai_chat" },
                { icon: "map-pin", label: "Live Bus Tracker" },
                { icon: "book", label: "Library Catalog" },
                { icon: "home", label: "Hostel Details" },
                { icon: "settings", label: "Settings", path: "/student/more" },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMenuOpen(false);
                    if (item.path) router.push(item.path as any);
                  }}
                  style={({ pressed }) => [styles.drawerItem, { opacity: pressed ? 0.7 : 1 }]}
                >
                  <Feather name={item.icon as any} size={18} color={colors.primary} />
                  <Text style={[styles.drawerItemLabel, { color: colors.foreground }]}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
            
            <View style={styles.drawerFooter}>
              <Text style={[styles.drawerFooterText, { color: colors.mutedForeground }]}>{t("developed_by")}</Text>
              <Text style={[styles.drawerFooterVersion, { color: colors.mutedForeground }]}>v1.0.0 (Production)</Text>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerIconBtn: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF15" },
  greeting: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular" },
  name: { fontSize: 20, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginTop: 1 },
  notifDot: { position: "absolute", top: 10, right: 10, width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#EF4444" },
  profileMetaRow: { flexDirection: "row", gap: 14, marginTop: 18, alignItems: "center" },
  avatarWrapper: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#3B82F633", borderWidth: 1.5 },
  avatarText: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  profileRegNo: { color: "#93C5FD", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  profileDept: { color: "#FFF", fontSize: 13, fontFamily: "Inter_700Bold", marginTop: 1 },
  profileSem: { color: "#FFFFFFB3", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  aiBannerWrapper: { paddingHorizontal: 16, marginTop: 12 },
  aiBanner: { borderRadius: 16, padding: 14, borderWidth: 1, borderStyle: "dashed" },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  aiTitle: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.8 },
  aiMessage: { fontSize: 12, fontFamily: "Inter_500Medium", lineHeight: 18 },
  attCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 18, padding: 16, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  attRow: { flexDirection: "row", alignItems: "center" },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  alertBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginVertical: 6, alignSelf: "flex-start" },
  alertText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  lowSubjectText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginHorizontal: 16, marginTop: 12 },
  statCard: { width: "48.5%", borderRadius: 16, padding: 14, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  statIconWrapper: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionHeader: { fontSize: 15, fontFamily: "Inter_700Bold" },
  classCard: { borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  classSubject: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  classMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  classTime: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "right" },
  liveBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4 },
  liveBadgeText: { color: "#FFF", fontSize: 9, fontFamily: "Inter_700Bold" },
  notifCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 8 },
  notifIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  notifTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 1 },
  notifBody: { fontSize: 11, fontFamily: "Inter_400Regular" },
  notifTime: { fontSize: 10, fontFamily: "Inter_400Regular" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", flexDirection: "row" },
  drawerContainer: { width: 280, height: "100%", borderTopRightRadius: 20, borderBottomRightRadius: 20, overflow: "hidden" },
  drawerHeader: { padding: 20, paddingTop: 48, flexDirection: "row", alignItems: "center" },
  drawerName: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
  drawerEmail: { color: "#93C5FD", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  drawerMenu: { padding: 16, gap: 4 },
  drawerItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 12, borderRadius: 10 },
  drawerItemLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  drawerFooter: { position: "absolute", bottom: 20, left: 20, right: 20 },
  drawerFooterText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  drawerFooterVersion: { fontSize: 9, fontFamily: "Inter_400Regular", marginTop: 2 },
});
