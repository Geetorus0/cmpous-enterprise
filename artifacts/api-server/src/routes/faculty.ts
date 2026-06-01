import { Router } from "express";

const router = Router();

router.get("/dashboard", async (req, res) => {
  try {
    const response = {
      activeStatus: "Present",
      todayClasses: [
        { time: "8:00 - 9:00", subject: "Data Structures", section: "CSE-A", room: "CSE-301", students: 62, attendanceDone: true, isCurrent: false },
        { time: "9:00 - 10:00", subject: "Computer Networks", section: "CSE-B", room: "CSE-302", students: 58, attendanceDone: false, isCurrent: true },
        { time: "11:15 - 12:15", subject: "Data Structures", section: "CSE-C", room: "CSE-401", students: 60, attendanceDone: false, isCurrent: false },
        { time: "2:30 - 3:30", subject: "DBMS", section: "CSE-B", room: "CSE-302", students: 58, attendanceDone: false, isCurrent: false },
      ]
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching faculty dashboard:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
