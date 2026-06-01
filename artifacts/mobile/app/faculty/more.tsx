import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, FacultyUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

export default function FacultyMore() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const faculty = user as FacultyUser;
  const [showHallDuty, setShowHallDuty] = useState(false);
  const [hallDutyForm, setHallDutyForm] = useState({ college: "", city: "", reason: "", dates: "" });
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const submitHallDuty = () => {
    if (!hallDutyForm.college || !hallDutyForm.reason) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Submitted", "Hall duty request submitted for HOD approval.");
    setShowHallDuty(false);
    setHallDutyForm({ college: "", city: "", reason: "", dates: "" });
  };

  const actions = [
    { icon: "upload", label: "Upload Materials", desc: "Notes, question papers", color: "#1565C0" },
    { icon: "edit-3", label: "Add Marks", desc: "Internal assessment marks", color: "#7C3AED" },
    { icon: "clipboard", label: "Leave Request", desc: "Apply for leave", color: "#0EA5E9" },
    { icon: "map-pin", label: "Hall Duty / OD", desc: "Submit on-duty request", color: "#D97706" },
    { icon: "bar-chart-2", label: "Student Analytics", desc: "Performance insights", color: "#059669" },
    { icon: "message-circle", label: "AI Insights", desc: "Attendance & performance tips", color: "#DC2626" },
  ];

  const handleAction = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (label === "Hall Duty / OD") { setShowHallDuty(true); return; }
    if (label === "Leave Request") {
      Alert.alert("Leave Request", "Leave request submitted successfully.");
      return;
    }
    if (label === "AI Insights" || label === "Student Analytics") {
      router.push("/faculty/ai_insights" as any);
      return;
    }
    Alert.alert("Coming Soon", `${label} will be available in the next update.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{faculty?.avatar ?? "F"}</Text>
          </View>
          <View>
            <Text style={styles.name}>{faculty?.name}</Text>
            <Text style={styles.meta}>{faculty?.designation}</Text>
            <Text style={styles.meta2}>{faculty?.employeeId} · {faculty?.department?.split(" ")[0]}</Text>
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
          {[["Employee ID", faculty?.employeeId], ["Department", faculty?.department?.split(" ").slice(0, 2).join(" ")], ["Subjects", faculty?.subjects?.join(", ")], ["Phone", faculty?.phone]].map(([k, v]) => (
            <View key={k} style={[styles.infoRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.infoKey, { color: colors.mutedForeground }]}>{k}</Text>
              <Text style={[styles.infoVal, { color: colors.foreground }]} numberOfLines={2}>{v}</Text>
            </View>
          ))}
        </View>

        {showHallDuty && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>Hall Duty / On Duty Request</Text>
            {[
              ["College Name *", "college", "Institution name"],
              ["City *", "city", "City"],
              ["Reason *", "reason", "Purpose/reason"],
              ["Date Range", "dates", "e.g., 10 Jan – 12 Jan 2026"],
            ].map(([label, key, placeholder]) => (
              <View key={key as string} style={{ marginBottom: 12 }}>
                <Text style={[styles.formLabel, { color: colors.mutedForeground }]}>{label as string}</Text>
                <TextInput
                  value={hallDutyForm[key as keyof typeof hallDutyForm]}
                  onChangeText={(v) => setHallDutyForm((p) => ({ ...p, [key as string]: v }))}
                  placeholder={placeholder as string}
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.formInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
                />
              </View>
            ))}
            <View style={styles.formBtns}>
              <Pressable onPress={() => setShowHallDuty(false)} style={[styles.cancelBtn, { borderColor: colors.border }]}>
                <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={submitHallDuty} style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.submitText}>Submit</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Quick Actions</Text>
        <View style={styles.grid}>
          {actions.map((a) => (
            <Pressable
              key={a.label}
              onPress={() => handleAction(a.label)}
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
  avatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  name: { color: "#FFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  meta: { color: "#93C5FD", fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  meta2: { color: "#64748B", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  langCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16, gap: 10 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  langLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  langBtnContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  langChoiceBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  infoCard: { borderRadius: 14, borderWidth: 1, marginBottom: 16, overflow: "hidden" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 12, borderBottomWidth: 1 },
  infoKey: { fontSize: 12, fontFamily: "Inter_500Medium" },
  infoVal: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1, textAlign: "right" },
  sectionHeader: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  actionCard: { width: "47%", borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  actionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  actionDesc: { fontSize: 11, fontFamily: "Inter_400Regular" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12, borderWidth: 1, paddingVertical: 14 },
  logoutText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  formCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  formTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 14 },
  formLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  formInput: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, fontFamily: "Inter_400Regular" },
  formBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, borderRadius: 10, borderWidth: 1, paddingVertical: 10, alignItems: "center" },
  cancelText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  submitBtn: { flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  submitText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
