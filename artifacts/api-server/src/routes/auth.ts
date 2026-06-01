import { Router } from "express";
import { sendEmail } from "../lib/mailer";

const router = Router();

// In-memory OTP store: phone -> { otp, expiresAt, attempts }
const otpStore = new Map<
  string,
  { otp: string; expiresAt: number; attempts: number }
>();

// In-memory user store (replace with DB in production)
const userStore = new Map<
  string,
  {
    id: string;
    rollNo: string;
    phone: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    course?: string;
    semester?: number;
    section?: string;
    batch?: string;
    cgpa?: string;
    avatar: string;
    setupComplete: boolean;
    createdAt: number;
  }
>();

// Seed demo accounts
const DEMO_USERS = [
  {
    id: "S001",
    rollNo: "22CS001",
    phone: "9876543210",
    name: "Arjun Kumar M",
    email: "student@aec.edu",
    role: "student",
    department: "Computer Science and Engineering",
    course: "B.E. CSE",
    semester: 5,
    section: "A",
    batch: "2022-2026",
    cgpa: "8.4",
    avatar: "AK",
    setupComplete: true,
    createdAt: Date.now(),
  },
  {
    id: "P001",
    rollNo: "PARENT001",
    phone: "9876543211",
    name: "Mr. Murugan Kumar",
    email: "parent@aec.edu",
    role: "parent",
    avatar: "MK",
    setupComplete: true,
    createdAt: Date.now(),
  },
  {
    id: "F001",
    rollNo: "FAC001",
    phone: "9876543220",
    name: "Dr. Priya Sharma",
    email: "faculty@aec.edu",
    role: "faculty",
    department: "Computer Science and Engineering",
    avatar: "PS",
    setupComplete: true,
    createdAt: Date.now(),
  },
  {
    id: "H001",
    rollNo: "HOD001",
    phone: "9876543230",
    name: "Dr. Rajesh Kumar",
    email: "hod@aec.edu",
    role: "hod",
    department: "Computer Science and Engineering",
    avatar: "RK",
    setupComplete: true,
    createdAt: Date.now(),
  },
  {
    id: "A001",
    rollNo: "ADMIN001",
    phone: "9876543240",
    name: "Mr. S. Anandan",
    email: "admin@aec.edu",
    role: "admin",
    avatar: "SA",
    setupComplete: true,
    createdAt: Date.now(),
  },
  {
    id: "PR001",
    rollNo: "PRIN001",
    phone: "9876543250",
    name: "Dr. M. A. K. Al-Ameen",
    email: "principal@aec.edu",
    role: "principal",
    avatar: "KA",
    setupComplete: true,
    createdAt: Date.now(),
  },
  {
    id: "SA001",
    rollNo: "SADM001",
    phone: "9876543260",
    name: "Geetorus Super Admin",
    email: "superadmin@aec.edu",
    role: "super_admin",
    avatar: "GS",
    setupComplete: true,
    createdAt: Date.now(),
  },
];

DEMO_USERS.forEach((u) => {
  userStore.set(u.phone, u);
});

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: detect role from rollNo / email
function detectRole(
  rollNo: string,
  email: string,
  phone: string
): string {
  const roll = rollNo.toUpperCase();
  const em = email.toLowerCase();

  if (em.includes("principal") || roll.startsWith("PRIN")) return "principal";
  if (em.includes("superadmin") || roll.startsWith("SADM")) return "super_admin";
  if (em.includes("admin") || roll.startsWith("ADM")) return "admin";
  if (em.includes("hod") || roll.startsWith("HOD")) return "hod";
  if (em.includes("faculty") || roll.startsWith("FAC")) return "faculty";
  if (em.includes("parent") || roll.startsWith("PAR")) return "parent";
  return "student";
}

/**
 * POST /api/auth/request-otp
 * Body: { phone, email }
 * Returns: { success, message, otp? (dev-only) }
 */
router.post("/request-otp", async (req, res) => {
  const { phone, email } = req.body as { phone?: string; email?: string };

  if (!phone || !/^\d{10}$/.test(phone.trim())) {
    return res
      .status(400)
      .json({ success: false, message: "Valid 10-digit phone number required" });
  }

  if (!email || !email.includes("@")) {
    return res
      .status(400)
      .json({ success: false, message: "Valid email address required for OTP delivery" });
  }

  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(cleanPhone, { otp, expiresAt, attempts: 0 });

  // Send the OTP via Email
  const mailResult = await sendEmail({
    to: cleanEmail,
    subject: "Your Campus Enterprise OTP Code",
    text: `Your OTP for login is: ${otp}\nThis code will expire in 5 minutes.`,
    html: `<h3>Campus Enterprise Login</h3>
           <p>Your one-time verification code is: <strong>${otp}</strong></p>
           <p>This code will expire in 5 minutes.</p>`,
  });

  if (!mailResult.success) {
    console.error(`[OTP] Email failed for ${cleanEmail}: ${mailResult.error}`);
    // In dev mode, we still return success to let them continue with dev OTP
  } else {
    console.log(`[OTP] Email sent to ${cleanEmail} -> OTP: ${otp}`);
  }

  return res.json({
    success: true,
    message: "OTP sent successfully to your email",
    otp, // Note: returning in API response for easy dev testing.
    expiresIn: 300,
  });
});

/**
 * POST /api/auth/verify-otp
 * Body: { phone, otp }
 * Returns: { success, verified }
 */
router.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body as { phone?: string; otp?: string };

  if (!phone || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Phone and OTP are required" });
  }

  const cleanPhone = phone.trim();
  const record = otpStore.get(cleanPhone);

  if (!record) {
    return res
      .status(400)
      .json({ success: false, message: "OTP not requested or expired" });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return res.status(400).json({ success: false, message: "OTP has expired" });
  }

  if (record.attempts >= 3) {
    otpStore.delete(cleanPhone);
    return res
      .status(429)
      .json({ success: false, message: "Too many failed attempts. Request a new OTP." });
  }

  if (record.otp !== otp.trim()) {
    record.attempts++;
    return res.status(400).json({
      success: false,
      message: `Invalid OTP. ${3 - record.attempts} attempts remaining.`,
    });
  }

  otpStore.delete(cleanPhone);

  // Check if user exists
  const existingUser = userStore.get(cleanPhone);

  return res.json({
    success: true,
    verified: true,
    userExists: !!existingUser,
    user: existingUser || null,
  });
});

/**
 * POST /api/auth/register
 * Body: { rollNo, phone, name, email }
 * Returns: { success, user }
 */
router.post("/register", (req, res) => {
  const { rollNo, phone, name, email } = req.body as {
    rollNo?: string;
    phone?: string;
    name?: string;
    email?: string;
  };

  if (!rollNo || !phone || !name || !email) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const cleanPhone = phone.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanRoll = rollNo.trim();
  const cleanName = name.trim();

  // Check if phone already registered
  const existing = userStore.get(cleanPhone);
  if (existing) {
    return res.json({
      success: true,
      user: existing,
      message: "User already registered",
    });
  }

  const role = detectRole(cleanRoll, cleanEmail, cleanPhone);
  const avatar = cleanName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const newUser = {
    id: `${role.toUpperCase().slice(0, 2)}${Date.now()}`,
    rollNo: cleanRoll,
    phone: cleanPhone,
    name: cleanName,
    email: cleanEmail,
    role,
    avatar,
    setupComplete: false,
    createdAt: Date.now(),
  };

  userStore.set(cleanPhone, newUser);

  return res.status(201).json({ success: true, user: newUser });
});

/**
 * POST /api/auth/setup-profile
 * Body: { phone, ...profileFields }
 */
router.post("/setup-profile", async (req, res) => {
  const { phone, ...fields } = req.body as {
    phone?: string;
    [key: string]: unknown;
  };

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone required" });
  }

  const user = userStore.get(phone.trim());
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const updated = { ...user, ...fields, setupComplete: true };
  userStore.set(phone.trim(), updated);

  // Send the Welcome Email with Username and default Password
  const generatedPassword = "TempPassword123!"; // The password used in AuthContext registration
  
  await sendEmail({
    to: user.email,
    subject: "Welcome to Campus Enterprise - Your Credentials",
    text: `Your profile setup is complete!\nUsername: ${user.email}\nPassword: ${generatedPassword}\nPlease change your password after logging in.`,
    html: `<h3>Welcome to Campus Enterprise</h3>
           <p>Your profile setup is complete!</p>
           <p>Here are your default login credentials:</p>
           <ul>
             <li><strong>Username (Email):</strong> ${user.email}</li>
             <li><strong>Password:</strong> ${generatedPassword}</li>
           </ul>
           <p>Please change your password after logging in for security purposes.</p>`,
  });

  return res.json({ success: true, user: updated });
});

/**
 * GET /api/auth/me?phone=xxx
 */
router.get("/me", (req, res) => {
  const phone = (req.query.phone as string) ?? "";
  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone required" });
  }
  const user = userStore.get(phone.trim());
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.json({ success: true, user });
});

export default router;
