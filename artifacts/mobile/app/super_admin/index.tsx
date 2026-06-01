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
import { useAuth, SuperAdminUser } from "@/context/AuthContext";
import { useTranslation } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

const SYSTEM_LOGS = [
  { event: "Schema sync pushed successfully", time: "1h ago", target: "lib/db" },
  { event: "JWT validation keys rotated", time: "3h ago", target: "auth-server" },
  { event: "Storage bucket created: question_papers", time: "5h ago", target: "supabase" },
];

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const superAdmin = user as SuperAdminUser;

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"saas" | "logs">("saas");
  
  // White-label settings state
  const [customBranding, setCustomBranding] = useState(true);
  const [enforceRLS, setEnforceRLS] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleToggle = (setting: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (setting === "branding") {
      setCustomBranding(!customBranding);
    } else if (setting === "rls") {
      setEnforceRLS(!enforceRLS);
    } else if (setting === "ai") {
      setAiSuggestions(!aiSuggestions);
    }
    Alert.alert("Setting Saved", "SaaS global configuration updated successfully.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View>
            <Text style={styles.greeting}>SaaS Control Panel</Text>
            <Text style={styles.name}>{superAdmin?.name}</Text>
            <Text style={styles.subText}>Geetorus Campus Engine v1.0</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => setActiveTab("saas")} style={[styles.tabBtn, activeTab === "saas" && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
          <Text style={[styles.tabLabel, { color: activeTab === "saas" ? colors.primary : colors.mutedForeground }]}>White-Label & Subscriptions</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("logs")} style={[styles.tabBtn, activeTab === "logs" && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
          <Text style={[styles.tabLabel, { color: activeTab === "logs" ? colors.primary : colors.mutedForeground }]}>System Audit Logs</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {activeTab === "saas" ? (
          <View style={{ gap: 14 }}>
            {/* Subscription Detail Card */}
            <View style={[styles.detailsCard, { backgroundColor: colors.navy }]}>
              <View style={styles.detailRow}>
                <Feather name="award" size={20} color="#FBBF24" />
                <View style={{ flex: 1, paddingLeft: 10 }}>
                  <Text style={styles.detailTitle}>Geetorus Enterprise Suite</Text>
                  <Text style={styles.detailDesc}>Active subscription for Al-Ameen Engineering College</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.detailMetaRow}>
                <View>
                  <Text style={styles.metaLabel}>Bill Cycle</Text>
                  <Text style={styles.metaValue}>Annual</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>Active Colleges</Text>
                  <Text style={styles.metaValue}>2 Sites</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>API Limit</Text>
                  <Text style={styles.metaValue}>Unlimited</Text>
                </View>
              </View>
            </View>

            {/* Resource Gauges */}
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Infrastructure Resource Monitors</Text>
            <View style={styles.gaugeGrid}>
              {[
                { name: "PostgreSQL DB Load", val: "4.2%", icon: "database", color: colors.success },
                { name: "Edge Function Latency", val: "42ms", icon: "activity", color: colors.primary },
                { name: "Storage (Supabase)", val: "12.4 GB / 50 GB", icon: "hard-drive", color: colors.warning },
              ].map(g => (
                <View key={g.name} style={[styles.gaugeBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.iconWrapper, { backgroundColor: g.color + "12" }]}>
                    <Feather name={g.icon as any} size={15} color={g.color} />
                  </View>
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Text style={[styles.gaugeName, { color: colors.foreground }]}>{g.name}</Text>
                    <Text style={[styles.gaugeVal, { color: colors.foreground }]}>{g.val}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* White-Label Settings Switches */}
            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 6 }]}>White-Label Configuration Settings</Text>
            <View style={[styles.switchCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {[
                { label: "Enforce Custom College Branding", state: customBranding, key: "branding" },
                { label: "Enforce Row Level Security (RLS)", state: enforceRLS, key: "rls" },
                { label: "Enable AI Assistant suggestions", state: aiSuggestions, key: "ai" }
              ].map(sw => (
                <View key={sw.key} style={[styles.switchRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.switchLabel, { color: colors.foreground }]}>{sw.label}</Text>
                  <Pressable onPress={() => handleToggle(sw.key)} style={[styles.toggleBtn, { backgroundColor: sw.state ? colors.success : colors.muted }]}>
                    <View style={[styles.toggleDot, sw.state ? { right: 2 } : { left: 2 }]} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* Audit logs stream */
          <View style={{ gap: 10 }}>
            {SYSTEM_LOGS.map((log, i) => (
              <View key={i} style={[styles.logItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.logHeader}>
                  <Feather name="shield" size={14} color={colors.primary} />
                  <Text style={[styles.logTarget, { color: colors.primary }]}>{log.target}</Text>
                  <Text style={{ fontSize: 11, color: colors.mutedForeground, marginLeft: "auto" }}>{log.time}</Text>
                </View>
                <Text style={[styles.logText, { color: colors.foreground }]}>{log.event}</Text>
              </View>
            ))}
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
  greeting: { fontSize: 12, color: "#93C5FD", fontFamily: "Inter_400Regular" },
  name: { fontSize: 20, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginTop: 2 },
  subText: { color: "#FFFFFFB3", fontSize: 12, marginTop: 4 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabActive: {},
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  detailsCard: { borderRadius: 18, padding: 18, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  detailRow: { flexDirection: "row", alignItems: "center" },
  detailTitle: { color: "#FFF", fontSize: 15, fontFamily: "Inter_700Bold" },
  detailDesc: { color: "#93C5FD", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#FFFFFF22", marginVertical: 14 },
  detailMetaRow: { flexDirection: "row", justifyContent: "space-between" },
  metaLabel: { color: "#93C5FD", fontSize: 10, fontFamily: "Inter_500Medium" },
  metaValue: { color: "#FFF", fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 2 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 10 },
  gaugeGrid: { gap: 8 },
  gaugeBox: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14, padding: 12 },
  iconWrapper: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  gaugeName: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  gaugeVal: { fontSize: 13, fontFamily: "Inter_700Bold", marginTop: 2 },
  switchCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14, borderBottomWidth: 1 },
  switchLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  toggleBtn: { width: 44, height: 24, borderRadius: 12, position: "relative" },
  toggleDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFF", position: "absolute", top: 2 },
  logItem: { borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 8 },
  logHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
  logTarget: { fontSize: 11, fontFamily: "Inter_700Bold" },
  logText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, paddingVertical: 12, marginTop: 14 },
  logoutText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
