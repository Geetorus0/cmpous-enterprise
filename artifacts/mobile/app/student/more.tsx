import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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
import { useAuth, StudentUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

const PLACEMENT_DRIVES = [
  { company: "Geetorus Technologies", role: "Software Engineer Intern", ctc: "₹12 LPA", date: "June 15", status: "applied" },
  { company: "TCS Ninja", role: "Systems Engineer", ctc: "₹4.5 LPA", date: "June 20", status: "eligible" },
  { company: "Cognizant GenC", role: "Programmer Analyst", ctc: "₹4.0 LPA", date: "June 25", status: "eligible" },
];

const LIBRARY_BOOKS = [
  { title: "Introduction to Algorithms", code: "LIB-CS802", due: "10 June 2026", fine: 0 },
  { title: "Computer Networks Fundamentals", code: "LIB-CS734", due: "05 June 2026", fine: 15 },
];

export default function StudentMore() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const student = user as StudentUser;

  // Active section controllers
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  
  // Leave Request Form State
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDays, setLeaveDays] = useState("1");
  
  // Certificate Request Form State
  const [certType, setCertType] = useState("Bonafide");
  const [certReason, setCertReason] = useState("Bus Pass");

  // Complaint Form State
  const [complaintType, setComplaintType] = useState("Classroom Issue");
  const [complaint, setComplaint] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleApplyLeave = () => {
    if (!leaveReason.trim()) {
      Alert.alert(t("error") || "Error", "Please provide a valid leave reason.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      t("success"),
      `Your Leave Request for ${leaveDays} day(s) has been submitted to HOD (${student?.department?.split(" ")[0]}) for approval.`
    );
    setLeaveReason("");
    setActiveWorkflow(null);
  };

  const handleApplyCert = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      t("success"),
      `Your ${certType} request for ${certReason} has been registered. Reference: REQ-${Math.floor(1000 + Math.random() * 9000)}`
    );
    setActiveWorkflow(null);
  };

  const handleApplyComplaint = () => {
    if (!complaint.trim()) {
      Alert.alert("Error", "Please describe your complaint.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      t("success"),
      `Your complaint under [${complaintType}] has been registered. Tracking ID: CMP${Math.floor(1000 + Math.random() * 9000)}. Administrators will review it shortly.`
    );
    setComplaint("");
    setActiveWorkflow(null);
  };

  const handleApplyPlacement = (company: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(t("success"), `You have successfully applied to ${company}. Geetorus Placement team will coordinate the scheduling.`);
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLocale(locale === "en" ? "ta" : "en");
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{student?.avatar ?? "S"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{student?.name}</Text>
            <Text style={styles.meta}>{student?.registerNumber} · {student?.department?.split(" ")[0]}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {/* Localization Toggles */}
        <View style={[styles.langCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.langRow}>
            <Feather name="globe" size={18} color={colors.primary} />
            <Text style={[styles.langLabel, { color: colors.foreground }]}>{t("lang_switcher")}</Text>
          </View>
          <View style={styles.langBtnContainer}>
            {[
              { code: "en", label: t("eng") },
              { code: "ta", label: t("tam") },
              { code: "te", label: t("tel") },
              { code: "hi", label: t("hin") },
              { code: "ml", label: t("mal") },
              { code: "ur", label: t("urd") },
              { code: "kn", label: t("kan") },
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

        {/* Dynamic Workflow View Area */}
        {activeWorkflow && (
          <View style={[styles.workflowCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.workflowHeader}>
              <Text style={[styles.workflowTitle, { color: colors.foreground }]}>{activeWorkflow}</Text>
              <Pressable onPress={() => setActiveWorkflow(null)}>
                <Feather name="x-circle" size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {/* Leave Request Form */}
            {activeWorkflow === t("leave_req") && (
              <View style={styles.formContainer}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{t("reason")}</Text>
                <TextInput
                  value={leaveReason}
                  onChangeText={setLeaveReason}
                  placeholder="E.g., Medical checkup, family function"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.inputField, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
                />
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, marginTop: 10 }]}>Duration (Days)</Text>
                <View style={styles.daysRow}>
                  {["1", "2", "3", "5+"].map((d) => (
                    <Pressable
                      key={d}
                      onPress={() => setLeaveDays(d)}
                      style={[styles.daysBtn, { backgroundColor: leaveDays === d ? colors.primary : colors.muted }]}
                    >
                      <Text style={{ color: leaveDays === d ? "#FFF" : colors.foreground, fontFamily: "Inter_600SemiBold" }}>{d}</Text>
                    </Pressable>
                  ))}
                </View>
                <Pressable onPress={handleApplyLeave} style={[styles.submitWorkflowBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.submitWorkflowText}>{t("apply")}</Text>
                </Pressable>
              </View>
            )}

            {/* Certificate Request Form */}
            {activeWorkflow === t("bonafide") && (
              <View style={styles.formContainer}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Certificate Type</Text>
                <View style={styles.daysRow}>
                  {["Bonafide", "ID Card Replace", "Conduct Cert"].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCertType(c)}
                      style={[styles.certTypeBtn, { backgroundColor: certType === c ? colors.primary : colors.muted }]}
                    >
                      <Text style={{ color: certType === c ? "#FFF" : colors.foreground, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, marginTop: 10 }]}>Purpose / Reason</Text>
                <TextInput
                  value={certReason}
                  onChangeText={setCertReason}
                  placeholder="E.g., Scholarship submission, bank account opening"
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.inputField, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
                />
                <Pressable onPress={handleApplyCert} style={[styles.submitWorkflowBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.submitWorkflowText}>{t("apply")}</Text>
                </Pressable>
              </View>
            )}

            {/* Complaint Form */}
            {activeWorkflow === t("submit_complaint") && (
              <View style={styles.formContainer}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Complaint Category</Text>
                <View style={styles.daysRow}>
                  {["Classroom Issue", "Hostel", "Transport", "Infrastructure"].map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setComplaintType(c)}
                      style={[styles.certTypeBtn, { backgroundColor: complaintType === c ? colors.primary : colors.muted }]}
                    >
                      <Text style={{ color: complaintType === c ? "#FFF" : colors.foreground, fontSize: 10, fontFamily: "Inter_600SemiBold" }}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground, marginTop: 10 }]}>Describe details</Text>
                <TextInput
                  value={complaint}
                  onChangeText={setComplaint}
                  placeholder="Enter details about your issue..."
                  placeholderTextColor={colors.mutedForeground}
                  multiline
                  style={[styles.inputField, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border, minHeight: 80, textAlignVertical: "top" }]}
                />
                <Pressable onPress={handleApplyComplaint} style={[styles.submitWorkflowBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.submitWorkflowText}>Submit Complaint</Text>
                </Pressable>
              </View>
            )}

            {/* Placements updates */}
            {activeWorkflow === t("placements") && (
              <View style={styles.formContainer}>
                {PLACEMENT_DRIVES.map((job) => (
                  <View key={job.company} style={[styles.jobRow, { borderColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.jobCompany, { color: colors.foreground }]}>{job.company}</Text>
                      <Text style={[styles.jobRole, { color: colors.mutedForeground }]}>{job.role} ({job.ctc})</Text>
                      <Text style={[styles.jobDate, { color: colors.mutedForeground }]}>Drive Date: {job.date}</Text>
                    </View>
                    {job.status === "applied" ? (
                      <View style={[styles.appliedBadge, { backgroundColor: colors.success + "12" }]}>
                        <Text style={{ color: colors.success, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>Applied</Text>
                      </View>
                    ) : (
                      <Pressable onPress={() => handleApplyPlacement(job.company)} style={[styles.jobApplyBtn, { backgroundColor: colors.primary }]}>
                        <Text style={styles.jobApplyText}>Apply</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Library Books List */}
            {activeWorkflow === t("library") && (
              <View style={styles.formContainer}>
                {LIBRARY_BOOKS.map((bk) => (
                  <View key={bk.title} style={[styles.bookRow, { borderColor: colors.border }]}>
                    <Feather name="book" size={20} color={colors.primary} />
                    <View style={{ flex: 1, paddingLeft: 10 }}>
                      <Text style={[styles.bookTitle, { color: colors.foreground }]}>{bk.title}</Text>
                      <Text style={[styles.bookMeta, { color: colors.mutedForeground }]}>{bk.code} · Due: {bk.due}</Text>
                    </View>
                    {bk.fine > 0 ? (
                      <View style={[styles.fineBadge, { backgroundColor: colors.destructive + "12" }]}>
                        <Text style={{ color: colors.destructive, fontSize: 11, fontFamily: "Inter_700Bold" }}>Fine: ₹{bk.fine}</Text>
                      </View>
                    ) : (
                      <View style={[styles.fineBadge, { backgroundColor: colors.success + "12" }]}>
                        <Text style={{ color: colors.success, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>No Fine</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Live bus transport tracking */}
            {activeWorkflow === t("transport") && (
              <View style={styles.formContainer}>
                <View style={[styles.busCard, { backgroundColor: colors.muted }]}>
                  <View style={styles.busHeader}>
                    <Feather name="truck" size={18} color={colors.primary} />
                    <Text style={[styles.busRoute, { color: colors.foreground }]}>Route 14 (AEC Campus to Junction)</Text>
                  </View>
                  <Text style={[styles.busDriver, { color: colors.mutedForeground }]}>Driver: Mr. Murugan (Ph: +91 9876543219)</Text>
                  <View style={styles.busStatusLine}>
                    <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
                    <Text style={[styles.busLocationText, { color: colors.success }]}>Live status: En-Route (Near Bypass Toll)</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Hostel details */}
            {activeWorkflow === t("hostel") && (
              <View style={styles.formContainer}>
                <View style={[styles.busCard, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.busRoute, { color: colors.foreground }]}>Mess Hall & Block Details</Text>
                  <Text style={[styles.busDriver, { color: colors.mutedForeground, marginTop: 4 }]}>Block: B-Block, Room 402</Text>
                  <Text style={[styles.busDriver, { color: colors.mutedForeground }]}>Warden: Dr. Venkat (Ph: +91 9876543229)</Text>
                  <View style={[styles.maintenanceBox, { borderTopColor: colors.border }]}>
                    <Text style={[styles.maintenanceTitle, { color: colors.foreground }]}>Maintenance Complaints</Text>
                    <View style={styles.maintenanceRow}>
                      <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Room Fan replacement</Text>
                      <View style={[styles.statusTag, { backgroundColor: colors.success + "12" }]}>
                        <Text style={{ color: colors.success, fontSize: 10, fontFamily: "Inter_700Bold" }}>Resolved</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {[
            ["Register No.", student?.registerNumber],
            ["Course", student?.course],
            ["Semester", `Semester ${student?.semester} · Sec ${student?.section}`],
            ["Batch", student?.batch],
            ["Phone", student?.phone],
            ["Parent Phone", student?.parentPhone],
          ].map(([k, v]) => (
            <View key={k} style={[styles.profileRow2, { borderBottomColor: colors.border }]}>
              <Text style={[styles.profileKey, { color: colors.mutedForeground }]}>{k}</Text>
              <Text style={[styles.profileVal, { color: colors.foreground }]}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions Title */}
        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>{t("quick_actions")}</Text>
        <View style={styles.menuGrid}>
          {[
            { icon: "file-text", label: t("bonafide"), color: "#1565C0" },
            { icon: "calendar", label: t("leave_req"), color: "#7C3AED" },
            { icon: "alert-circle", label: t("submit_complaint"), color: "#DC2626" },
            { icon: "briefcase", label: t("placements"), color: "#059669" },
            { icon: "book", label: t("library"), color: "#D97706" },
            { icon: "truck", label: t("transport"), color: "#0EA5E9" },
            { icon: "home", label: t("hostel"), color: "#8B5CF6" },
            { icon: "message-square", label: t("ai_assistant"), color: "#06B6D4", path: "/student/ai_chat" },
          ].map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (item.path) {
                  router.push(item.path as any);
                } else {
                  setActiveWorkflow(item.label);
                }
              }}
              style={({ pressed }) => [styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "12" }]}>
                <Feather name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Sign Out */}
        <Pressable
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await logout();
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
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFF", fontSize: 18, fontFamily: "Inter_700Bold" },
  name: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  meta: { color: "#93C5FD", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  langCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 14, gap: 10 },
  langRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  langLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  langBtnContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  langChoiceBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  profileCard: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: "hidden" },
  profileRow2: { flexDirection: "row", justifyContent: "space-between", padding: 12, borderBottomWidth: 1 },
  profileKey: { fontSize: 12, fontFamily: "Inter_500Medium" },
  profileVal: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sectionHeader: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 12 },
  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  menuCard: { width: "48%", borderRadius: 16, borderWidth: 1, padding: 14, gap: 10, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, paddingVertical: 12, marginTop: 8 },
  logoutText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  workflowCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 16 },
  workflowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  workflowTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  formContainer: { marginTop: 4 },
  fieldLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginBottom: 6 },
  inputField: { borderRadius: 10, borderWidth: 1, padding: 10, fontSize: 13, fontFamily: "Inter_400Regular" },
  daysRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  daysBtn: { flex: 1, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  certTypeBtn: { flex: 1, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  submitWorkflowBtn: { borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 12 },
  submitWorkflowText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  jobRow: { borderBottomWidth: 1, paddingVertical: 10, flexDirection: "row", alignItems: "center" },
  jobCompany: { fontSize: 13, fontFamily: "Inter_700Bold" },
  jobRole: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 2 },
  jobDate: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
  jobApplyBtn: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  jobApplyText: { color: "#FFF", fontSize: 11, fontFamily: "Inter_600SemiBold" },
  appliedBadge: { borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  bookRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, paddingVertical: 10 },
  bookTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  bookMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  fineBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  busCard: { borderRadius: 12, padding: 12 },
  busHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  busRoute: { fontSize: 13, fontFamily: "Inter_700Bold" },
  busDriver: { fontSize: 11, fontFamily: "Inter_500Medium" },
  busStatusLine: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  busLocationText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  maintenanceBox: { borderTopWidth: 1, marginTop: 10, paddingTop: 10 },
  maintenanceTitle: { fontSize: 12, fontFamily: "Inter_700Bold", marginBottom: 6 },
  maintenanceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusTag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
});
