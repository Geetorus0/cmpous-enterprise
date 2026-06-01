import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { setBaseUrl } from "@workspace/api-client-react";
import { supabase } from "../lib/supabase";

// Dynamically resolve API server address to prevent connection/network errors on emulators
const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "android") {
    // 10.0.2.2 is the special Android loopback address to the host machine
    return "http://10.0.2.2:3000";
  }
  return "http://localhost:3000";
};

const BASE_URL = getApiBaseUrl();
setBaseUrl(BASE_URL);

const API_BASE = `${BASE_URL}/api`;

export type UserRole = "student" | "parent" | "faculty" | "hod" | "admin" | "principal" | "super_admin";

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  role: "student";
  registerNumber: string;
  department: string;
  course: string;
  semester: number;
  section: string;
  batch: string;
  phone: string;
  parentPhone: string;
  cgpa: string;
  avatar: string;
  setupComplete?: boolean;
}

export interface ParentUser {
  id: string;
  name: string;
  email: string;
  role: "parent";
  studentName: string;
  studentId: string;
  phone: string;
  avatar: string;
  setupComplete?: boolean;
}

export interface FacultyUser {
  id: string;
  name: string;
  email: string;
  role: "faculty";
  employeeId: string;
  department: string;
  designation: string;
  subjects: string[];
  phone: string;
  avatar: string;
  setupComplete?: boolean;
}

export interface HodUser {
  id: string;
  name: string;
  email: string;
  role: "hod";
  employeeId: string;
  department: string;
  phone: string;
  avatar: string;
  setupComplete?: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
  employeeId: string;
  phone: string;
  avatar: string;
  setupComplete?: boolean;
}

export interface PrincipalUser {
  id: string;
  name: string;
  email: string;
  role: "principal";
  employeeId: string;
  phone: string;
  avatar: string;
  setupComplete?: boolean;
}

export interface SuperAdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin";
  employeeId: string;
  phone: string;
  avatar: string;
  setupComplete?: boolean;
}

export type AppUser = StudentUser | ParentUser | FacultyUser | HodUser | AdminUser | PrincipalUser | SuperAdminUser;

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  requestOtp: (phone: string, email?: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; verified?: boolean; userExists?: boolean; user?: AppUser | null; error?: string }>;
  registerUser: (rollNo: string, phone: string, name: string, email: string) => Promise<{ success: boolean; user?: AppUser; error?: string }>;
  setupProfile: (phone: string, details: Partial<AppUser>) => Promise<{ success: boolean; user?: AppUser; error?: string }>;
  setUserState: (user: AppUser) => void;
}

const DEMO_ACCOUNTS: Record<string, { password: string; user: AppUser }> = {
  "student@aec.edu": {
    password: "aec123",
    user: {
      id: "S001",
      name: "Arjun Kumar M",
      email: "student@aec.edu",
      role: "student",
      registerNumber: "22CS001",
      department: "Computer Science and Engineering",
      course: "B.E. CSE",
      semester: 5,
      section: "A",
      batch: "2022-2026",
      phone: "9876543210",
      parentPhone: "9876543211",
      cgpa: "8.4",
      avatar: "AK",
      setupComplete: true,
    },
  },
  "parent@aec.edu": {
    password: "aec123",
    user: {
      id: "P001",
      name: "Mr. Murugan Kumar",
      email: "parent@aec.edu",
      role: "parent",
      studentName: "Arjun Kumar M",
      studentId: "S001",
      phone: "9876543211",
      avatar: "MK",
      setupComplete: true,
    },
  },
  "faculty@aec.edu": {
    password: "aec123",
    user: {
      id: "F001",
      name: "Dr. Priya Sharma",
      email: "faculty@aec.edu",
      role: "faculty",
      employeeId: "FAC001",
      department: "Computer Science and Engineering",
      designation: "Associate Professor",
      subjects: ["Data Structures", "Computer Networks", "DBMS"],
      phone: "9876543220",
      avatar: "PS",
      setupComplete: true,
    },
  },
  "hod@aec.edu": {
    password: "aec123",
    user: {
      id: "H001",
      name: "Dr. Rajesh Kumar",
      email: "hod@aec.edu",
      role: "hod",
      employeeId: "HOD001",
      department: "Computer Science and Engineering",
      phone: "9876543230",
      avatar: "RK",
      setupComplete: true,
    },
  },
  "admin@aec.edu": {
    password: "aec123",
    user: {
      id: "A001",
      name: "Mr. S. Anandan",
      email: "admin@aec.edu",
      role: "admin",
      employeeId: "ADMIN001",
      phone: "9876543240",
      avatar: "SA",
      setupComplete: true,
    },
  },
  "principal@aec.edu": {
    password: "aec123",
    user: {
      id: "PR001",
      name: "Dr. M. A. K. Al-Ameen",
      email: "principal@aec.edu",
      role: "principal",
      employeeId: "PRIN001",
      phone: "9876543250",
      avatar: "KA",
      setupComplete: true,
    },
  },
  "superadmin@aec.edu": {
    password: "aec123",
    user: {
      id: "SA001",
      name: "Geetorus Super Admin",
      email: "superadmin@aec.edu",
      role: "super_admin",
      employeeId: "SADM001",
      phone: "9876543260",
      avatar: "GS",
      setupComplete: true,
    },
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "@aec_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const userObj = JSON.parse(stored);
          setUser(userObj);
          if (userObj.id) {
            await fetchUserProfile(userObj.id);
          }
        }
      } catch (err) {
        console.error("Failed to load user state", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        // Fallback if profile not created yet
        setIsLoading(false);
        return;
      }

      // Convert DB profile model to AppUser structure
      const appUser: AppUser = {
        id: data.id,
        name: data.name || "User",
        email: data.email || "",
        role: (data.role || "student") as UserRole,
        registerNumber: data.roll_no || "",
        department: data.department || "",
        course: data.course || "",
        semester: data.semester || 1,
        section: data.section || "A",
        batch: data.batch || "",
        phone: data.phone || "",
        parentPhone: data.parent_phone || "",
        cgpa: data.cgpa || "0.0",
        employeeId: data.employee_id || "",
        designation: data.designation || "",
        subjects: data.subjects || [],
        studentName: data.student_name || "",
        studentId: data.student_id || "",
        avatar: data.avatar || "U",
        setupComplete: data.setup_complete || false,
      } as any;

      setUser(appUser);
      
      // Setup Realtime synchronization subscription for this profile to keep user synced
      const profileChannel = supabase
        .channel(`profile-${userId}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", filter: `id=eq.${userId}`, schema: "public", table: "profiles" },
          (payload) => {
            const updated = payload.new as any;
            setUser((prev) => {
              if (!prev) return null;
              const p = prev as any;
              return {
                ...p,
                name: updated.name || p.name,
                role: updated.role || p.role,
                setupComplete: updated.setup_complete ?? p.setupComplete,
                department: updated.department || p.department,
                course: updated.course || p.course,
                semester: updated.semester || p.semester,
                section: updated.section || p.section,
                batch: updated.batch || p.batch,
                cgpa: updated.cgpa || p.cgpa,
                employeeId: updated.employee_id || p.employeeId,
                designation: updated.designation || p.designation,
                subjects: updated.subjects || p.subjects,
              } as any;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(profileChannel);
      };
    } catch (_) {
      // Error recovery
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
      // Basic mock login for bypass (OTP is main flow)
      return { success: true };
  };

  const logout = async () => {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const requestOtp = async (phone: string, email?: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, email }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to send OTP");
      return { success: true, otp: data.otp };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to send OTP" };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Failed to verify OTP");
      
      // Look up or return user
      let appUser = user;
      if (data.user) {
        appUser = data.user;
        setUser(data.user);
      }
      
      return {
        success: true,
        verified: true,
        userExists: data.userExists,
        user: appUser,
      };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to verify OTP" };
    }
  };

  const registerUser = async (rollNo: string, phone: string, name: string, email: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNo, phone, name, email }),
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to register via API");
      }

      const userId = data.user.id;
      if (userId) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: email.trim(),
            phone: phone.trim(),
            roll_no: rollNo.trim(),
            name: name.trim(),
            role: data.user.role || "student",
            setup_complete: false,
          });
        if (profileError) console.error("Profile db insert error:", profileError.message);
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to register" };
    }
  };

  const setupProfile = async (phone: string, details: Partial<AppUser>) => {
    try {
      const currentUserId = user?.id;

      if (!currentUserId) return { success: false, error: "No active session found" };

      const det = details as any;
      const dbFields = {
        roll_no: det.registerNumber,
        department: det.department,
        course: det.course,
        semester: det.semester,
        section: det.section,
        batch: det.batch,
        parent_phone: det.parentPhone,
        cgpa: det.cgpa,
        employee_id: det.employeeId,
        designation: det.designation,
        subjects: det.subjects,
        student_name: det.studentName,
        student_id: det.studentId,
        avatar: det.avatar,
        setup_complete: true,
      };

      const { data, error } = await supabase
        .from("profiles")
        .update(dbFields)
        .eq("id", currentUserId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };

      await fetchUserProfile(currentUserId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update profile setup details" };
    }
  };

  const setUserState = (updatedUser: AppUser) => {
    AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser)).catch(() => {});
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, requestOtp, verifyOtp, registerUser, setupProfile, setUserState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
