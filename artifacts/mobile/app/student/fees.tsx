import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";

const FEE_SUMMARY = { total: 85000, paid: 50000, pending: 35000, dueDate: "15 Jan 2026" };

const PAYMENT_HISTORY = [
  { id: "TXN001", date: "10 Aug 2025", amount: 30000, mode: "Online (UPI)", status: "paid", desc: "Term I Tuition Fee" },
  { id: "TXN002", date: "12 Sep 2025", amount: 20000, mode: "Net Banking", status: "paid", desc: "Hostel & Mess Fee" },
  { id: "TXN003", date: "Pending", amount: 35000, mode: "–", status: "pending", desc: "Term II Tuition Fee" },
];

const SCHOLARSHIPS = [
  { name: "Tamil Nadu Government Merit Scholarship", amount: 25000, status: "approved", type: "Government" },
  { name: "Geetorus Foundation Excellence Grant", amount: 10000, status: "pending", type: "Private Foundation" },
];

export default function StudentFees() {
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<"fees" | "scholarship">("fees");
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [paying, setPaying] = useState(false);
  const [receiptDownloading, setReceiptDownloading] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const paidPct = Math.round((FEE_SUMMARY.paid / FEE_SUMMARY.total) * 100);

  const triggerPaymentFlow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPaymentModalVisible(true);
  };

  const handlePay = (method: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaymentModalVisible(false);
      setSuccessModalVisible(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1800);
  };

  const handleDownloadReceipt = (txnId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReceiptDownloading(txnId);
    setTimeout(() => {
      setReceiptDownloading(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        t("success"),
        `Receipt (${txnId}.pdf) has been saved to your downloads folder.`
      );
    }, 1200);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.navy }]}>
        <Text style={styles.title}>{t("fee_details")}</Text>
        <Text style={styles.subtitle}>Academic Year 2025-26</Text>
      </View>

      <View style={[styles.tabRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {(["fees", "scholarship"] as const).map((tId) => (
          <Pressable
            key={tId}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTab(tId); }}
            style={[styles.tabBtn, tab === tId && [styles.tabActive, { borderBottomColor: colors.primary }]]}
          >
            <Text style={[styles.tabLabel, { color: tab === tId ? colors.primary : colors.mutedForeground }]}>
              {tId === "fees" ? t("fee_details") : t("scholarship")}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 90 }} showsVerticalScrollIndicator={false}>
        {tab === "fees" ? (
          <>
            {/* Premium Summary card */}
            <View style={[styles.summaryCard, { backgroundColor: colors.navy }]}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t("total_fees")}</Text>
                  <Text style={styles.summaryVal}>₹{FEE_SUMMARY.total.toLocaleString()}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t("paid_amount")}</Text>
                  <Text style={[styles.summaryVal, { color: "#34D399" }]}>₹{FEE_SUMMARY.paid.toLocaleString()}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>{t("pending_amount")}</Text>
                  <Text style={[styles.summaryVal, { color: "#F87171" }]}>₹{FEE_SUMMARY.pending.toLocaleString()}</Text>
                </View>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${paidPct}%` as any, backgroundColor: "#34D399" }]} />
              </View>
              <Text style={styles.progressLabel}>{paidPct}% {t("paid_amount").toLowerCase()} · {t("due_date")}: {FEE_SUMMARY.dueDate}</Text>
            </View>

            {/* Dynamic Due Alert */}
            {FEE_SUMMARY.pending > 0 && (
              <View style={[styles.alertCard, { backgroundColor: colors.destructive + "12", borderColor: colors.destructive + "30" }]}>
                <Feather name="alert-circle" size={20} color={colors.destructive} />
                <View style={{ flex: 1, paddingLeft: 8 }}>
                  <Text style={[styles.alertTitle, { color: colors.destructive }]}>Payment Warning</Text>
                  <Text style={[styles.alertBody, { color: colors.mutedForeground }]}>₹{FEE_SUMMARY.pending.toLocaleString()} due by {FEE_SUMMARY.dueDate}</Text>
                </View>
                <Pressable onPress={triggerPaymentFlow} style={[styles.payBtn, { backgroundColor: colors.destructive }]}>
                  <Text style={styles.payBtnText}>{t("pay_now")}</Text>
                </Pressable>
              </View>
            )}

            {/* Transaction history */}
            <Text style={[styles.sectionHeader, { color: colors.foreground, marginTop: 12 }]}>{t("payment_history")}</Text>
            {PAYMENT_HISTORY.map((p) => (
              <View key={p.id} style={[styles.txnCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.txnIcon, { backgroundColor: p.status === "paid" ? colors.success + "12" : colors.warning + "12" }]}>
                  <Feather name={p.status === "paid" ? "check-circle" : "clock"} size={16} color={p.status === "paid" ? colors.success : colors.warning} />
                </View>
                <View style={{ flex: 1, paddingLeft: 6 }}>
                  <Text style={[styles.txnDesc, { color: colors.foreground }]}>{p.desc}</Text>
                  <Text style={[styles.txnMeta, { color: colors.mutedForeground }]}>{p.date} · {p.mode} · {p.id}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 4 }}>
                  <Text style={[styles.txnAmt, { color: p.status === "paid" ? colors.success : colors.warning }]}>₹{p.amount.toLocaleString()}</Text>
                  
                  {p.status === "paid" ? (
                    <Pressable
                      onPress={() => handleDownloadReceipt(p.id)}
                      disabled={receiptDownloading === p.id}
                      style={[styles.receiptBtn, { borderColor: colors.border }]}
                    >
                      {receiptDownloading === p.id ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <>
                          <Feather name="download" size={11} color={colors.primary} />
                          <Text style={[styles.receiptText, { color: colors.primary }]}>Receipt</Text>
                        </>
                      )}
                    </Pressable>
                  ) : (
                    <View style={[styles.txnStatus, { backgroundColor: colors.warning + "12" }]}>
                      <Text style={[styles.txnStatusText, { color: colors.warning }]}>Pending</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Active Scholarships</Text>
            {SCHOLARSHIPS.map((s, i) => (
              <View key={i} style={[styles.scholarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.scholarRow}>
                  <View style={[styles.scholarIcon, { backgroundColor: colors.primary + "12" }]}>
                    <Feather name="award" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1, paddingLeft: 6 }}>
                    <Text style={[styles.scholarName, { color: colors.foreground }]}>{s.name}</Text>
                    <Text style={[styles.scholarType, { color: colors.mutedForeground }]}>{s.type} Scheme</Text>
                    <Text style={[styles.scholarAmt, { color: colors.primary }]}>₹{s.amount.toLocaleString()} / year</Text>
                  </View>
                  <View style={[styles.scholarStatus, { backgroundColor: s.status === "approved" ? colors.success + "12" : colors.warning + "12" }]}>
                    <Text style={[styles.scholarStatusText, { color: s.status === "approved" ? colors.success : colors.warning }]}>
                      {s.status === "approved" ? "Approved" : "Pending"}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Payment Selection Modal Sheet */}
      <Modal transparent visible={paymentModalVisible} animationType="slide" onRequestClose={() => setPaymentModalVisible(false)}>
        <Pressable onPress={() => setPaymentModalVisible(false)} style={styles.modalOverlay}>
          <View style={[styles.sheetContainer, { backgroundColor: colors.card }]}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetKnob} />
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Complete Your Payment</Text>
              <Text style={[styles.sheetSubtitle, { color: colors.mutedForeground }]}>AEC tuition Fee Sem 5 - ₹{FEE_SUMMARY.pending.toLocaleString()}</Text>
            </View>

            <View style={styles.payOptionGrid}>
              {[
                { name: "UPI (GPay / PhonePe)", icon: "phone", method: "upi" },
                { name: "Credit / Debit Card", icon: "credit-card", method: "card" },
                { name: "Net Banking", icon: "globe", method: "netbanking" },
              ].map((opt) => (
                <Pressable
                  key={opt.method}
                  onPress={() => handlePay(opt.method)}
                  disabled={paying}
                  style={({ pressed }) => [styles.payOptionRow, { borderColor: colors.border, opacity: pressed ? 0.75 : 1 }]}
                >
                  <View style={[styles.payOptionIcon, { backgroundColor: colors.primary + "12" }]}>
                    <Feather name={opt.icon as any} size={18} color={colors.primary} />
                  </View>
                  <Text style={[styles.payOptionName, { color: colors.foreground }]}>{opt.name}</Text>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>

            {paying && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loaderText, { color: colors.foreground }]}>Contacting Payment Gateway...</Text>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Animated Success Overlay */}
      <Modal transparent visible={successModalVisible} animationType="fade" onRequestClose={() => setSuccessModalVisible(false)}>
        <View style={styles.successContainer}>
          <View style={[styles.successCard, { backgroundColor: colors.card }]}>
            <View style={[styles.successIconRing, { backgroundColor: colors.success + "15" }]}>
              <Feather name="check" size={48} color={colors.success} />
            </View>
            <Text style={[styles.successTitle, { color: colors.foreground }]}>{t("payment_success")}</Text>
            <Text style={[styles.successMessage, { color: colors.mutedForeground }]}>
              Your payment of ₹{FEE_SUMMARY.pending.toLocaleString()} has been received. Transaction ID: TXN8500293
            </Text>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSuccessModalVisible(false);
              }}
              style={[styles.closeSuccessBtn, { backgroundColor: colors.success }]}
            >
              <Text style={styles.closeSuccessText}>Back to Finance</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 22, color: "#FFF", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, color: "#93C5FD", fontFamily: "Inter_400Regular", marginTop: 2 },
  tabRow: { flexDirection: "row", borderBottomWidth: 1 },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center", borderBottomWidth: 2.5, borderBottomColor: "transparent" },
  tabActive: {},
  tabLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  summaryCard: { borderRadius: 18, padding: 20, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  summaryRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryLabel: { color: "#93C5FD", fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 4 },
  summaryVal: { color: "#FFF", fontSize: 16, fontFamily: "Inter_700Bold" },
  divider: { width: 1, height: 32, backgroundColor: "#FFFFFF22" },
  progressBg: { height: 6, backgroundColor: "#FFFFFF22", borderRadius: 3, overflow: "hidden", marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { color: "#FFFFFFB3", fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  alertCard: { borderRadius: 16, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  alertTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  alertBody: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  payBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  payBtnText: { color: "#FFF", fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionHeader: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  txnCard: { flexDirection: "row", alignItems: "center", borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 8 },
  txnIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txnDesc: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  txnMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  txnAmt: { fontSize: 14, fontFamily: "Inter_700Bold" },
  receiptBtn: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3, marginTop: 4 },
  receiptText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  txnStatus: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, alignSelf: "flex-end" },
  txnStatusText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  scholarCard: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10 },
  scholarRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  scholarIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  scholarName: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 2 },
  scholarType: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 4 },
  scholarAmt: { fontSize: 14, fontFamily: "Inter_700Bold" },
  scholarStatus: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  scholarStatusText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheetContainer: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 320 },
  sheetHeader: { alignItems: "center", marginBottom: 18 },
  sheetKnob: { width: 40, height: 4, backgroundColor: "#E2E8F0", borderRadius: 2, marginBottom: 12 },
  sheetTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  sheetSubtitle: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4 },
  payOptionGrid: { gap: 10, marginTop: 10 },
  payOptionRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14, padding: 14, gap: 12 },
  payOptionIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  payOptionName: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  loaderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(255,255,255,0.85)", justifyContent: "center", alignItems: "center", borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  loaderText: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 14 },
  successContainer: { flex: 1, backgroundColor: "rgba(10,22,40,0.95)", justifyContent: "center", alignItems: "center", padding: 24 },
  successCard: { width: "100%", borderRadius: 24, padding: 24, alignItems: "center" },
  successIconRing: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  successTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 8 },
  successMessage: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20, marginBottom: 20 },
  closeSuccessBtn: { width: "100%", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  closeSuccessText: { color: "#FFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
