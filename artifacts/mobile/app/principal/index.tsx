import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, PrincipalUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";
import { useGetPrincipalDashboard } from "@workspace/api-client-react";

export default function PrincipalDashboard() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const principal = user as PrincipalUser;

  const { data: dashboardData, isLoading, refetch } = useGetPrincipalDashboard();
  const DEPT_PERFORMANCE = dashboardData?.departmentPerformance || [];

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"stats" | "approvals">("stats");
  const [requests, setRequests] = useState(dashboardData?.pendingHodRequests || []);
  
  React.useEffect(() => {
    if (dashboardData?.pendingHodRequests) {
      setRequests(dashboardData.pendingHodRequests);
    }
  }, [dashboardData]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
    setRefreshing(false);
  };

  const handleRequestAction = (id: string, action: "Approved" | "Rejected") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRequests(prev => prev.filter(r => r.id !== id));
    Alert.alert("Action Saved", `HOD Request has been successfully ${action}. Notification sent.`);
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const order: Locale[] = ["en", "ta", "te", "hi", "ml", "ur", "kn"];
    const nextIdx = (order.indexOf(locale) + 1) % order.length;
    setLocale(order[nextIdx]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{t("good_morning")}</Text>
            <Text style={styles.name}>{principal?.name}</Text>
            <Text style={styles.subText}>{t("clg_name")} Control Hub</Text>
          </View>
          <Pressable onPress={toggleLanguage} style={styles.langToggle}>
            <Feather name="globe" size={14} color="#FFF" />
            <Text style={styles.langText}>{locale.toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>

      {/* Role Tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => setActiveTab("stats")} style={[styles.tabBtn, activeTab === "stats" && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
          <Text style={[styles.tabLabel, { color: activeTab === "stats" ? colors.primary : colors.mutedForeground }]}>Campus Metrics</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("approvals")} style={[styles.tabBtn, activeTab === "approvals" && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
          <Text style={[styles.tabLabel, { color: activeTab === "approvals" ? colors.primary : colors.mutedForeground }]}>
            HOD Approvals ({requests.length})
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {activeTab === "stats" ? (
          <View style={{ gap: 14 }}>
            {/* KPI statistics cards */}
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                <View style={[styles.iconWrapper, { backgroundColor: "#10B981" + "12" }]}>
                  <Feather name="users" size={16} color="#10B981" />
                </View>
                <Text style={[styles.statVal, { color: colors.foreground }]}>{dashboardData?.metrics?.totalStudents ?? "0"}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("students")}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                <View style={[styles.iconWrapper, { backgroundColor: "#3B82F6" + "12" }]}>
                  <Feather name="user-check" size={16} color="#3B82F6" />
                </View>
                <Text style={[styles.statVal, { color: colors.foreground }]}>{dashboardData?.metrics?.facultyMembers ?? "0"}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("faculty")}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                <View style={[styles.iconWrapper, { backgroundColor: "#8B5CF6" + "12" }]}>
                  <Feather name="calendar" size={16} color="#8B5CF6" />
                </View>
                <Text style={[styles.statVal, { color: colors.foreground }]}>{dashboardData?.metrics?.activeTimetables ?? "0"}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("active_timetables")}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                <View style={[styles.iconWrapper, { backgroundColor: "#F59E0B" + "12" }]}>
                  <Feather name="credit-card" size={16} color="#F59E0B" />
                </View>
                <Text style={[styles.statVal, { color: colors.foreground }]}>{dashboardData?.metrics?.monthlyFees ?? "₹0"}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("monthly_fees")}</Text>
              </View>
            </View>

            {/* Department Comparison Graphs */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Department Performance Analysis</Text>
              <View style={styles.divider} />
              {DEPT_PERFORMANCE.map(dept => (
                <View key={dept.name} style={styles.deptRow}>
                  <View style={styles.deptMeta}>
                    <Text style={[styles.deptName, { color: colors.foreground }]}>{dept.name}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>
                      Attendance Rate: <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold" }}>{dept.avgAttendance}%</Text>
                    </Text>
                  </View>
                  
                  {/* Progress lines */}
                  <View style={styles.barsContainer}>
                    <View style={styles.barLabelRow}>
                      <Text style={{ fontSize: 9, color: colors.mutedForeground }}>Syllabus Coverage: {dept.syllabusDone}%</Text>
                    </View>
                    <View style={[styles.trackLine, { backgroundColor: colors.muted }]}>
                      <View style={[styles.fillLine, { width: `${dept.syllabusDone}%` as any, backgroundColor: dept.color }]} />
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* White label branding disclaimer */}
            <View style={[styles.brandingBox, { borderColor: colors.border, backgroundColor: colors.muted }]}>
              <Feather name="info" size={14} color={colors.primary} />
              <Text style={[styles.brandingText, { color: colors.mutedForeground }]}>
                AEC College Operating System is custom-branded for Al-Ameen Engineering College and maintained by Geetorus.
              </Text>
            </View>
          </View>
        ) : (
          /* HOD approvals lists */
          <View style={{ gap: 12 }}>
            {requests.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="check-circle" size={40} color={colors.mutedForeground} />
                <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>No pending HOD requests</Text>
              </View>
            ) : (
              requests.map(req => (
                <View key={req.id} style={[styles.reqCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={styles.reqHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.reqSender, { color: colors.foreground }]}>{req.sender}</Text>
                      <Text style={[styles.reqType, { color: colors.primary }]}>{req.type} ({req.amount})</Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: req.priority === "High" ? colors.destructive + "12" : colors.muted }]}>
                      <Text style={{ color: req.priority === "High" ? colors.destructive : colors.mutedForeground, fontSize: 10, fontFamily: "Inter_700Bold" }}>
                        {req.priority}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.reqDesc, { color: colors.mutedForeground }]}>"{req.desc}"</Text>
                  
                  <View style={styles.btnRow}>
                    <Pressable onPress={() => handleRequestAction(req.id, "Rejected")} style={[styles.actionBtn, { borderColor: colors.destructive, borderWidth: 1 }]}>
                      <Text style={{ color: colors.destructive, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>Reject</Text>
                    </Pressable>
                    <Pressable onPress={() => handleRequestAction(req.id, "Approved")} style={[styles.actionBtn, { backgroundColor: colors.primary }]}>
                      <Text style={{ color: "#FFF", fontFamily: "Inter_600SemiBold", fontSize: 12 }}>Approve</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Sign Out */}
        <Pressable
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await logout();
            router.replace("/login");
          }}
          style={({ pressed }) => [styles.logoutBtn, { borderColor: colors.destructive + "40", opacity: pressed ? 0.7 : 1 }]}
        >
          <Feather name="log-out" size={16} color={colors.destructive} style={{ marginRight: 8 }} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>{t("sign_out")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { fontSize: 12, color: "#93C5FD", fontFamily: "Inter_400Regular" },
  name: { fontSize: 20, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginTop: 2 },
  subText: { color: "#FFFFFFB3", fontSize: 12, marginTop: 4 },
  langToggle: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF15", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  langText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabActive: {},
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statBox: { width: "48%", borderRadius: 16, padding: 14, gap: 4, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  iconWrapper: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  statVal: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 4 },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 14 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 10 },
  deptRow: { marginVertical: 8 },
  deptMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  deptName: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  barsContainer: { gap: 4 },
  barLabelRow: { flexDirection: "row", justifyContent: "space-between" },
  trackLine: { height: 5, borderRadius: 2.5, overflow: "hidden" },
  fillLine: { height: 5, borderRadius: 2.5 },
  brandingBox: { flexDirection: "row", padding: 12, borderRadius: 12, gap: 8, alignItems: "center" },
  brandingText: { fontSize: 11, fontFamily: "Inter_500Medium", flex: 1, lineHeight: 16 },
  reqCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10 },
  reqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  reqSender: { fontSize: 13, fontFamily: "Inter_700Bold" },
  reqType: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  priorityBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  reqDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, paddingVertical: 12, marginTop: 14 },
  logoutText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
});
