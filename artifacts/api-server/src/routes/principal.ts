import { Router } from "express";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const response = {
      metrics: {
        totalStudents: "1,842",
        facultyMembers: "98",
        activeTimetables: "42",
        monthlyFees: "₹18.4L",
      },
      departmentPerformance: [
        { name: "Computer Science (CSE)", avgAttendance: 85, syllabusDone: 80, color: "#1565C0" },
        { name: "Electronics (ECE)", avgAttendance: 79, syllabusDone: 72, color: "#0EA5E9" },
        { name: "Mechanical (Mech)", avgAttendance: 84, syllabusDone: 68, color: "#7C3AED" },
        { name: "Electrical (EEE)", avgAttendance: 76, syllabusDone: 70, color: "#D97706" },
      ],
      pendingHodRequests: [
        { id: "1", sender: "Dr. Rajesh Kumar (HOD CSE)", type: "Special Budget Request", desc: "Purchase of 5 NVidia GPUs for AI Research Lab", amount: "₹4,50,000", priority: "High" },
        { id: "2", sender: "Dr. Priya (HOD ECE)", type: "Duty Leave Endorsement", desc: "Faculty training seminar sponsorship at IISc Bangalore", amount: "₹45,000", priority: "Normal" }
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching principal dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
