import { Router } from "express";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const response = {
      stats: {
        totalStudents: 245,
        totalFaculty: 14,
        avgAttendance: 82,
        pendingApprovals: 7,
        arrearStudents: 12,
        sections: 5,
      },
      facultySummary: [
        { name: "Dr. Priya Sharma", attendance: 94, status: "In Campus", classes: 3 },
        { name: "Mr. S. Rajan", attendance: 89, status: "In Campus", classes: 2 },
        { name: "Dr. A. Kumar", attendance: 76, status: "On Leave", classes: 0 },
        { name: "Ms. T. Nair", attendance: 91, status: "In Campus", classes: 1 },
        { name: "Dr. M. Venkat", attendance: 87, status: "In Campus", classes: 2 },
      ],
      alerts: [
        { type: "warning", message: "12 students below 75% attendance", icon: "alert-triangle" },
        { type: "info", message: "7 leave/OD requests pending approval", icon: "clock" },
        { type: "error", message: "3 faculty missed attendance submission", icon: "alert-circle" },
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching HOD dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
