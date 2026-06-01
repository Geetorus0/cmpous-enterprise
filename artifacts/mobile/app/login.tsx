import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth, AppUser } from "@/context/AuthContext";
import { useTranslation, Locale } from "@/context/TranslationContext";
import { useColors } from "@/hooks/useColors";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";

const QUICK_LOGINS = [
  { label: "Student", email: "student@aec.edu", icon: "user", color: "#1565C0" },
  { label: "Parent", email: "parent@aec.edu", icon: "users", color: "#EC4899" },
  { label: "Faculty", email: "faculty@aec.edu", icon: "briefcase", color: "#0EA5E9" },
  { label: "HOD", email: "hod@aec.edu", icon: "shield", color: "#7C3AED" },
  { label: "Admin", email: "admin@aec.edu", icon: "database", color: "#D97706" },
  { label: "Principal", email: "principal@aec.edu", icon: "award", color: "#10B981" },
  { label: "Super Admin", email: "superadmin@aec.edu", icon: "settings", color: "#64748B" },
];

export default function LoginScreen() {
  const { login, requestOtp, verifyOtp, registerUser, setupProfile } = useAuth();
  const colors = useColors();
  const { t, locale, setLocale } = useTranslation();
  const insets = useSafeAreaInsets();

  // Multi-step: "landing" | "details" | "otp" | "setup"
  const [step, setStep] = useState<"landing" | "details" | "otp" | "setup">("landing");

  // Form Inputs
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // OTP State
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  // Setup Details
  const [detectedRole, setDetectedRole] = useState<string>("student");
  const [setupFields, setSetupFields] = useState({
    department: "",
    course: "",
    semester: "1",
    section: "A",
    batch: "2024-2028",
    parentPhone: "",
    cgpa: "9.0",
    employeeId: "",
    designation: "",
    studentName: "",
    studentId: "",
    subjects: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "Permission to access media library is required to upload a profile picture.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (pickerResult.canceled) {
      return;
    }

    const selectedUri = pickerResult.assets[0].uri;
    await uploadAvatarImage(selectedUri);
  };

  const uploadAvatarImage = async (uri: string) => {
    setUploadingImage(true);
    setError("");
    try {
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const response = await fetch(uri);
      const blob = await response.blob();

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filename, blob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filename);

      setAvatarUrl(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Timer countdown for OTP
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleStartLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("details");
  };

  const handleRequestOtp = async () => {
    if (!rollNo.trim()) {
      setError("Please enter your Roll Number / Employee ID");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your Full Name");
      return;
    }
    if (!phone.trim() || phone.length !== 10) {
      setError("Please enter a valid 10-digit Phone Number");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid Email Address");
      return;
    }

    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 1. Register or seed user first
    const regResult = await registerUser(
      rollNo.trim(),
      phone.trim(),
      name.trim(),
      email.trim()
    );

    if (!regResult.success) {
      setError(regResult.error ?? "Failed to initialize registration");
      setLoading(false);
      return;
    }

    // Capture the detected role of the registered user
    const userRole = regResult.user?.role || "student";
    setDetectedRole(userRole);

    // 2. Request OTP code
    const otpResult = await requestOtp(phone.trim(), email.trim());
    setLoading(false);

    if (!otpResult.success) {
      setError(otpResult.error ?? "Failed to request OTP code");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (otpResult.otp) {
        setDevOtpHint(otpResult.otp); // DEV OTP Auto-Hint
      }
      setOtpTimer(60);
      setStep("otp");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter the 6-digit OTP code");
      return;
    }

    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await verifyOtp(phone.trim(), otp.trim());
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Invalid OTP code");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const appUser = result.user;

      if (appUser && appUser.setupComplete) {
        // Setup complete: proceed directly to portal index router
        router.replace("/");
      } else {
        // Go to Setup Details step
        setStep("setup");
      }
    }
  };

  const handleCompleteSetup = async () => {
    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Format specific fields for dynamic roles
    const payload: Partial<AppUser> = {};

    if (detectedRole === "student") {
      if (!setupFields.course || !setupFields.department) {
        setError("Course and Department are required");
        setLoading(false);
        return;
      }
      Object.assign(payload, {
        registerNumber: rollNo,
        course: setupFields.course,
        department: setupFields.department,
        semester: parseInt(setupFields.semester) || 1,
        section: setupFields.section,
        batch: setupFields.batch,
        parentPhone: setupFields.parentPhone || "9876543211",
        cgpa: setupFields.cgpa || "8.5",
      });
    } else if (detectedRole === "faculty") {
      if (!setupFields.employeeId || !setupFields.department) {
        setError("Employee ID and Department are required");
        setLoading(false);
        return;
      }
      Object.assign(payload, {
        employeeId: setupFields.employeeId,
        department: setupFields.department,
        designation: setupFields.designation || "Assistant Professor",
        subjects: setupFields.subjects ? setupFields.subjects.split(",").map(s => s.trim()) : ["Data Structures"],
      });
    } else if (detectedRole === "hod") {
      if (!setupFields.employeeId || !setupFields.department) {
        setError("Employee ID and Department are required");
        setLoading(false);
        return;
      }
      Object.assign(payload, {
        employeeId: setupFields.employeeId,
        department: setupFields.department,
      });
    } else if (detectedRole === "parent") {
      if (!setupFields.studentName || !setupFields.studentId) {
        setError("Student details are required");
        setLoading(false);
        return;
      }
      Object.assign(payload, {
        studentName: setupFields.studentName,
        studentId: setupFields.studentId,
      });
    } else {
      // Principal / Admin / Super Admin
      if (!setupFields.employeeId) {
        setError("Employee ID is required");
        setLoading(false);
        return;
      }
      Object.assign(payload, {
        employeeId: setupFields.employeeId,
      });
    }

    if (avatarUrl) {
      Object.assign(payload, { avatar: avatarUrl });
    }

    const result = await setupProfile(phone.trim(), payload);
    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Failed to save profile setup details");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/");
    }
  };

  // Demo direct bypass
  const handleQuickDemoLogin = async (demoEmail: string) => {
    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await login(demoEmail, "aec123");
    setLoading(false);
    if (!result.success) {
      setError(result.error ?? "Quick Login failed");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/");
    }
  };

  const toggleLanguage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const order: Locale[] = ["en", "ta", "te", "hi", "ml", "ur", "kn"];
    const nextIdx = (order.indexOf(locale) + 1) % order.length;
    setLocale(order[nextIdx]);
  };

  const LANG_LABELS: Record<Locale, string> = {
    en: "English",
    ta: "தமிழ்",
    te: "తెలుగు",
    hi: "हिन्दी",
    ml: "മലയാളം",
    ur: "اردو",
    kn: "ಕನ್ನಡ",
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <LinearGradient colors={["#0A1628", "#122A4E", "#0A1628"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: topPad + 12, paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header language cycling toggle */}
          <View style={styles.topBar}>
            <Pressable onPress={toggleLanguage} style={styles.langBtn}>
              <Feather name="globe" size={16} color="#93C5FD" />
              <Text style={styles.langBtnText}>{LANG_LABELS[locale]}</Text>
            </Pressable>
          </View>

          {/* AEC Portal Brand Info */}
          <View style={styles.header}>
            <View style={styles.logoRing}>
              <View style={styles.iconContainer}>
                <Image source={require("@/assets/images/icon.png")} style={styles.iconImg} resizeMode="contain" />
              </View>
            </View>
            <Text style={styles.appName}>{t("aec")}</Text>
            <Text style={styles.tagline}>{t("clg_name")}</Text>
            <Text style={styles.developed}>{t("developed_by")}</Text>
          </View>

          {/* Premium Multi-step login flow panel */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {step === "landing" && (
              <View style={styles.stepContainer}>
                <Text style={[styles.title, { color: colors.foreground }]}>{t("welcome_back")}</Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  Experience real-time interactive university access and portal operations
                </Text>

                <Pressable
                  onPress={handleStartLogin}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
                  ]}
                >
                  <Text style={styles.btnText}>Login / Get Started</Text>
                  <Feather name="arrow-right" size={18} color="#FFF" />
                </Pressable>
              </View>
            )}

            {step === "details" && (
              <View style={styles.stepContainer}>
                <Text style={[styles.title, { color: colors.foreground }]}>Onboarding Details</Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  Enter registration info to initialize verified login
                </Text>

                {error ? (
                  <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: colors.destructive }]}>
                    <Feather name="alert-circle" size={16} color={colors.destructive} style={{ marginRight: 8 }} />
                    <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                  </View>
                ) : null}

                {/* Roll No */}
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Roll No / Employee ID</Text>
                  <View style={styles.inputRow}>
                    <Feather name="hash" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
                    <TextInput
                      value={rollNo}
                      onChangeText={setRollNo}
                      placeholder="e.g. 22CS001"
                      placeholderTextColor={colors.mutedForeground}
                      autoCapitalize="characters"
                      style={[styles.input, { color: colors.foreground }]}
                    />
                  </View>
                </View>

                {/* Full Name */}
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Full Name</Text>
                  <View style={styles.inputRow}>
                    <Feather name="user" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Your registered name"
                      placeholderTextColor={colors.mutedForeground}
                      style={[styles.input, { color: colors.foreground }]}
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Phone Number</Text>
                  <View style={styles.inputRow}>
                    <Feather name="phone" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="10-digit number"
                      placeholderTextColor={colors.mutedForeground}
                      keyboardType="phone-pad"
                      maxLength={10}
                      style={[styles.input, { color: colors.foreground }]}
                    />
                  </View>
                </View>

                {/* Mail */}
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Mail Address</Text>
                  <View style={styles.inputRow}>
                    <Feather name="mail" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="user@example.com"
                      placeholderTextColor={colors.mutedForeground}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.input, { color: colors.foreground }]}
                    />
                  </View>
                </View>

                <View style={styles.btnRow}>
                  <Pressable
                    onPress={() => setStep("landing")}
                    style={[styles.backBtn, { borderColor: colors.border }]}
                  >
                    <Feather name="arrow-left" size={18} color={colors.foreground} />
                  </Pressable>

                  <Pressable
                    onPress={handleRequestOtp}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.primaryBtn,
                      { flex: 1, backgroundColor: colors.primary, opacity: pressed || loading ? 0.85 : 1 },
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.btnText}>Generate OTP</Text>
                        <Feather name="shield" size={18} color="#FFF" />
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            {step === "otp" && (
              <View style={styles.stepContainer}>
                <Text style={[styles.title, { color: colors.foreground }]}>OTP Verification</Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  Enter the 6-digit security code sent to {phone}
                </Text>

                {error ? (
                  <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: colors.destructive }]}>
                    <Feather name="alert-circle" size={16} color={colors.destructive} style={{ marginRight: 8 }} />
                    <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                  </View>
                ) : null}

                {devOtpHint ? (
                  <Pressable 
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      setOtp(devOtpHint);
                    }}
                    style={({ pressed }) => [
                      styles.devHintBox, 
                      { 
                        borderColor: colors.primary + "40", 
                        backgroundColor: colors.primary + "12",
                        opacity: pressed ? 0.8 : 1,
                        paddingVertical: 12
                      }
                    ]}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <Feather name="cpu" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                      <View>
                        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>Real-time Generated OTP</Text>
                        <Text style={{ fontSize: 11, color: colors.mutedForeground, marginTop: 1 }}>Tap to autofill: <Text style={{ fontWeight: "700", color: colors.foreground }}>{devOtpHint}</Text></Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.primary} />
                  </Pressable>
                ) : null}

                {/* OTP Input */}
                <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                  <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Security Verification Code</Text>
                  <View style={styles.inputRow}>
                    <Feather name="lock" size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
                    <TextInput
                      value={otp}
                      onChangeText={setOtp}
                      placeholder="••••••"
                      placeholderTextColor={colors.mutedForeground}
                      keyboardType="number-pad"
                      maxLength={6}
                      style={[styles.input, { color: colors.foreground, letterSpacing: 4, fontWeight: "bold" }]}
                    />
                  </View>
                </View>

                {/* Resend timer */}
                <View style={styles.timerRow}>
                  {otpTimer > 0 ? (
                    <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
                      Resend code in <Text style={{ color: colors.primary, fontWeight: "bold" }}>{otpTimer}s</Text>
                    </Text>
                  ) : (
                    <Pressable onPress={handleRequestOtp}>
                      <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 13 }}>Resend Code</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.btnRow}>
                  <Pressable
                    onPress={() => setStep("details")}
                    style={[styles.backBtn, { borderColor: colors.border }]}
                  >
                    <Feather name="arrow-left" size={18} color={colors.foreground} />
                  </Pressable>

                  <Pressable
                    onPress={handleVerifyOtp}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.primaryBtn,
                      { flex: 1, backgroundColor: colors.primary, opacity: pressed || loading ? 0.85 : 1 },
                    ]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.btnText}>Verify & Proceed</Text>
                        <Feather name="check" size={18} color="#FFF" />
                      </>
                    )}
                  </Pressable>
                </View>
              </View>
            )}

            {step === "setup" && (
              <View style={styles.stepContainer}>
                <Text style={[styles.title, { color: colors.foreground }]}>Complete Profile</Text>
                <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                  Configure details for your detected role: <Text style={{ color: colors.primary, fontWeight: "bold" }}>{detectedRole.toUpperCase()}</Text>
                </Text>

                {/* Profile Picture Uploader */}
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <Pressable 
                    onPress={pickImage} 
                    disabled={uploadingImage}
                    style={({ pressed }) => [
                      {
                        width: 90,
                        height: 90,
                        borderRadius: 45,
                        borderWidth: 1.5,
                        borderColor: colors.primary,
                        borderStyle: avatarUrl ? "solid" : "dashed",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: colors.muted,
                        overflow: "hidden",
                        opacity: pressed ? 0.8 : 1,
                      }
                    ]}
                  >
                    {uploadingImage ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : avatarUrl ? (
                      <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: "100%" }} />
                    ) : (
                      <View style={{ alignItems: "center" }}>
                        <Feather name="camera" size={22} color={colors.primary} />
                        <Text style={{ fontSize: 9, color: colors.mutedForeground, marginTop: 4, fontWeight: "600" }}>UPLOAD PHOTO</Text>
                      </View>
                    )}
                  </Pressable>
                  {avatarUrl ? (
                    <Text style={{ fontSize: 11, color: colors.primary, marginTop: 6, fontWeight: "600" }}>Photo Uploaded Successfully</Text>
                  ) : null}
                </View>

                {error ? (
                  <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: colors.destructive }]}>
                    <Feather name="alert-circle" size={16} color={colors.destructive} style={{ marginRight: 8 }} />
                    <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                  </View>
                ) : null}

                {/* Student specific fields */}
                {detectedRole === "student" && (
                  <>
                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Department</Text>
                      <TextInput
                        value={setupFields.department}
                        onChangeText={(t) => setSetupFields({ ...setupFields, department: t })}
                        placeholder="e.g. Computer Science"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Course / Degree</Text>
                      <TextInput
                        value={setupFields.course}
                        onChangeText={(t) => setSetupFields({ ...setupFields, course: t })}
                        placeholder="e.g. B.E. CSE"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={styles.flexInputs}>
                      <View style={[styles.inputWrapper, { flex: 1, borderColor: colors.border, backgroundColor: colors.muted }]}>
                        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Semester</Text>
                        <TextInput
                          value={setupFields.semester}
                          onChangeText={(t) => setSetupFields({ ...setupFields, semester: t })}
                          placeholder="e.g. 5"
                          keyboardType="numeric"
                          placeholderTextColor={colors.mutedForeground}
                          style={[styles.input, { color: colors.foreground }]}
                        />
                      </View>
                      <View style={[styles.inputWrapper, { flex: 1, borderColor: colors.border, backgroundColor: colors.muted }]}>
                        <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Section</Text>
                        <TextInput
                          value={setupFields.section}
                          onChangeText={(t) => setSetupFields({ ...setupFields, section: t })}
                          placeholder="e.g. A"
                          placeholderTextColor={colors.mutedForeground}
                          style={[styles.input, { color: colors.foreground }]}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Batch / Year</Text>
                      <TextInput
                        value={setupFields.batch}
                        onChangeText={(t) => setSetupFields({ ...setupFields, batch: t })}
                        placeholder="e.g. 2022-2026"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>
                  </>
                )}

                {/* Faculty Specific Fields */}
                {detectedRole === "faculty" && (
                  <>
                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Employee ID</Text>
                      <TextInput
                        value={setupFields.employeeId}
                        onChangeText={(t) => setSetupFields({ ...setupFields, employeeId: t })}
                        placeholder="FAC001"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Department</Text>
                      <TextInput
                        value={setupFields.department}
                        onChangeText={(t) => setSetupFields({ ...setupFields, department: t })}
                        placeholder="Computer Science"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Designation</Text>
                      <TextInput
                        value={setupFields.designation}
                        onChangeText={(t) => setSetupFields({ ...setupFields, designation: t })}
                        placeholder="Associate Professor"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Subjects Taught (comma-separated)</Text>
                      <TextInput
                        value={setupFields.subjects}
                        onChangeText={(t) => setSetupFields({ ...setupFields, subjects: t })}
                        placeholder="Data Structures, DBMS"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>
                  </>
                )}

                {/* HOD Specific Fields */}
                {detectedRole === "hod" && (
                  <>
                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Employee ID</Text>
                      <TextInput
                        value={setupFields.employeeId}
                        onChangeText={(t) => setSetupFields({ ...setupFields, employeeId: t })}
                        placeholder="HOD001"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Department</Text>
                      <TextInput
                        value={setupFields.department}
                        onChangeText={(t) => setSetupFields({ ...setupFields, department: t })}
                        placeholder="Computer Science and Engineering"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>
                  </>
                )}

                {/* Parent Specific Fields */}
                {detectedRole === "parent" && (
                  <>
                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Student Full Name</Text>
                      <TextInput
                        value={setupFields.studentName}
                        onChangeText={(t) => setSetupFields({ ...setupFields, studentName: t })}
                        placeholder="Your child's name"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>

                    <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Student Roll Number</Text>
                      <TextInput
                        value={setupFields.studentId}
                        onChangeText={(t) => setSetupFields({ ...setupFields, studentId: t })}
                        placeholder="Your child's Roll Number"
                        placeholderTextColor={colors.mutedForeground}
                        style={[styles.input, { color: colors.foreground }]}
                      />
                    </View>
                  </>
                )}

                {/* Principal / Admin / Super Admin general setup */}
                {(detectedRole === "principal" || detectedRole === "admin" || detectedRole === "super_admin") && (
                  <View style={[styles.inputWrapper, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                    <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Employee ID</Text>
                    <TextInput
                      value={setupFields.employeeId}
                      onChangeText={(t) => setSetupFields({ ...setupFields, employeeId: t })}
                      placeholder="e.g. PRIN001"
                      placeholderTextColor={colors.mutedForeground}
                      style={[styles.input, { color: colors.foreground }]}
                    />
                  </View>
                )}

                <Pressable
                  onPress={handleCompleteSetup}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { backgroundColor: colors.primary, opacity: pressed || loading ? 0.85 : 1, marginTop: 12 },
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Text style={styles.btnText}>Complete Account Setup</Text>
                      <Feather name="check-circle" size={18} color="#FFF" />
                    </>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  topBar: { flexDirection: "row", justifyContent: "flex-end", marginVertical: 10 },
  langBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#FFFFFF15", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 6 },
  langBtnText: { color: "#93C5FD", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  header: { alignItems: "center", marginBottom: 20 },
  logoRing: { padding: 4, borderRadius: 28, borderWidth: 1.5, borderColor: "#3B82F650", marginBottom: 12 },
  iconContainer: { width: 72, height: 72, borderRadius: 24, overflow: "hidden", backgroundColor: "#122A4E", justifyContent: "center", alignItems: "center" },
  iconImg: { width: 56, height: 56 },
  appName: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: 4 },
  tagline: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#93C5FD", marginTop: 4, textAlign: "center" },
  developed: { fontSize: 10, fontFamily: "Inter_400Regular", color: "#64748B", marginTop: 6, letterSpacing: 0.5 },
  card: { borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  stepContainer: { width: "100%" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 4 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 20, lineHeight: 18 },
  errorBox: { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1 },
  errorText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  devHintBox: { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, backgroundColor: "#3B82F60A" },
  devHintText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#93C5FD" },
  devHintBold: { fontWeight: "bold", color: "#FFF" },
  inputWrapper: { borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8, marginBottom: 14 },
  inputLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular", paddingVertical: 4 },
  flexInputs: { flexDirection: "row", gap: 10 },
  btnRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  timerRow: { alignItems: "flex-end", marginBottom: 16 },
  backBtn: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  primaryBtn: { flexDirection: "row", height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 20 },
  btnText: { color: "#FFFFFF", fontSize: 15, fontFamily: "Inter_600SemiBold" },
  demoSection: { alignItems: "center", marginTop: 4 },
  demoDividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  divider: { flex: 1, height: 1, backgroundColor: "#FFFFFF20", minWidth: 40 },
  demoLabel: { color: "#64748B", fontSize: 11, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5, textTransform: "uppercase" },
  demoGrid: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  demoBtn: { flexDirection: "row", alignItems: "center", borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8, gap: 6 },
  demoIcon: { width: 18, height: 18, borderRadius: 5, alignItems: "center", justifyContent: "center" },
  demoBtnLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
