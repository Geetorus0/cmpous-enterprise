import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const SETTINGS = [
  { section: "Academic", items: [
    { icon: "calendar", label: "Academic Calendar", color: "#1565C0" },
    { icon: "book", label: "Syllabus Management", color: "#7C3AED" },
    { icon: "clock", label: "Timetable Generator", color: "#0EA5E9" },
  ]},
  { section: "System", items: [
    { icon: "users", label: "Role & Permissions", color: "#059669" },
    { icon: "bell", label: "Push Notifications", color: "#D97706" },
    { icon: "database", label: "Data Backup", color: "#DC2626" },
  ]},
  { section: "Finance", items: [
    { icon: "dollar-sign", label: "Fee Structure", color: "#059669" },
    { icon: "credit-card", label: "Payment Gateway", color: "#1565C0" },
    { icon: "award", label: "Scholarship Setup", color: "#7C3AED" },
  ]},
  { section: "Communication", items: [
    { icon: "mail", label: "Announcements", color: "#0EA5E9" },
    { icon: "message-circle", label: "AI Assistant Config", color: "#D97706" },
    { icon: "alert-circle", label: "Complaints Review", color: "#DC2626" },
  ]},
];

export default function AdminMore() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handle = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Coming Soon", `${label} configuration will be available in the next update.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View>
            <Text style={styles.name}>Admin</Text>
            <Text style={styles.role}>System Administrator</Text>
            <Text style={styles.college}>Al-Ameen Engineering College</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {/* System health */}
        <View style={[styles.healthCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
          <View style={[styles.healthIcon, { backgroundColor: colors.success + "20" }]}>
            <Feather name="server" size={20} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.healthTitle, { color: colors.success }]}>System Health: Excellent</Text>
            <Text style={[styles.healthSub, { color: colors.mutedForeground }]}>All services running normally</Text>
          </View>
          <View style={[styles.uptimeBadge, { backgroundColor: colors.success + "20" }]}>
            <Text style={[styles.uptimeText, { color: colors.success }]}>99.9%</Text>
            <Text style={[styles.uptimeLabel, { color: colors.success + "99" }]}>uptime</Text>
          </View>
        </View>

        {/* Quick system stats */}
        <View style={styles.statsRow}>
          {[
            { label: "DB Size", value: "4.2 GB", icon: "database", color: colors.primary },
            { label: "Active Sessions", value: "1,621", icon: "wifi", color: colors.accent },
            { label: "App Version", value: "1.0.0", icon: "smartphone", color: colors.success },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name={s.icon as any} size={16} color={s.color} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Settings sections */}
        {SETTINGS.map((section) => (
          <View key={section.section} style={{ marginBottom: 16 }}>
            <Text style={[styles.sectionHeader, { color: colors.foreground }]}>{section.section}</Text>
            <View style={[styles.settingsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {section.items.map((item, i) => (
                <Pressable
                  key={item.label}
                  onPress={() => handle(item.label)}
                  style={({ pressed }) => [
                    styles.settingRow,
                    {
                      borderBottomColor: colors.border,
                      borderBottomWidth: i < section.items.length - 1 ? 1 : 0,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <View style={[styles.settingIcon, { backgroundColor: item.color + "20" }]}>
                    <Feather name={item.icon as any} size={16} color={item.color} />
                  </View>
                  <Text style={[styles.settingLabel, { color: colors.foreground }]}>{item.label}</Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <Pressable onPress={async () => { await logout(); }} style={[styles.logoutBtn, { borderColor: colors.destructive + "50" }]}>
          <Feather name="log-out" size={18} color={colors.destructive} />
          <Text style={[styles.logoutText, { color: colors.destructive }]}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFF", fontSize: 20, fontFamily: "Inter_700Bold" },
  name: { color: "#FFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  role: { color: "#93C5FD", fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  college: { color: "#64748B", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  healthCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 12 },
  healthIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  healthTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 2 },
  healthSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  uptimeBadge: { borderRadius: 10, padding: 8, alignItems: "center" },
  uptimeText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  uptimeLabel: { fontSize: 9, fontFamily: "Inter_500Medium" },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center", gap: 4 },
  statVal: { fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center" },
  statLabel: { fontSize: 9, fontFamily: "Inter_500Medium", textAlign: "center" },
  sectionHeader: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 8 },
  settingsCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingLabel: { flex: 1, fontSize: 14, fontFamily: "Inter_500Medium" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, borderWidth: 1, paddingVertical: 14, marginTop: 4 },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
