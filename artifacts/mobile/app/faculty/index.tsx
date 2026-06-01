import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, FacultyUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";
import { useGetFacultyDashboard } from "@workspace/api-client-react";


const STATUSES = [
  { key: "Present", color: "#10B981" },
  { key: "In class", color: "#3B82F6" },
  { key: "Free", color: "#8B5CF6" },
  { key: "Hall duty", color: "#F59E0B" },
  { key: "Meeting", color: "#EC4899" },
  { key: "Out of campus", color: "#64748B" },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const toggleLanguage = () => {
    const order: Locale[] = ["en", "ta", "te", "hi", "ml", "ur", "kn"];
    const nextIdx = (order.indexOf(locale) + 1) % order.length;
    setLocale(order[nextIdx]);
  };

  const { data: dashboardData, isLoading, refetch } = useGetFacultyDashboard();
  const TODAY_CLASSES = dashboardData?.todayClasses || [];

  const [activeStatus, setActiveStatus] = useState("Present");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState("");

  const faculty = user as FacultyUser;
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const currentClass = TODAY_CLASSES.find((c) => c.isCurrent);
  const pendingCount = TODAY_CLASSES.filter((c) => !c.attendanceDone && !c.isCurrent).length;

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
    setRefreshing(false);
  };

  const handleStatusChange = (status: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveStatus(status);
    Alert.alert("Status Updated", `Your status has been updated to [${status}] in the department directory.`);
  };

  const handleAction = (type: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (type === "Attendance") {
      router.push("/faculty/attendance");
    } else {
      setActiveModal(type);
    }
  };

  const handleUploadSubmit = () => {
    if (!uploadTitle.trim()) {
      Alert.alert("Error", "Please enter a valid title.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Success", `${activeModal} [${uploadTitle}] has been uploaded successfully to Supabase Storage and shared with classes.`);
    setUploadTitle("");
    setUploadFile("");
    setActiveModal(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{t("good_morning")}</Text>
            <Text style={styles.name}>{faculty?.name ?? "Faculty"}</Text>
            <Text style={styles.meta}>{faculty?.designation} · {faculty?.department?.split(" ")[0]}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Pressable onPress={toggleLanguage} style={styles.langToggle}>
              <Feather name="globe" size={14} color="#FFF" />
              <Text style={styles.langText}>{locale.toUpperCase()}</Text>
            </Pressable>
            <View style={styles.badgeWrapper}>
              <View style={[styles.statusDot, { backgroundColor: STATUSES.find(s => s.key === activeStatus)?.color }]} />
              <Text style={styles.badgeText}>{activeStatus}</Text>
            </View>
          </View>
        </View>

        {/* Real-time Status Switcher */}
        <Text style={styles.statusSectionLabel}>Change Duty Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusScroll}>
          {STATUSES.map((st) => (
            <Pressable
              key={st.key}
              onPress={() => handleStatusChange(st.key)}
              style={[
                styles.statusChip,
                {
                  backgroundColor: activeStatus === st.key ? st.color + "25" : "#FFFFFF15",
                  borderColor: activeStatus === st.key ? st.color : "transparent",
                  borderWidth: 1,
                },
              ]}
            >
              <View style={[styles.statusDotCircle, { backgroundColor: st.color }]} />
              <Text style={[styles.statusText, { color: activeStatus === st.key ? st.color : "#93C5FD" }]}>{st.key}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Current Active Class */}
        {currentClass && (
          <View style={[styles.currentCard, { backgroundColor: colors.primary }]}>
            <View style={styles.currentHeader}>
              <View style={[styles.liveBadge, { backgroundColor: "#FFFFFF25" }]}>
                <View style={[styles.liveDot, { backgroundColor: "#34D399" }]} />
                <Text style={styles.liveText}>{t("current_active")}</Text>
              </View>
              <Text style={styles.currentTime}>{currentClass.time}</Text>
            </View>
            <Text style={styles.currentSubject}>{currentClass.subject}</Text>
            <Text style={styles.currentMeta}>{currentClass.section} · {currentClass.room} · {currentClass.students} {t("students").toLowerCase()}</Text>
            
            <Pressable
              onPress={() => handleAction("Attendance")}
              style={[styles.markBtn, { backgroundColor: "#FFFFFF20", borderColor: "#FFFFFF40" }]}
            >
              <Feather name="check-square" size={16} color="#FFF" />
              <Text style={styles.markBtnText}>{t("take_attendance")}</Text>
            </Pressable>
          </View>
        )}

        {/* Pending Attendance Alerts */}
        {pendingCount > 0 && (
          <View style={[styles.alertCard, { backgroundColor: colors.warning + "12", borderColor: colors.warning + "30" }]}>
            <Feather name="clock" size={18} color={colors.warning} />
            <Text style={[styles.alertText, { color: colors.warning }]}>
              {pendingCount} classes pending attendance submissions.
            </Text>
          </View>
        )}

        {/* Quick Actions Panel */}
        <Text style={[styles.sectionHeader, { color: colors.foreground, marginHorizontal: 16, marginTop: 14 }]}>{t("quick_actions")}</Text>
        <View style={styles.quickGrid}>
          {[
            { icon: "check-circle", label: "Take Attendance", action: "Attendance", color: colors.primary },
            { icon: "edit", label: "Upload Marks", action: "Marks", color: "#EC4899" },
            { icon: "file-text", label: "Upload Notes", action: "Notes", color: "#3B82F6" },
            { icon: "briefcase", label: "Upload Assignments", action: "Assignments", color: "#10B981" },
            { icon: "help-circle", label: "Upload Papers", action: "Question Papers", color: "#D97706" },
            { icon: "cpu", label: "AI Recommendations", action: "AI Insights", color: "#8B5CF6" },
          ].map((act) => (
            <Pressable
              key={act.label}
              onPress={() => {
                if (act.action === "AI Insights") {
                  router.push("/faculty/ai_insights" as any);
                } else {
                  handleAction(act.action);
                }
              }}
              style={({ pressed }) => [styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
            >
              <View style={[styles.quickIcon, { backgroundColor: act.color + "12" }]}>
                <Feather name={act.icon as any} size={18} color={act.color} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.foreground }]}>{act.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Timetable widgets */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text style={[styles.sectionHeader, { color: colors.foreground }]}>{t("schedule")}</Text>
          {TODAY_CLASSES.map((cls, i) => (
            <View
              key={i}
              style={[
                styles.classCard,
                {
                  backgroundColor: cls.isCurrent ? colors.primary + "12" : colors.card,
                  borderColor: cls.isCurrent ? colors.primary + "50" : colors.border,
                  opacity: cls.attendanceDone ? 0.75 : 1,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.classSubject, { color: colors.foreground }]}>{cls.subject}</Text>
                <Text style={[styles.classMeta, { color: colors.mutedForeground }]}>{cls.section} · {cls.room} · {cls.students} students</Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <Text style={[styles.classTime, { color: cls.isCurrent ? colors.primary : colors.mutedForeground }]}>{cls.time}</Text>
                {cls.attendanceDone ? (
                  <View style={[styles.doneBadge, { backgroundColor: colors.success + "12" }]}>
                    <Feather name="check" size={10} color={colors.success} style={{ marginRight: 4 }} />
                    <Text style={[styles.doneText, { color: colors.success }]}>Done</Text>
                  </View>
                ) : cls.isCurrent ? (
                  <View style={[styles.doneBadge, { backgroundColor: colors.primary + "12" }]}>
                    <Text style={[styles.doneText, { color: colors.primary }]}>In Progress</Text>
                  </View>
                ) : (
                  <View style={[styles.doneBadge, { backgroundColor: colors.warning + "12" }]}>
                    <Text style={[styles.doneText, { color: colors.warning }]}>Pending</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Upload Mock Modal */}
      <Modal transparent visible={activeModal !== null} animationType="slide" onRequestClose={() => setActiveModal(null)}>
        <Pressable onPress={() => setActiveModal(null)} style={styles.modalOverlay}>
          <View style={[styles.sheetContainer, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetKnob} />
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Upload {activeModal}</Text>
            </View>
            
            <View style={styles.form}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Title / Name</Text>
              <TextInput
                value={uploadTitle}
                onChangeText={setUploadTitle}
                placeholder={`E.g., Sem 5 ${activeModal} Unit 2`}
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground, borderColor: colors.border }]}
              />

              <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 12 }]}>File Attachment</Text>
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setUploadFile("aec_note_dsa_unit2.pdf"); }}
                style={[styles.fileBtn, { borderColor: colors.border, backgroundColor: colors.muted }]}
              >
                <Feather name="paperclip" size={16} color={colors.primary} />
                <Text style={{ color: uploadFile ? colors.foreground : colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 }}>
                  {uploadFile || "Select PDF file from Device"}
                </Text>
              </Pressable>

              <Pressable onPress={handleUploadSubmit} style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
                <Text style={styles.submitBtnText}>Confirm Upload</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular" },
  name: { fontSize: 20, color: "#FFF", fontFamily: "Inter_700Bold", marginTop: 2 },
  meta: { fontSize: 12, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  langToggle: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF15", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  langText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  badgeWrapper: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFFFFF15", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start" },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  badgeText: { color: "#FFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  statusSectionLabel: { color: "#93C5FD", fontSize: 11, fontFamily: "Inter_600SemiBold", marginTop: 14, textTransform: "uppercase" },
  statusScroll: { gap: 8, paddingVertical: 8 },
  statusChip: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6 },
  statusDotCircle: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  currentCard: { margin: 16, borderRadius: 18, padding: 18, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  currentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  liveText: { color: "#FFF", fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  currentTime: { color: "#FFFFFFB3", fontSize: 13, fontFamily: "Inter_500Medium" },
  currentSubject: { color: "#FFF", fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 4 },
  currentMeta: { color: "#FFFFFFB3", fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 14 },
  markBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10, alignSelf: "flex-start" },
  markBtnText: { color: "#FFF", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  alertCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
  alertText: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1 },
  sectionHeader: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 16, marginTop: 10 },
  quickCard: { width: "48%", borderRadius: 16, borderWidth: 1, padding: 14, gap: 10, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  quickIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  classCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  classSubject: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  classMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  classTime: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  doneBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  doneText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheetContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 280 },
  sheetHeader: { alignItems: "center", marginBottom: 18 },
  sheetKnob: { width: 40, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, marginBottom: 12 },
  sheetTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  form: { gap: 10 },
  label: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  input: { borderRadius: 10, borderWidth: 1, padding: 10, fontSize: 13 },
  fileBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderStyle: "dashed", borderRadius: 10, padding: 12 },
  submitBtn: { borderRadius: 12, paddingVertical: 12, alignItems: "center", marginTop: 14 },
  submitBtnText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
