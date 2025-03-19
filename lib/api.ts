import axios, { AxiosInstance } from "axios";

// Base URL of your backend server (adjust as needed)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/college-manager";

// Create an Axios instance
const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add an interceptor to include the auth token in requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication API
export const authApi = {
    login: (email: string, password: string) =>
        api.post("/authentication", { email, password }),

    register: (data: RegistrationRequestDTO) =>
        api.post("/registration/verify", data),

    validateEmail: (email: string) =>
        api.get(`/registration/email-validation/${email}`),
};

// Profile API
export const profileApi = {
    getProfile: (userId: string) =>
        api.get(`/profile/view/${userId}`),

    updateStudentProfile: (data: StudentProfileUpdateDTO) =>
        api.post("/profile/student/update", data),

    updateTeacherProfile: (data: TeacherProfileUpdateDTO) =>
        api.post("/profile/teacher/update", data),

    updatePrincipalProfile: (data: PrincipalProfileUpdateDTO) =>
        api.post("/profile/principal/update", data),
};

// College API
export const collegeApi = {
    getAllColleges: () =>
        api.get("/college/all"),

    registerCollege: (data: CollegeRegistrationDTO) =>
        api.post("/college/register", data),
};

// Department API
export const departmentApi = {
    getDepartmentsByCollege: (collegeId: string) =>
        api.get("/department", { params: { collegeId } }),

    addDepartment: (data: DepartmentDTO) =>
        api.post("/department/add", data),

    assignHod: (departmentId: string, hodUserId: string) =>
        api.post(`/department/${departmentId}/assign-hod`, null, { params: { hodUserId } }),

    getHods: () =>
        api.get("/department/hods"),
};

// Certificate API
export const certificateApi = {
    getCertificates: (userId: string) =>
        api.get("/certificates", { params: { userId } }),
};

// Attendance API
export const attendanceApi = {
    submitAttendance: (data: {
        date: string
        department: string
        semester: number
        academicYear: number
        studentAttendance: { studentId: number; present: boolean }[]
    }) => api.post(`/attendance/submit`, data),
    getAttendanceHistory: (params: { department: string; academicYear: number; semester: number }) =>
        api.get(`/attendance/history`, { params }),
};

// Fee API
export const feeApi = {
    recordPayment: (data: FeeDTO) =>
        api.post("/fees/pay", data),

    checkFeeStatus: (studentId: string) =>
        api.get(`/fees/status/${studentId}`),
};

// HOD API
export const hodApi = {
    addSubject: (data: SubjectDTO) =>
        api.post("/api/hod/add-subject", data),

    addTeacher: (data: RegistrationRequestDTO) =>
        api.post("/api/hod/add-teacher", data),
};

// Schedule (Exam) API
export const scheduleApi = {
    getExams: (department: string = "All", semester: string = "All") =>
        api.get("/schedule", { params: { department, semester } }),

    addExam: (data: Exam) =>
        api.post("/schedule", data),

    deleteExam: (id: string) =>
        api.delete(`/schedule/${id}`),
};

// Staff API
export const staffApi = {
    getAllStaff: (collegeId: string) => api.get(`/staff/all`, { params: { collegeId } }),
    getStudentsByDepartmentAndYear: (params: { department: string; academicYear: number }) =>
        api.get(`/staff/students`, { params }),
    getStaffByDepartment: (department: string) => api.get(`/staff/department`, { params: { department } }),
    addStaff: (data: {
        collegeId?: string
        department: string
        firstName: string
        lastName: string
        email: string
        role: string
    }) => api.post(`/staff/add`, data), // Hypothetical endpoint

    getStudents: (department: string, academicYear: number) =>
        api.get("/staff/students", { params: { department, academicYear } }),

    addGrades: (file: File, semester: number, department: string, academicYear: number) => {
        const formData = new FormData();
        formData.append("grades_data", file);
        formData.append("semester", semester.toString());
        formData.append("department", department);
        formData.append("academicYear", academicYear.toString());
        return api.post("/staff/add-grades", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export default api;

// TypeScript interfaces for DTOs (adjust based on your backend DTOs)
interface RegistrationRequestDTO {
    email: string;
    activationCode: string;
    password: string;
    [key: string]: any;
}

interface StudentProfileUpdateDTO {
    name?: string;
    phoneNumber?: string;
    [key: string]: any;
}

interface TeacherProfileUpdateDTO {
    name?: string;
    phoneNumber?: string;
    [key: string]: any;
}

interface PrincipalProfileUpdateDTO {
    name?: string;
    phoneNumber?: string;
    [key: string]: any;
}

interface CollegeRegistrationDTO {
    name: string;
    address: string;
    [key: string]: any;
}

interface DepartmentDTO {
    collegeId: number;
    code: string;
    name: string;
    description: string;
    totalYears: number;
    semestersPerYear: number;
}

interface AttendanceRequestDTO {
    studentIds: number[];
    date: string;
    status: string;
    [key: string]: any;
}

interface FeeDTO {
    studentId: number;
    amount: number;
    paymentDate: string;
}

interface SubjectDTO {
    code: string;
    name: string;
    semester: number;
    year: number;
    credits: number;
}

interface Exam {
    id?: number;
    department: string;
    semester: string;
    date: string;
    subjectCode: string;
    [key: string]: any;
}