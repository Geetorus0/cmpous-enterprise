import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, HodUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

export default function HODMore() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const hod = user as HodUser;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const actions = [
    { icon: "bar-chart-2", label: "Performance Reports", desc: "Department analytics", color: "#1565C0" },
    { icon: "file-text", label: "Syllabus Coverage", desc: "Track subject completion", color: "#7C3AED" },
    { icon: "users", label: "Faculty Appraisal", desc: "Review faculty performance", color: "#0EA5E9" },
    { icon: "calendar", label: "Timetable", desc: "Manage class schedule", color: "#059669" },
    { icon: "award", label: "Merit Students", desc: "Top performers", color: "#D97706" },
    { icon: "message-circle", label: "AI Insights", desc: "Department trends & tips", color: "#DC2626" },
  ];

  const handle = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Coming Soon", `${label} will be available in the next update.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{hod?.avatar ?? "H"}</Text>
          </View>
          <View>
            <Text style={styles.name}>{hod?.name}</Text>
            <Text style={styles.role}>Head of Department</Text>
            <Text style={styles.dept}>{hod?.department}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {/* Localization Toggles */}
        <View style={[styles.langCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.langRow}>
            <Feather name="globe" size={18} color={colors.primary} />
            <Text style={[styles.langLabel, { color: colors.foreground }]}>{t("lang_switcher") || "Language"}</Text>
          </View>
          <View style={styles.langBtnContainer}>
            {[
              { code: "en", label: t("eng") || "EN" },
              { code: "ta", label: t("tam") || "TA" },
              { code: "te", label: t("tel") || "TE" },
              { code: "hi", label: t("hin") || "HI" },
              { code: "ml", label: t("mal") || "ML" },
              { code: "ur", label: t("urd") || "UR" },
              { code: "kn", label: t("kan") || "KN" },
            ].map((lang) => (
              <Pressable
                key={lang.code}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLocale(lang.code as Locale);
                }}
                style={[styles.langChoiceBtn, { backgroundColor: locale === lang.code ? colors.primary : colors.muted }]}
              >
                <Text style={{ color: locale === lang.code ? "#FFF" : colors.mutedForeground, fontFamily: "Inter_600SemiBold" }}>{lang.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            ["Employee ID", hod?.employeeId],
            ["Department", hod?.department],
            ["Phone", hod?.phone],
            ["Experience", "18 years"],
          ].map(([k, v]) => (
            <View key={k} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoKey, { color: colors.mutedForeground }]}>{k}</Text>
              <Text style={[styles.infoVal, { color: colors.foreground }]}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Department quick stats */}
        <View style={styles.quickStats}>
          {[
            { label: "Faculty", value: "14", color: colors.primary },
            { label: "Students", value: "245", color: colors.accent },
            { label: "Sections", value: "5", color: colors.success },
          ].map((s) => (
            <View key={s.label} style={[styles.quickStat, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.quickVal, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.quickLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => handle(a.label)}
              style={({ pressed }) => [styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={[styles.actionIcon, { backgroundColor: a.color + "20" }]}>
                <Feather name={a.icon as any} size={20} color={a.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
              <Text style={[styles.actionDesc, { color: colors.mutedForeground }]}>{a.desc}</Text>
            </Pressable>
          ))}
        </View>

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
  dept: { color: "#64748B", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  langCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16, gap: 10 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  langLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  langBtnContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  langChoiceBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  infoCard: { borderRadius: 14, borderWidth: 1, marginBottom: 14, overflow: "hidden" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1 },
  infoKey: { fontSize: 12, fontFamily: "Inter_500Medium" },
  infoVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  quickStats: { flexDirection: "row", gap: 10, marginBottom: 16 },
  quickStat: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: "center" },
  quickVal: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  quickLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  sectionHeader: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  actionCard: { width: "47%", borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  actionDesc: { fontSize: 11, fontFamily: "Inter_400Regular" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, borderWidth: 1, paddingVertical: 14 },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
