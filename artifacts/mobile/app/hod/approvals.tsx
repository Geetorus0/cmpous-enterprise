import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type RequestStatus = "pending" | "approved" | "rejected";

interface Request {
  id: string;
  name: string;
  role: string;
  type: string;
  desc: string;
  date: string;
  status: RequestStatus;
  priority: "high" | "normal";
}

const INITIAL_REQUESTS: Request[] = [
  { id: "1", name: "Dr. Priya Sharma", role: "Faculty", type: "On Duty", desc: "Workshop at IIT Madras, 3 days", date: "15–17 Jan", status: "pending", priority: "normal" },
  { id: "2", name: "Mr. S. Rajan", role: "Faculty", type: "Leave", desc: "Family emergency", date: "18 Jan", status: "pending", priority: "high" },
  { id: "3", name: "Arjun Kumar", role: "Student", type: "Leave", desc: "Medical appointment", date: "20 Jan", status: "pending", priority: "normal" },
  { id: "4", name: "Ms. T. Nair", role: "Faculty", type: "On Duty", desc: "Anna University paper evaluation", date: "22–24 Jan", status: "pending", priority: "normal" },
  { id: "5", name: "Priya Devi", role: "Student", type: "OD", desc: "Inter-college sports", date: "25–26 Jan", status: "approved", priority: "normal" },
  { id: "6", name: "Karthik R", role: "Student", type: "Leave", desc: "Personal work", date: "14 Jan", status: "rejected", priority: "normal" },
  { id: "7", name: "Dr. A. Kumar", role: "Faculty", type: "Leave", desc: "Research conference", date: "28 Jan", status: "pending", priority: "normal" },
];

export default function HODApprovals() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const pending = requests.filter((r) => r.status === "pending").length;

  const handleAction = (id: string, action: "approved" | "rejected") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      action === "approved" ? "Approve Request" : "Reject Request",
      `Are you sure you want to ${action === "approved" ? "approve" : "reject"} this request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "approved" ? "Approve" : "Reject",
          style: action === "rejected" ? "destructive" : "default",
          onPress: () => {
            Haptics.notificationAsync(action === "approved" ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
            setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
          },
        },
      ]
    );
  };

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Approvals</Text>
            <Text style={styles.subtitle}>Leave & OD Requests</Text>
          </View>
          {pending > 0 && (
            <View style={[styles.pendingBadge, { backgroundColor: colors.warning + "30" }]}>
              <Text style={[styles.pendingBadgeText, { color: colors.warning }]}>{pending} pending</Text>
            </View>
          )}
        </View>
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 10 }}>
          {(["pending", "all", "approved", "rejected"] as const).map((f) => {
            const count = f === "all" ? requests.length : requests.filter((r) => r.status === f).length;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterChip, { backgroundColor: filter === f ? colors.primary : colors.muted, borderColor: filter === f ? colors.primary : colors.border }]}
              >
                <Text style={[styles.filterText, { color: filter === f ? "#FFF" : colors.mutedForeground }]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="check-circle" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No requests to show</Text>
          </View>
        )}
        {filtered.map((req) => {
          const typeColor = req.type === "On Duty" ? colors.accent : req.type === "OD" ? colors.primary : colors.warning;
          return (
            <View
              key={req.id}
              style={[
                styles.requestCard,
                { backgroundColor: colors.card, borderColor: req.priority === "high" ? colors.destructive + "40" : colors.border },
              ]}
            >
              {req.priority === "high" && (
                <View style={[styles.urgentBanner, { backgroundColor: colors.destructive + "15" }]}>
                  <Feather name="zap" size={12} color={colors.destructive} />
                  <Text style={[styles.urgentText, { color: colors.destructive }]}>Urgent</Text>
                </View>
              )}
              <View style={styles.requestHeader}>
                <View style={[styles.reqAvatar, { backgroundColor: typeColor + "20" }]}>
                  <Text style={[styles.reqAvatarText, { color: typeColor }]}>{req.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.reqName, { color: colors.foreground }]}>{req.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: req.role === "Faculty" ? colors.primary + "20" : colors.accent + "20" }]}>
                      <Text style={[styles.roleText, { color: req.role === "Faculty" ? colors.primary : colors.accent }]}>{req.role}</Text>
                    </View>
                  </View>
                  <Text style={[styles.reqMeta, { color: colors.mutedForeground }]}>{req.type} · {req.date}</Text>
                  <Text style={[styles.reqDesc, { color: colors.foreground }]}>{req.desc}</Text>
                </View>
              </View>

              {req.status === "pending" ? (
                <View style={styles.actionRow}>
                  <Pressable
                    onPress={() => handleAction(req.id, "rejected")}
                    style={({ pressed }) => [styles.rejectBtn, { borderColor: colors.destructive + "40", opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Feather name="x" size={14} color={colors.destructive} />
                    <Text style={[styles.rejectText, { color: colors.destructive }]}>Reject</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => handleAction(req.id, "approved")}
                    style={({ pressed }) => [styles.approveBtn, { backgroundColor: colors.success, opacity: pressed ? 0.7 : 1 }]}
                  >
                    <Feather name="check" size={14} color="#FFF" />
                    <Text style={styles.approveText}>Approve</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={[styles.statusBadge, { backgroundColor: req.status === "approved" ? colors.success + "20" : colors.destructive + "20" }]}>
                  <Feather name={req.status === "approved" ? "check-circle" : "x-circle"} size={13} color={req.status === "approved" ? colors.success : colors.destructive} />
                  <Text style={[styles.statusText, { color: req.status === "approved" ? colors.success : colors.destructive }]}>
                    {req.status === "approved" ? "Approved" : "Rejected"}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  pendingBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  pendingBadgeText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  filterRow: { borderBottomWidth: 1 },
  filterChip: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 7 },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  requestCard: { borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 10, overflow: "hidden" },
  urgentBanner: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 5, marginBottom: 10, borderRadius: 8, alignSelf: "flex-start" },
  urgentText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  requestHeader: { flexDirection: "row", gap: 12, marginBottom: 12 },
  reqAvatar: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  reqAvatarText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  reqName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  roleBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  roleText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  reqMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 4 },
  reqDesc: { fontSize: 13, fontFamily: "Inter_400Regular" },
  actionRow: { flexDirection: "row", gap: 10 },
  rejectBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10, borderWidth: 1, paddingVertical: 10 },
  rejectText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  approveBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10, paddingVertical: 10 },
  approveText: { color: "#FFF", fontSize: 14, fontFamily: "Inter_600SemiBold" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7, alignSelf: "flex-start" },
  statusText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
