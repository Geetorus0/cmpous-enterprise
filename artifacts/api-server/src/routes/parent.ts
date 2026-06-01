import { Router } from "express";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const response = {
      attendancePercentage: 81,
      feesDue: 35000,
      marks: [
        { subject: "Data Structures", total: 45, max: 50, grade: "A+" },
        { subject: "Computer Networks", total: 38, max: 50, grade: "B+" },
        { subject: "Database Management", total: 47, max: 50, grade: "A+" },
      ],
      behaviorLogs: [
        { date: "15 May 2026", rating: "Excellent", comment: "Active participation in tech seminar.", category: "Academic" },
        { date: "10 May 2026", rating: "Good", comment: "Submitted assignments on time.", category: "Conduct" },
      ]
    };
    
    // TODO: Implement actual Drizzle queries once seed data is available
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching parent dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
