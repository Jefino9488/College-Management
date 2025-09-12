// src/lib/api.ts

import axios from "axios";

// Base URL for the backend API. All endpoints are relative to this.
const API_BASE_URL = "http://localhost:8080";

export class ApiService {
    /**
     * Generic request method to handle all API calls.
     * Automatically adds the JWT token for authentication.
     * @param endpoint The API endpoint path.
     * @param method The HTTP method (GET, POST, etc.).
     * @param data The request body data (for POST, PUT, etc.).
     */
    static async request(endpoint: string, method = "GET", data: any = null) {
        const token = localStorage.getItem("auth_token");
        const headers: { [key: string]: string } = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            data = JSON.stringify(data);
        }

        const config = {
            method,
            url: `${API_BASE_URL}${endpoint}`,
            data,
            headers,
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error: any) {
            // The backend's ExceptionController returns a message in the body
            throw new Error(error.response?.data?.message || "Something went wrong.");
        }
    }

    // --- User & Profile Management ---
    static async getProfileStatus() {
        return this.request("/college-manager/profile/status");
    }

    static async getProfile(userId: string) {
        return this.request(`/college-manager/profile/view/${userId}`);
    }

    static async updateStudentProfile(data: any) {
        return this.request("/college-manager/profile/student/update", "POST", data);
    }

    static async updateTeacherProfile(data: any) {
        return this.request("/college-manager/profile/teacher/update", "POST", data);
    }

    static async updatePrincipalProfile(data: any) {
        return this.request("/college-manager/profile/principal/update", "POST", data);
    }

    // --- College & Department Management ---
    static async registerCollege(data: any) {
        return this.request("/college-manager/college/register", "POST", data);
    }

    static async getAllColleges() {
        return this.request("/college-manager/college/all");
    }

    static async getDepartmentsByCollege(collegeId: number) {
        return this.request(`/college-manager/department/by-college/${collegeId}`);
    }

    static async getDepartments(collegeId: string) {
        return this.request(`/college-manager/department?collegeId=${collegeId}`);
    }

    static async addDepartment(data: any) {
        return this.request("/college-manager/department/add", "POST", data);
    }

    static async assignHOD(departmentId: string, hodUserId: string) {
        return this.request(`/college-manager/department/${departmentId}/assign-hod?hodUserId=${hodUserId}`, "POST");
    }

    static async getAllHODs() {
        return this.request("/college-manager/department/hods");
    }

    // --- Staff & Student Management ---
    static async getAllStaff(collegeId: string) {
        return this.request(`/college-manager/staff/all?collegeId=${collegeId}`);
    }

    static async getDepartmentStaff(department: string) {
        return this.request(`/college-manager/staff/department?department=${department}`);
    }

    static async getStudents(department: string, academicYear: string) {
        return this.request(`/college-manager/staff/students?department=${department}&academicYear=${academicYear}`);
    }

    // --- Attendance ---
    static async getAttendanceHistory(department: string, academicYear: string, semester: string) {
        return this.request(
            `/college-manager/attendance/history?department=${department}&academicYear=${academicYear}&semester=${semester}`
        );
    }

    static async submitAttendance(data: any) {
        return this.request("/college-manager/attendance/submit", "POST", data);
    }

    // --- Schedule ---
    static async getSchedule(department: string, semester: string) {
        return this.request(`/college-manager/schedule?department=${department}&semester=${semester}`);
    }

    static async addSchedule(data: any) {
        return this.request("/college-manager/schedule", "POST", data);
    }

    static async deleteSchedule(id: string) {
        return this.request(`/college-manager/schedule/${id}`, "DELETE");
    }

    // --- Grades & Fees ---
    static async addGrades(file: File, semester: number, department: string, academicYear: number) {
        const formData = new FormData();
        formData.append("grades_data", file);
        formData.append("semester", semester.toString());
        formData.append("department", department);
        formData.append("academicYear", academicYear.toString());
        return this.request("/college-manager/staff/add-grades", "POST", formData);
    }

    static async getStudentGrades(studentId: string) {
        // This endpoint does not exist in the backend.
        // You may need to create it or adjust your frontend logic.
        return this.request(`/college-manager/student/grades?studentId=${studentId}`);
    }

    static async getFeeStatus(studentId: string) {
        // Corrected endpoint from /fees/status to /college-manager/fees/status
        return this.request(`/college-manager/fees/status/${studentId}`);
    }

    static async payFees(data: any) {
        return this.request("/college-manager/fees/pay", "POST", data);
    }

    // --- HOD Specific APIs ---
    static async addSubject(data: any) {
        return this.request("/college-manager/hod/add-subject", "POST", data);
    }

    static async addTeacher(data: any) {
        return this.request("/college-manager/hod/add-teacher", "POST", data);
    }

    // --- Student Specific APIs ---
    static async getCertificates(userId: string) {
        return this.request(`/college-manager/certificates?userId=${userId}`);
    }

    // --- Dashboard Stats APIs ---
    static async getPrincipalStats() {
        // This endpoint doesn't exist in the backend. You may need to implement it.
        return this.request("/college-manager/dashboard/principal-stats");
    }

    static async getHODStats() {
        // This endpoint doesn't exist in the backend. You may need to implement it.
        return this.request("/college-manager/dashboard/hod-stats");
    }

    static async getStaffStats() {
        // This endpoint doesn't exist in the backend. You may need to implement it.
        return this.request("/college-manager/dashboard/staff-stats");
    }

    static async getStudentStats() {
        // This endpoint doesn't exist in the backend. You may need to implement it.
        return this.request("/college-manager/dashboard/student-stats");
    }
}