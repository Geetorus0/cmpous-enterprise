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
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const AT_RISK_STUDENTS = [
  { id: "1", name: "Deepika V", regNo: "22CS014", attendance: "62%", failureRisk: "High", dropoutRisk: "Medium", reason: "Multiple absences in OS" },
  { id: "2", name: "Muthu Kumar", regNo: "22CS015", attendance: "68%", failureRisk: "Medium", dropoutRisk: "Low", reason: "Low CA1 score in Networks" },
  { id: "3", name: "Ramesh T", regNo: "22CS027", attendance: "71%", failureRisk: "High", dropoutRisk: "High", reason: "Frequent absences & low CA scores" },
];

export default function FacultyAIInsights() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [remindedList, setRemindedList] = useState<string[]>([]);
  const [scheduledList, setScheduledList] = useState<string[]>([]);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleRemindParent = (studentId: string, studentName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRemindedList((prev) => [...prev, studentId]);
    Alert.alert(
      "Alert Triggered",
      `Automated SMS & push notification sent to parents of ${studentName}. Text: "AEC Alert: Your child's attendance is currently below 75%. Please ensure they attend upcoming lectures."`
    );
  };

  const handleScheduleRemedial = (studentId: string, name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setScheduledList((prev) => [...prev, studentId]);
    Alert.alert(
      "Remedial Registered",
      `Remedial doubt-clearing session invitation dispatched to ${name} for next Wednesday at 4:00 PM.`
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={18} color="#FFF" />
          </Pressable>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={styles.title}>AI Recommendations</Text>
            <Text style={styles.subtitle}>Predictive Analytics & Campus Insights</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {/* KPI prediction cards */}
        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Department Risk Summary</Text>
        <View style={styles.riskCardRow}>
          {[
            { label: "Attendance Risk", value: "3 Students", color: colors.destructive },
            { label: "Academic Risk", value: "2 Students", color: colors.warning },
            { label: "Est. Pass Rate", value: "94.5%", color: colors.success },
          ].map((r) => (
            <View key={r.label} style={[styles.riskBox, { backgroundColor: colors.card }]}>
              <Text style={[styles.riskVal, { color: r.color }]}>{r.value}</Text>
              <Text style={[styles.riskLabel, { color: colors.mutedForeground }]}>{r.label}</Text>
            </View>
          ))}
        </View>

        {/* List of at-risk students */}
        <Text style={[styles.sectionHeader, { color: colors.foreground, marginTop: 18 }]}>Students at Dropout/Failure Risk</Text>
        {AT_RISK_STUDENTS.map((st) => {
          const isReminded = remindedList.includes(st.id);
          const isScheduled = scheduledList.includes(st.id);
          return (
            <View key={st.id} style={[styles.studentRiskCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={[styles.studentName, { color: colors.foreground }]}>{st.name}</Text>
                  <Text style={[styles.studentReg, { color: colors.mutedForeground }]}>{st.regNo} · Attendance: <Text style={{ color: colors.destructive, fontFamily: "Inter_700Bold" }}>{st.attendance}</Text></Text>
                </View>
                <View style={[styles.riskBadge, { backgroundColor: st.failureRisk === "High" ? colors.destructive + "12" : colors.warning + "12" }]}>
                  <Text style={[styles.riskBadgeText, { color: st.failureRisk === "High" ? colors.destructive : colors.warning }]}>
                    {st.failureRisk} Risk
                  </Text>
                </View>
              </View>

              <Text style={[styles.reasonText, { color: colors.mutedForeground }]}>
                <Text style={{ fontFamily: "Inter_600SemiBold" }}>Reason:</Text> {st.reason}
              </Text>

              {/* Action Buttons */}
              <View style={[styles.actionBtnRow, { borderTopColor: colors.border }]}>
                <Pressable
                  onPress={() => handleRemindParent(st.id, st.name)}
                  disabled={isReminded}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isReminded ? colors.success + "12" : colors.primary,
                      borderColor: isReminded ? colors.success : "transparent",
                      borderWidth: isReminded ? 1 : 0,
                    },
                  ]}
                >
                  <Feather name={isReminded ? "check" : "mail"} size={13} color={isReminded ? colors.success : "#FFF"} style={{ marginRight: 6 }} />
                  <Text style={[styles.actionBtnText, { color: isReminded ? colors.success : "#FFF" }]}>
                    {isReminded ? "Parent Alerted" : "Alert Parent"}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleScheduleRemedial(st.id, st.name)}
                  disabled={isScheduled}
                  style={[
                    styles.actionBtn,
                    {
                      backgroundColor: isScheduled ? colors.success + "12" : colors.muted,
                      borderColor: isScheduled ? colors.success : colors.border,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <Feather name={isScheduled ? "check" : "calendar"} size={13} color={isScheduled ? colors.success : colors.foreground} style={{ marginRight: 6 }} />
                  <Text style={[styles.actionBtnText, { color: isScheduled ? colors.success : colors.foreground }]}>
                    {isScheduled ? "Scheduled" : "Remedial"}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}

        {/* AI task recommendations */}
        <Text style={[styles.sectionHeader, { color: colors.foreground, marginTop: 18 }]}>Automated Academic Tasks</Text>
        <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.tipHeader}>
            <Feather name="info" size={16} color={colors.primary} />
            <Text style={[styles.tipTitle, { color: colors.foreground }]}>AI System recommendations</Text>
          </View>
          <Text style={[styles.tipBody, { color: colors.mutedForeground }]}>
            • 8 students did not submit Assignment 2 in DBMS. Click to send automated reminders.{"\n"}
            • Attendance rate for Section B is lower on Wednesdays. Consider rescheduling period 2.{"\n"}
            • 4 students qualify for merit scholarship endorsements. Send list to HOD for signature.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backBtn: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF15" },
  title: { fontSize: 16, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 11, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 1 },
  sectionHeader: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 10 },
  riskCardRow: { flexDirection: "row", gap: 10 },
  riskBox: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  riskVal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  riskLabel: { fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 2, textAlign: "center" },
  studentRiskCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  studentName: { fontSize: 13, fontFamily: "Inter_700Bold" },
  studentReg: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },
  riskBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  riskBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  reasonText: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 8 },
  actionBtnRow: { flexDirection: "row", gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  tipCard: { borderRadius: 16, borderWidth: 1, padding: 14 },
  tipHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  tipTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  tipBody: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
