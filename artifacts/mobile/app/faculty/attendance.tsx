import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

type Status = "P" | "A" | "L";

const CURRENT_CLASS = { subject: "Computer Networks", section: "CSE-B", time: "9:00 - 10:00", room: "CSE-302", semester: 5 };

const STUDENTS = [
  { id: "1", name: "Arun Raj M", regNo: "22CS011" },
  { id: "2", name: "Priya Devi S", regNo: "22CS012" },
  { id: "3", name: "Karthik R", regNo: "22CS013" },
  { id: "4", name: "Deepika V", regNo: "22CS014" },
  { id: "5", name: "Muthu Kumar", regNo: "22CS015" },
  { id: "6", name: "Saranya N", regNo: "22CS016" },
  { id: "7", name: "Vignesh P", regNo: "22CS017" },
  { id: "8", name: "Anitha M", regNo: "22CS018" },
  { id: "9", name: "Manikandan K", regNo: "22CS019" },
  { id: "10", name: "Swetha L", regNo: "22CS020" },
];

export default function FacultyAttendance() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  
  // State variables
  const [attendance, setAttendance] = useState<Record<string, Status>>(() =>
    Object.fromEntries(STUDENTS.map((s) => [s.id, "P" as Status]))
  );
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  
  // Advanced features state
  const [bulkAbsentMode, setBulkAbsentMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState("Idle");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const presentCount = Object.values(attendance).filter((v) => v === "P").length;
  const absentCount = Object.values(attendance).filter((v) => v === "A").length;
  const lateCount = Object.values(attendance).filter((v) => v === "L").length;

  // Autosave simulation
  useEffect(() => {
    setAutosaveStatus("Saving...");
    const t = setTimeout(() => {
      setAutosaveStatus("Autosaved locally");
    }, 1000);
    return () => clearTimeout(t);
  }, [attendance]);

  const toggleStatus = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAttendance((prev) => {
      const currentStatus = prev[id];
      let nextStatus: Status = "P";
      
      if (bulkAbsentMode) {
        // In Bulk Absent mode, toggle immediately between Present and Absent
        nextStatus = currentStatus === "P" ? "A" : "P";
      } else {
        // Standard cycle: Present -> Absent -> Late -> Present
        nextStatus = currentStatus === "P" ? "A" : currentStatus === "A" ? "L" : "P";
      }
      return { ...prev, [id]: nextStatus };
    });
  };

  const markAllPresent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAttendance(Object.fromEntries(STUDENTS.map((s) => [s.id, "P" as Status])));
  };

  const toggleOfflineSimulation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsOffline(!isOffline);
  };

  const handleSubmit = () => {
    const statusMsg = isOffline
      ? "Warning: Device is offline. Attendance will be queued in Local Storage and auto-synced when connection returns."
      : "Attendance will be synced with Supabase Realtime DB and notifications sent to HOD and parents.";

    Alert.alert(
      "Confirm Submission",
      `Present: ${presentCount} | Absent: ${absentCount} | Late: ${lateCount}\n\n${statusMsg}`,
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setSubmitted(true);
          },
        },
      ]
    );
  };

  const filtered = STUDENTS.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.regNo.toLowerCase().includes(search.toLowerCase())
  );

  if (submitted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 24 }}>
        <View style={[styles.successIcon, { backgroundColor: colors.success + "12" }]}>
          <Feather name="check" size={48} color={colors.success} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>{t("attendance_saved")}</Text>
        <Text style={[styles.successSub, { color: colors.mutedForeground }]}>
          {CURRENT_CLASS.subject} · {CURRENT_CLASS.section}{"\n"}
          Present: {presentCount} · Absent: {absentCount} · Late: {lateCount}
        </Text>
        {isOffline && (
          <View style={[styles.offlineSyncAlert, { backgroundColor: colors.warning + "12" }]}>
            <Feather name="clock" size={14} color={colors.warning} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.warning, fontSize: 12, fontFamily: "Inter_600SemiBold" }}>Queued in local storage</Text>
          </View>
        )}
        <Pressable onPress={() => setSubmitted(false)} style={[styles.newBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.newBtnText}>Back to Dashboard</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={18} color="#FFF" />
          </Pressable>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={styles.subject}>{CURRENT_CLASS.subject}</Text>
            <Text style={styles.meta}>{CURRENT_CLASS.section} · {CURRENT_CLASS.room}</Text>
          </View>
          <Pressable onPress={toggleOfflineSimulation} style={[styles.offlineBtn, { backgroundColor: isOffline ? colors.destructive : "#FFFFFF15" }]}>
            <Feather name={isOffline ? "wifi-off" : "wifi"} size={14} color="#FFF" />
            <Text style={styles.offlineBtnText}>{isOffline ? "Offline" : "Online"}</Text>
          </Pressable>
        </View>

        {/* Offline Banner */}
        {isOffline && (
          <View style={[styles.offlineBanner, { backgroundColor: colors.warning + "25" }]}>
            <Feather name="alert-triangle" size={14} color={colors.warning} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.warning, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>
              {t("offline_warning")}
            </Text>
          </View>
        )}

        {/* Counts Grid */}
        <View style={styles.countsRow}>
          {[
            { label: "Total", value: STUDENTS.length, color: "#93C5FD" },
            { label: t("present"), value: presentCount, color: "#34D399" },
            { label: t("absent"), value: absentCount, color: "#F87171" },
            { label: t("late"), value: lateCount, color: "#FBBF24" },
          ].map((c) => (
            <View key={c.label} style={[styles.countBox, { backgroundColor: "#FFFFFF12" }]}>
              <Text style={[styles.countVal, { color: c.color }]}>{c.value}</Text>
              <Text style={styles.countLabel}>{c.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Toolbar / Search & Bulk Toggles */}
      <View style={[styles.toolbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Feather name="search" size={14} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search roll no, name..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>
        
        {/* Bulk Absent Switcher */}
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setBulkAbsentMode(!bulkAbsentMode); }}
          style={[
            styles.bulkBtn,
            {
              backgroundColor: bulkAbsentMode ? colors.destructive + "12" : colors.muted,
              borderColor: bulkAbsentMode ? colors.destructive : colors.border,
            },
          ]}
        >
          <Feather name="zap" size={13} color={bulkAbsentMode ? colors.destructive : colors.mutedForeground} />
          <Text style={[styles.bulkBtnText, { color: bulkAbsentMode ? colors.destructive : colors.foreground }]}>
            {bulkAbsentMode ? "Absentees Only" : "Standard Cycle"}
          </Text>
        </Pressable>
      </View>

      {/* Legend & Sync Status */}
      <View style={styles.legendRow}>
        <View style={styles.autosaveRow}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.autosaveText, { color: colors.mutedForeground }]}>{autosaveStatus}</Text>
        </View>
        <Pressable onPress={markAllPresent} style={[styles.allPresentLink, { borderColor: colors.primary }]}>
          <Text style={{ color: colors.primary, fontSize: 11, fontFamily: "Inter_700Bold" }}>Reset All Present</Text>
        </Pressable>
      </View>

      {/* Student List */}
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {filtered.map((student) => {
          const status = attendance[student.id];
          const statusColor = status === "P" ? colors.success : status === "A" ? colors.destructive : colors.warning;
          const statusLabel = status === "P" ? t("present") : status === "A" ? t("absent") : t("late");
          
          return (
            <Pressable
              key={student.id}
              onPress={() => toggleStatus(student.id)}
              style={({ pressed }) => [
                styles.studentRow,
                {
                  backgroundColor: colors.card,
                  borderBottomColor: colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <View style={[styles.studentAvatar, { backgroundColor: statusColor + "12" }]}>
                <Text style={[styles.studentAvatarText, { color: statusColor }]}>{student.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={[styles.studentName, { color: colors.foreground }]}>{student.name}</Text>
                <Text style={[styles.studentReg, { color: colors.mutedForeground }]}>{student.regNo}</Text>
              </View>
              <View style={[styles.statusChip, { backgroundColor: statusColor + "12", borderColor: statusColor + "30" }]}>
                <Text style={[styles.statusChipText, { color: statusColor }]}>{statusLabel}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Floating Action Submit Bar */}
      <View style={[styles.submitBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <Pressable onPress={handleSubmit} style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
          <Feather name="send" size={16} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.submitText}>{t("submit_attendance")} ({presentCount} Present)</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  backBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF15" },
  subject: { fontSize: 18, color: "#FFF", fontFamily: "Inter_700Bold" },
  meta: { fontSize: 11, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 1 },
  offlineBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, marginLeft: "auto" },
  offlineBtnText: { color: "#FFF", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  offlineBanner: { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 8, marginBottom: 12 },
  countsRow: { flexDirection: "row", gap: 8 },
  countBox: { flex: 1, borderRadius: 10, padding: 8, alignItems: "center" },
  countVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  countLabel: { color: "#FFFFFF80", fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 1 },
  toolbar: { flexDirection: "row", padding: 12, gap: 10, borderBottomWidth: 1, alignItems: "center" },
  searchBox: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  bulkBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  bulkBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  legendRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 8 },
  autosaveRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  autosaveText: { fontSize: 10, fontFamily: "Inter_500Medium" },
  allPresentLink: { borderBottomWidth: 1, paddingBottom: 1 },
  studentRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 10 },
  studentAvatar: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  studentAvatarText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  studentName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  studentReg: { fontSize: 11, fontFamily: "Inter_500Medium" },
  statusChip: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4 },
  statusChipText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  submitBar: { borderTopWidth: 1, padding: 12 },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 12, paddingVertical: 12 },
  submitText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_700Bold" },
  successIcon: { width: 80, height: 80, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  successTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 6 },
  successSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20, marginBottom: 20 },
  offlineSyncAlert: { flexDirection: "row", alignItems: "center", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 20 },
  newBtn: { borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  newBtnText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_700Bold" },
});
