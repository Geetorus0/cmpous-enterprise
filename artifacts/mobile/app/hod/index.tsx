import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, HodUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";
import { useGetHodDashboard } from "@workspace/api-client-react";



export default function HODDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const hod = user as HodUser;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const toggleLanguage = () => {
    const order: Locale[] = ["en", "ta", "te", "hi", "ml", "ur", "kn"];
    const nextIdx = (order.indexOf(locale) + 1) % order.length;
    setLocale(order[nextIdx]);
  };

  const { data: dashboardData, isLoading, refetch } = useGetHodDashboard();
  const DEPT_STATS = dashboardData?.stats || {
    totalStudents: 0, totalFaculty: 0, avgAttendance: 0, pendingApprovals: 0, arrearStudents: 0, sections: 0
  };
  const FACULTY_SUMMARY = dashboardData?.facultySummary || [];
  const ALERTS = dashboardData?.alerts || [];

  const onRefresh = async () => { 
    setRefreshing(true); 
    await refetch();
    setRefreshing(false); 
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{t("good_morning")}</Text>
            <Text style={styles.name}>{hod?.name}</Text>
            <Text style={styles.meta}>{hod?.department}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pressable onPress={toggleLanguage} style={styles.langToggle}>
              <Feather name="globe" size={14} color="#FFF" />
              <Text style={styles.langText}>{locale.toUpperCase()}</Text>
            </Pressable>
            <View style={[styles.avatarBox, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>{hod?.avatar ?? "H"}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Alerts */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 8 }}>
          {ALERTS.map((a, i) => {
            const color = a.type === "error" ? colors.destructive : a.type === "warning" ? colors.warning : colors.primary;
            return (
              <View key={i} style={[styles.alertCard, { backgroundColor: color + "12", borderColor: color + "30" }]}>
                <Feather name={a.icon as any} size={16} color={color} />
                <Text style={[styles.alertText, { color }]}>{a.message}</Text>
              </View>
            );
          })}
        </View>

        {/* Department stats */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Department Overview</Text>
          <View style={styles.statsGrid}>
            {[
              { label: "Students", value: DEPT_STATS.totalStudents, icon: "users", color: colors.primary },
              { label: "Faculty", value: DEPT_STATS.totalFaculty, icon: "briefcase", color: colors.accent },
              { label: "Avg Attendance", value: `${DEPT_STATS.avgAttendance}%`, icon: "trending-up", color: colors.success },
              { label: "Sections", value: DEPT_STATS.sections, icon: "layers", color: colors.warning },
              { label: "Pending OD/Leave", value: DEPT_STATS.pendingApprovals, icon: "clock", color: colors.warning },
              { label: "Low Attendance", value: DEPT_STATS.arrearStudents, icon: "alert-triangle", color: colors.destructive },
            ].map((s) => (
              <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIcon, { backgroundColor: s.color + "20" }]}>
                  <Feather name={s.icon as any} size={18} color={s.color} />
                </View>
                <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Faculty status */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Faculty Today</Text>
          {FACULTY_SUMMARY.map((f, i) => (
            <View key={i} style={[styles.facultyRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.facultyAvatar, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.facultyAvatarText, { color: colors.primary }]}>{f.name.charAt(3)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.facultyName, { color: colors.foreground }]}>{f.name}</Text>
                <Text style={[styles.facultyMeta, { color: colors.mutedForeground }]}>{f.classes} classes today · {f.attendance}% monthly</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: f.status === "In Campus" ? colors.success + "20" : colors.destructive + "20" }]}>
                <Text style={[styles.statusPillText, { color: f.status === "In Campus" ? colors.success : colors.destructive }]}>{f.status}</Text>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { fontSize: 12, color: "#93C5FD", fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
  name: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold", marginTop: 2 },
  meta: { fontSize: 12, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  langToggle: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF15", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  langText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  avatarBox: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  alertCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 10, borderWidth: 1, padding: 12 },
  alertText: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1 },
  sectionHeader: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "47%", borderRadius: 14, padding: 14, gap: 6, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 2 },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  facultyRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  facultyAvatar: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  facultyAvatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  facultyName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  facultyMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statusPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  statusPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
