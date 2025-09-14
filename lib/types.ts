/**
 * This file contains TypeScript types and interfaces that correspond to the
 * DTOs (Data Transfer Objects) and Entities from the Spring Boot backend.
 * Keeping these in sync with the backend is crucial for type safety.
 */

// --- Auth & User Types ---

export type UserRole = 'principal' | 'hod' | 'staff' | 'student';

/**
 * Represents the core user object returned upon successful authentication.
 * [cite_start]Mirrors `UserDTO.java` [cite: 1605, 1606] [cite_start]and `AuthenticationResponseDTO.java`[cite: 1897].
 */
export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    collegeId?: number;
    departmentId?: number;
}

/**
 * Represents the entire authentication response from the backend.
 * [cite_start]Mirrors `AuthenticationResponseDTO.java`[cite: 1571].
 */
export interface AuthResponse {
    token: string;
    user: User;
}

/**
 * Represents the user's status, checked after login to guide navigation (e.g., onboarding).
 * [cite_start]Mirrors `UserProfileStatusDTO.java`[cite: 1607, 1608].
 */
export interface UserProfileStatus {
    id: number;
    role: string; // e.g., 'PRINCIPAL'
    email: string;
    collegeId?: number;
}


// --- College & Department Types ---

/**
 * Represents a college entity.
 * [cite_start]Mirrors `College.java` [cite: 1636] [cite_start]and is used in `CollegeController.java`[cite: 1478, 1479].
 */
export interface College {
    id: number;
    code: string;
    name: string;
    address: string;
    contactEmail: string;
    phoneNumber: string;
    departmentCount?: number; // Often calculated for overviews
}

/**
 * Represents a department entity.
 * [cite_start]Mirrors `Department.java` [cite: 1640] [cite_start]and `DepartmentDTO.java`[cite: 1575].
 */
export interface Department {
    id: number;
    code: string;
    name: string;
    description: string;
    totalYears: number;
    semestersPerYear: number;
    collegeId: number;
    hodName?: string;
    hasHOD?: boolean; // Useful for UI logic
    studentCount: number;
    staffCount: number;
}


// --- Staff & HOD Types ---

/**
 * Represents a staff member, used in management views.
 * [cite_start]Mirrors fields from `UserAccount.java` for staff/HOD roles[cite: 1665].
 */
export interface StaffMember {
    id: number;
    firstName: string;
    lastName: string;
    personalEmail: string;
    mobileNumber?: string;
    role: 'STAFF' | 'HOD';
    department?: {
        name: string;
    };
}

/**
 * Represents detailed information about a subject, for HOD management.
 * [cite_start]Mirrors `SubjectDetailsDTO.java`[cite: 1598, 1599].
 */
export interface Subject {
    id: number;
    name: string;
    code: string;
    credits: number;
    assignedTeacher: string;
    enrolledStudents: number;
}


// --- Student Types ---

/**
 * Represents a student, used in student management lists.
 * [cite_start]Mirrors `StudentDTO.java`[cite: 1591, 1592, 1593].
 */
export interface Student {
    id: number;
    name: string;
    rollNumber: string;
    email: string;
    department: string;
    academicYear: string;
    semester: string;
    gpa: number;
    attendance: number;
    status: "active" | "inactive";
}

/**
 * Represents a student's grade in a specific subject.
 * [cite_start]Mirrors `GradeDetailsDTO.java`[cite: 1580, 1581].
 */
export interface Grade {
    subjectName: string;
    subjectCode: string;
    credits: number;
    grade: string;
    semester: number;
}

/**
 * Represents a student's academic or extracurricular certificate.
 * [cite_start]Mirrors `Certificate.java`[cite: 1632, 1633, 1634, 1635].
 */
export interface Certificate {
    id: number;
    userId: number;
    title: string;
    type: "degree" | "course" | "achievement" | "participation";
    issueDate: string; // ISO date string e.g., "2024-05-15"
    validUntil?: string;
    status: "active" | "expired" | "pending";
    description: string;
    issuer: string;
    downloadUrl?: string;
}

/**
 * Represents a fee payment record for a student.
 * [cite_start]Inferred from `FeeManagement.tsx` [cite: 1066, 1067] [cite_start]and `Fee.java`[cite: 1652, 1653, 1654].
 */
export interface FeeRecord {
    id: string;
    semester: string;
    academicYear: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    dueDate: string; // ISO date string
    status: "paid" | "partial" | "overdue" | "pending";
    paymentHistory: PaymentHistory[];
}

export interface PaymentHistory {
    id: string;
    amount: number;
    date: string; // ISO date string
    method: string;
    transactionId: string;
}


// --- Scheduling & Attendance Types ---

/**
 * Represents a scheduled event like an exam or assignment.
 * [cite_start]Mirrors `Exam.java` [cite: 1644, 1645, 1646, 1647, 1648, 1649, 1650, 1651] [cite_start]and used in `ScheduleView.tsx`[cite: 1125, 1126].
 */
export interface ScheduleItem {
    id: string;
    subject: string;
    date: string; // ISO date string
    time: string; // e.g., "09:00"
    duration: string;
    room: string;
    type: "midterm" | "final" | "quiz" | "assignment" | "lecture" | "lab";
    department: string;
    semester: string;
    instructor?: string;
}

/**
 * Represents a single student's attendance status for submission.
 * [cite_start]Mirrors `StudentAttendanceDTO.java`[cite: 1590].
 */
export interface StudentAttendance {
    userId: number;
    present: boolean;
}

/**
 * Represents the payload for submitting attendance for a class.
 * [cite_start]Mirrors `AttendanceRequestDTO.java`[cite: 1568, 1569].
 */
export interface AttendanceSubmission {
    date: string; // "yyyy-MM-dd"
    department: string;
    semester: number;
    academicYear: number;
    students: StudentAttendance[];
}


// --- Dashboard Stats Types ---

/**
 * Represents a single recent activity item for dashboard feeds.
 * NEW: Corresponds to the new RecentActivityDTO.java.
 */
export interface RecentActivity {
    id: string;
    type: string;
    message: string;
    timestamp: string; // ISO date-time string
}

/**
 * [cite_start]Mirrors `PrincipalDashboardStatsDTO.java`[cite: 1610, 1611].
 */
export interface PrincipalDashboardStats {
    totalColleges: number;
    totalDepartments: number;
    totalStaff: number;
    totalStudents: number;
    totalHODs: number;
}

/**
 * [cite_start]Mirrors `HodDashboardStatsDTO.java`[cite: 1609].
 */
export interface HodDashboardStats {
    totalStudents: number;
    totalStaff: number;
    totalSubjects: number;
    averageAttendance: number;
    averageGPA: number;
    recentActivities?: RecentActivity[];
    studentsAtRisk?: number;
    highPerformers?: number;
    staffSatisfaction?: number;
    courseCompletion?: number;
}
/**
 * [cite_start]Mirrors `StaffDashboardStatsDTO.java`[cite: 1612].
 */
export interface StaffDashboardStats {
    totalStudents: number;
    averageAttendance: number;
    upcomingExams: number;
    pendingGrades: number;
    classesToday: number;
}

/**
 * [cite_start]Mirrors `StudentDashboardStatsDTO.java`[cite: 1613, 1614].
 */
export interface StudentDashboardStats {
    currentGPA: number;
    overallAttendance: number;
    upcomingExams: number;
    pendingFees: number;
    completedCredits: number;
}