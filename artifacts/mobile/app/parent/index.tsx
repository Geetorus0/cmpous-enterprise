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
import { useAuth, ParentUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";
import { useGetParentDashboard } from "@workspace/api-client-react";



export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();
  const parent = user as ParentUser;
  
  const { data: dashboardData, isLoading, refetch } = useGetParentDashboard();
  const CHILD_MARKS = dashboardData?.marks || [];
  const BEHAVIOR_LOGS = dashboardData?.behaviorLogs || [];

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"child" | "chat">("child");
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: "1", sender: "teacher", text: "Hello Mr. Murugan. Just wanted to inform you that Arjun has been doing great in Data Structures labs.", time: "10:00 AM" }
  ]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await refetch();
    setRefreshing(false);
  };

  const handleSendChat = () => {
    if (!chatMsg.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newMsg = {
      id: Date.now().toString(),
      sender: "parent",
      text: chatMsg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    
    setChatHistory(prev => [...prev, newMsg]);
    setChatMsg("");
    
    // Simulate teacher reply
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const reply = {
        id: (Date.now() + 1).toString(),
        sender: "teacher",
        text: "Thank you for writing back. I will check his project submission status and update you.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatHistory(prev => [...prev, reply]);
    }, 1200);
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
            <Text style={styles.greeting}>{t("welcome_back")},</Text>
            <Text style={styles.name}>{parent?.name}</Text>
            <Text style={styles.childMeta}>Parent of: Arjun Kumar M (5th Sem BE CSE)</Text>
          </View>
          <Pressable onPress={toggleLanguage} style={styles.langToggle}>
            <Feather name="globe" size={14} color="#FFF" />
            <Text style={styles.langText}>{locale.toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => setActiveTab("child")} style={[styles.tabBtn, activeTab === "child" && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
          <Text style={[styles.tabLabel, { color: activeTab === "child" ? colors.primary : colors.mutedForeground }]}>Child monitoring</Text>
        </Pressable>
        <Pressable onPress={() => setActiveTab("chat")} style={[styles.tabBtn, activeTab === "chat" && [styles.tabActive, { borderBottomColor: colors.primary }]]}>
          <Text style={[styles.tabLabel, { color: activeTab === "chat" ? colors.primary : colors.mutedForeground }]}>Tutor Chat</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {activeTab === "child" ? (
          <View style={{ gap: 14 }}>
            {/* Live Shortage Warning */}
            <View style={[styles.warningCard, { backgroundColor: colors.destructive + "12", borderColor: colors.destructive + "30" }]}>
              <Feather name="alert-triangle" size={18} color={colors.destructive} />
              <View style={{ flex: 1, paddingLeft: 6 }}>
                <Text style={[styles.warningTitle, { color: colors.destructive }]}>Shortage Risk Notification</Text>
                <Text style={[styles.warningBody, { color: colors.mutedForeground }]}>
                  Arjun's attendance in Operating Systems is 65%. A minimum of 75% is required for semester exams.
                </Text>
              </View>
            </View>

            {/* Attendance & Finance stats */}
            <View style={styles.statsRow}>
              <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                <Feather name="calendar" size={20} color={colors.primary} />
                <Text style={[styles.statVal, { color: colors.foreground }]}>{dashboardData?.attendancePercentage ?? 0}%</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("overall")} {t("attendance")}</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.card }]}>
                <Feather name="dollar-sign" size={20} color={colors.destructive} />
                <Text style={[styles.statVal, { color: colors.foreground }]}>₹{dashboardData?.feesDue?.toLocaleString() ?? 0}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{t("fees_due")}</Text>
              </View>
            </View>

            {/* Child Marks Tracking */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Continuous Assessments Marks</Text>
              <View style={styles.divider} />
              {CHILD_MARKS.map((m) => (
                <View key={m.subject} style={styles.marksRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.subjectName, { color: colors.foreground }]}>{m.subject}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>Continuous Assessment 1</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.scoredVal, { color: colors.primary }]}>{m.total}/{m.max}</Text>
                    <View style={[styles.gradeTag, { backgroundColor: colors.success + "12" }]}>
                      <Text style={{ color: colors.success, fontSize: 10, fontFamily: "Inter_700Bold" }}>{m.grade}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Behavior Logs */}
            <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Conduct & Behavior reports</Text>
              <View style={styles.divider} />
              {BEHAVIOR_LOGS.map((log, i) => (
                <View key={i} style={[styles.logItem, { borderBottomColor: colors.border, borderBottomWidth: i === BEHAVIOR_LOGS.length - 1 ? 0 : 1 }]}>
                  <View style={styles.logHeader}>
                    <Text style={[styles.logCategory, { color: colors.foreground }]}>{log.category}</Text>
                    <Text style={{ fontSize: 11, color: colors.mutedForeground }}>{log.date}</Text>
                  </View>
                  <Text style={[styles.logComment, { color: colors.mutedForeground }]}>"{log.comment}"</Text>
                  <View style={[styles.ratingTag, { backgroundColor: colors.primary + "12" }]}>
                    <Text style={{ color: colors.primary, fontSize: 10, fontFamily: "Inter_700Bold" }}>Rating: {log.rating}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* Live Messaging with Dr. Priya */
          <View style={[styles.chatContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.chatHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.avatarMini}>
                <Text style={{ color: "#FFF", fontWeight: "bold" }}>PS</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={[styles.chatTutorName, { color: colors.foreground }]}>Dr. Priya Sharma</Text>
                <Text style={{ fontSize: 11, color: colors.success }}>Class Tutor (B.E. CSE)</Text>
              </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 12, gap: 10 }} showsVerticalScrollIndicator={false}>
              {chatHistory.map((msg) => (
                <View key={msg.id} style={[styles.msgWrapper, msg.sender === "parent" ? styles.msgRight : styles.msgLeft]}>
                  <View style={[styles.msgBubble, { backgroundColor: msg.sender === "parent" ? colors.primary : colors.muted }]}>
                    <Text style={{ color: msg.sender === "parent" ? "#FFF" : colors.foreground, fontSize: 13 }}>{msg.text}</Text>
                    <Text style={[styles.msgTime, { color: msg.sender === "parent" ? "#FFFFFF99" : colors.mutedForeground }]}>{msg.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
              <TextInput
                value={chatMsg}
                onChangeText={setChatMsg}
                placeholder="Type a message to Arjun's tutor..."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.chatInput, { backgroundColor: colors.muted, color: colors.foreground }]}
              />
              <Pressable onPress={handleSendChat} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
                <Feather name="send" size={14} color="#FFF" />
              </Pressable>
            </View>
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
  greeting: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular" },
  name: { fontSize: 20, color: "#FFFFFF", fontFamily: "Inter_700Bold", marginTop: 2 },
  childMeta: { color: "#FFFFFFB3", fontSize: 12, fontFamily: "Inter_500Medium", marginTop: 4 },
  langToggle: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#FFFFFF15", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  langText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabActive: {},
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  warningCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 14 },
  warningTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  warningBody: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 18 },
  statsRow: { flexDirection: "row", gap: 10 },
  statBox: { flex: 1, borderRadius: 16, padding: 14, gap: 4, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1, alignItems: "center" },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  sectionCard: { borderRadius: 16, borderWidth: 1, padding: 14 },
  sectionTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 10 },
  marksRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 6 },
  subjectName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scoredVal: { fontSize: 14, fontFamily: "Inter_700Bold" },
  gradeTag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 2, alignSelf: "flex-end" },
  logItem: { paddingVertical: 8, gap: 4 },
  logHeader: { flexDirection: "row", justifyContent: "space-between" },
  logCategory: { fontSize: 12, fontFamily: "Inter_700Bold" },
  logComment: { fontSize: 12, fontFamily: "Inter_400Regular" },
  ratingTag: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, alignSelf: "flex-start", marginTop: 2 },
  chatContainer: { borderRadius: 16, borderWidth: 1, height: 350, overflow: "hidden" },
  chatHeader: { flexDirection: "row", padding: 12, borderBottomWidth: 1, alignItems: "center", backgroundColor: "#0A162810" },
  avatarMini: { width: 34, height: 34, borderRadius: 10, backgroundColor: "#1565C0", alignItems: "center", justifyContent: "center" },
  chatTutorName: { fontSize: 13, fontFamily: "Inter_700Bold" },
  msgWrapper: { flexDirection: "row", width: "100%", marginVertical: 2 },
  msgLeft: { justifyContent: "flex-start" },
  msgRight: { justifyContent: "flex-end" },
  msgBubble: { maxWidth: "80%", borderRadius: 12, padding: 10 },
  msgTime: { fontSize: 9, fontFamily: "Inter_500Medium", marginTop: 4, textAlign: "right" },
  inputRow: { flexDirection: "row", padding: 10, borderTopWidth: 1, gap: 8 },
  chatInput: { flex: 1, borderRadius: 18, paddingHorizontal: 12, fontSize: 13, height: 36 },
  sendBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, paddingVertical: 12, marginTop: 14 },
  logoutText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
