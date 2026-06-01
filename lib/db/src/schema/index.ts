import { pgTable, text, uuid, timestamp, integer, boolean, varchar } from "drizzle-orm/pg-core";

// 1. Users Table
export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull(), // 'student', 'parent', 'faculty', 'hod', 'admin', 'principal', 'super_admin'
  name: varchar("name", { length: 255 }).notNull(),
  avatar: text("avatar"),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Departments Table
export const departmentsTable = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique().notNull(), // 'CSE', 'ECE', 'MECH', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Courses Table
export const coursesTable = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),
  departmentId: uuid("department_id").references(() => departmentsTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique().notNull(), // 'BE-CSE', 'ME-VLSI'
  durationYears: integer("duration_years").default(4).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Semesters Table
export const semestersTable = pgTable("semesters", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => coursesTable.id),
  semesterNumber: integer("semester_number").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Sections Table
export const sectionsTable = pgTable("sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  semesterId: uuid("semester_id").references(() => semestersTable.id),
  name: varchar("name", { length: 10 }).notNull(), // 'A', 'B', 'C'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Students Table
export const studentsTable = pgTable("students", {
  id: uuid("id").references(() => usersTable.id).primaryKey(),
  registerNumber: varchar("register_number", { length: 100 }).unique().notNull(),
  departmentId: uuid("department_id").references(() => departmentsTable.id),
  courseId: uuid("course_id").references(() => coursesTable.id),
  semesterId: uuid("semester_id").references(() => semestersTable.id),
  sectionId: uuid("section_id").references(() => sectionsTable.id),
  batch: varchar("batch", { length: 50 }).notNull(), // '2022-2026'
  parentPhone: varchar("parent_phone", { length: 20 }),
  cgpa: varchar("cgpa", { length: 10 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Parents Table
export const parentsTable = pgTable("parents", {
  id: uuid("id").references(() => usersTable.id).primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Faculty Table
export const facultyTable = pgTable("faculty", {
  id: uuid("id").references(() => usersTable.id).primaryKey(),
  employeeId: varchar("employee_id", { length: 100 }).unique().notNull(),
  departmentId: uuid("department_id").references(() => departmentsTable.id),
  designation: varchar("designation", { length: 255 }).notNull(), // 'Assistant Professor'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 9. HODs Table
export const hodsTable = pgTable("hods", {
  id: uuid("id").references(() => usersTable.id).primaryKey(),
  employeeId: varchar("employee_id", { length: 100 }).unique().notNull(),
  departmentId: uuid("department_id").references(() => departmentsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 10. Admins Table
export const adminsTable = pgTable("admins", {
  id: uuid("id").references(() => usersTable.id).primaryKey(),
  employeeId: varchar("employee_id", { length: 100 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 11. Subjects Table
export const subjectsTable = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").references(() => coursesTable.id),
  semesterId: uuid("semester_id").references(() => semestersTable.id),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique().notNull(), // 'CS8501'
  credits: integer("credits").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 12. Timetable Table
export const timetableTable = pgTable("timetable", {
  id: uuid("id").defaultRandom().primaryKey(),
  departmentId: uuid("department_id").references(() => departmentsTable.id),
  semesterId: uuid("semester_id").references(() => semestersTable.id),
  sectionId: uuid("section_id").references(() => sectionsTable.id),
  dayOfWeek: integer("day_of_week").notNull(), // 1 for Monday, etc.
  startTime: varchar("start_time", { length: 20 }).notNull(), // '09:00'
  endTime: varchar("end_time", { length: 20 }).notNull(), // '10:00'
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  facultyId: uuid("faculty_id").references(() => facultyTable.id),
  classroom: varchar("classroom", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 13. Attendance Table
export const attendanceTable = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  timetableId: uuid("timetable_id").references(() => timetableTable.id),
  date: timestamp("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'Present', 'Absent', 'Late'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 14. Faculty Attendance Table
export const facultyAttendanceTable = pgTable("faculty_attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  facultyId: uuid("faculty_id").references(() => facultyTable.id),
  date: timestamp("date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'Present', 'Absent', 'Leave'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 15. Faculty Status Table
export const facultyStatusTable = pgTable("faculty_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  facultyId: uuid("faculty_id").references(() => facultyTable.id),
  status: varchar("status", { length: 50 }).notNull(), // 'Present', 'In class', 'Free', 'Hall duty', 'Meeting', 'Out of campus'
  currentLocation: varchar("current_location", { length: 255 }),
  classroom: varchar("classroom", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  inTime: timestamp("in_time"),
  outTime: timestamp("out_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 16. Hall Duty Table
export const hallDutyTable = pgTable("hall_duty", {
  id: uuid("id").defaultRandom().primaryKey(),
  facultyId: uuid("faculty_id").references(() => facultyTable.id),
  date: timestamp("date").notNull(),
  session: varchar("session", { length: 20 }).notNull(), // 'FN', 'AN'
  hallNumber: varchar("hall_number", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 17. Leave Requests Table
export const leaveRequestsTable = pgTable("leave_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Pending', 'Approved', 'Rejected'
  approvedBy: uuid("approved_by").references(() => usersTable.id),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 18. Internal Marks Table
export const internalMarksTable = pgTable("internal_marks", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  ca1: integer("ca1"), // Continuous Assessment 1
  ca2: integer("ca2"),
  ca3: integer("ca3"),
  maxMarks: integer("max_marks").default(100).notNull(),
  examDate: timestamp("exam_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 19. Assignments Table
export const assignmentsTable = pgTable("assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  facultyId: uuid("faculty_id").references(() => facultyTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 20. Assignment Submissions Table
export const assignmentSubmissionsTable = pgTable("assignment_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assignmentId: uuid("assignment_id").references(() => assignmentsTable.id),
  studentId: uuid("student_id").references(() => studentsTable.id),
  submissionDate: timestamp("submission_date").defaultNow().notNull(),
  fileUrl: text("file_url").notNull(),
  marks: integer("marks"),
  remarks: text("remarks"),
  status: varchar("status", { length: 20 }).default("Submitted").notNull(), // 'Submitted', 'Graded', 'Late'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 21. Study Materials Table
export const studyMaterialsTable = pgTable("study_materials", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  facultyId: uuid("faculty_id").references(() => facultyTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 22. Question Papers Table
export const questionPapersTable = pgTable("question_papers", {
  id: uuid("id").defaultRandom().primaryKey(),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  examType: varchar("exam_type", { length: 100 }).notNull(), // 'Semester End', 'CA1', 'CA2'
  year: integer("year").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 23. Fees Table
export const feesTable = pgTable("fees", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  title: varchar("title", { length: 255 }).notNull(), // 'Tuition Fee Sem 5'
  amount: integer("amount").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Paid', 'Pending'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 24. Payments Table
export const paymentsTable = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  feeId: uuid("fee_id").references(() => feesTable.id),
  amountPaid: integer("amount_paid").notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // 'UPI', 'Netbanking', 'Card'
  receiptUrl: text("receipt_url"),
  transactionId: varchar("transaction_id", { length: 100 }).unique().notNull(),
  status: varchar("status", { length: 20 }).default("Success").notNull(), // 'Success', 'Failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 25. Scholarships Table
export const scholarshipsTable = pgTable("scholarships", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  name: varchar("name", { length: 255 }).notNull(), // 'Merit Scholarship'
  amount: integer("amount").notNull(),
  status: varchar("status", { length: 20 }).default("Active").notNull(), // 'Active', 'Disbursed', 'Pending'
  approvalDate: timestamp("approval_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 26. Arrears Table
export const arrearsTable = pgTable("arrears", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  subjectId: uuid("subject_id").references(() => subjectsTable.id),
  semesterNumber: integer("semester_number").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Cleared', 'Pending'
  examDate: timestamp("exam_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 27. Complaints Table
export const complaintsTable = pgTable("complaints", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  type: varchar("type", { length: 100 }).notNull(), // 'Classroom Issue', 'Hostel Food', etc.
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Pending', 'In Progress', 'Resolved'
  resolutionComments: text("resolution_comments"),
  resolvedBy: uuid("resolved_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 28. Notifications Table
export const notificationsTable = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'attendance', 'exam', 'fee', 'general'
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 29. Events Table
export const eventsTable = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  time: varchar("time", { length: 50 }),
  venue: varchar("venue", { length: 255 }).notNull(),
  organizedBy: varchar("organized_by", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 30. Circulars Table
export const circularsTable = pgTable("circulars", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  fileUrl: text("file_url"),
  departmentId: uuid("department_id").references(() => departmentsTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 31. Placement Updates Table
export const placementUpdatesTable = pgTable("placement_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  eligibility: text("eligibility"),
  contactPerson: varchar("contact_person", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 32. Companies Table
export const companiesTable = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  details: text("details"),
  website: varchar("website", { length: 255 }),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 33. Bonafide Requests Table
export const bonafideRequestsTable = pgTable("bonafide_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Pending', 'Approved', 'Rejected'
  documentUrl: text("document_url"),
  approvedBy: uuid("approved_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 34. ID Card Requests Table
export const idCardRequestsTable = pgTable("id_card_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Pending', 'Approved', 'Rejected'
  photoUrl: text("photo_url"),
  approvedBy: uuid("approved_by").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 35. Hostel Requests Table
export const hostelRequestsTable = pgTable("hostel_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  roomType: varchar("room_type", { length: 50 }).notNull(), // 'AC', 'Non-AC', etc.
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Pending', 'Allocated', 'Rejected'
  roomNumber: varchar("room_number", { length: 20 }),
  allocatedDate: timestamp("allocated_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 36. Transport Requests Table
export const transportRequestsTable = pgTable("transport_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  routeNumber: varchar("route_number", { length: 50 }).notNull(),
  stopName: varchar("stop_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 20 }).default("Pending").notNull(), // 'Pending', 'Approved', 'Rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 37. Library Books Table
export const libraryBooksTable = pgTable("library_books", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  isbn: varchar("isbn", { length: 50 }).unique().notNull(),
  category: varchar("category", { length: 100 }),
  totalCopies: integer("total_copies").default(1).notNull(),
  availableCopies: integer("available_copies").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 38. Library Issues Table
export const libraryIssuesTable = pgTable("library_issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookId: uuid("book_id").references(() => libraryBooksTable.id),
  studentId: uuid("student_id").references(() => studentsTable.id),
  issueDate: timestamp("issue_date").defaultNow().notNull(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  status: varchar("status", { length: 20 }).default("Issued").notNull(), // 'Issued', 'Returned', 'Overdue'
  fineAmount: integer("fine_amount").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 39. Biometric Devices Table
export const biometricDevicesTable = pgTable("biometric_devices", {
  id: uuid("id").defaultRandom().primaryKey(),
  deviceName: varchar("device_name", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(), // 'Main Gate', 'Library'
  status: varchar("status", { length: 20 }).default("Active").notNull(), // 'Active', 'Offline'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 40. Biometric Logs Table
export const biometricLogsTable = pgTable("biometric_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  deviceId: uuid("device_id").references(() => biometricDevicesTable.id),
  logTime: timestamp("log_time").defaultNow().notNull(),
  type: varchar("type", { length: 20 }).notNull(), // 'check_in', 'check_out'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 41. AI Queries Table
export const aiQueriesTable = pgTable("ai_queries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  queryText: text("query_text").notNull(),
  responseText: text("response_text").notNull(),
  category: varchar("category", { length: 100 }), // 'academics', 'fees', 'attendance'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 42. Analytics Table
export const analyticsTable = pgTable("analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 100 }).notNull(), // 'department', 'college', 'faculty'
  metricName: varchar("metric_name", { length: 255 }).notNull(), // 'dropout_risk', 'fee_collection_rate'
  metricValue: varchar("metric_value", { length: 255 }).notNull(),
  reportDate: timestamp("report_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 43. Audit Logs Table
export const auditLogsTable = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id),
  action: varchar("action", { length: 100 }).notNull(), // 'CREATE', 'UPDATE', 'DELETE'
  tableName: varchar("table_name", { length: 100 }).notNull(),
  recordId: uuid("record_id"),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  ipAddress: varchar("ip_address", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 44. Chat Messages Table
export const chatMessagesTable = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id").references(() => usersTable.id),
  receiverId: uuid("receiver_id").references(() => usersTable.id),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 45. Support Tickets Table
export const supportTicketsTable = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("student_id").references(() => studentsTable.id),
  category: varchar("category", { length: 100 }).notNull(), // 'academic', 'hostel', 'transport'
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).default("Open").notNull(), // 'Open', 'Assigned', 'Resolved', 'Closed'
  priority: varchar("priority", { length: 20 }).default("Medium").notNull(), // 'Low', 'Medium', 'High'
  assignedTo: uuid("assigned_to").references(() => usersTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});