// src/lib/api.ts
import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080/college-manager",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
    const authResponse = localStorage.getItem("authResponse");
    if (authResponse) {
        const { jwtToken } = JSON.parse(authResponse);
        config.headers.Authorization = `Bearer ${jwtToken}`;
    }
    return config;
});

export const registerEmailValidation = (email: string) =>
    api.get(`/registration/email-validation/${email}`);

export const registerUser = (data: RegistrationRequestDTO) =>
    api.post("/registration/verify", data);

export const loginUser = (data: AuthenticationRequestDTO) =>
    api.post("/authentication", data);

// New endpoints for departments
export const fetchDepartments = (collegeId: number) =>
    api.get(`/department?collegeId=${collegeId}`); // Assuming GET /department accepts collegeId query param
export const createDepartment = (data: DepartmentDTO) =>
    api.post("/department/add", data);

// DTO Interfaces
export interface RegistrationRequestDTO {
    firstName: string;
    lastName: string;
    gender: string;
    mobileNumber: string;
    email: string;
    password: string;
    role: string;
    department: string;
    activationCode: string;
    academicYear: string;
}

export interface AuthenticationRequestDTO {
    email: string;
    password: string;
}

export interface AuthenticationResponseDTO {
    userId: number;
    firstName: string;
    lastName: string;
    gender: string;
    age: number | null;
    mobileNumber: string;
    email: string;
    department: string | null;
    role: string;
    jwtToken: string;
}

export interface DepartmentDTO {
    code: string;
    name: string;
    description: string;
    totalYears: number;
    semestersPerYear: number;
    collegeId: number;
}

export interface Department {
    id: number;
    code: string;
    name: string;
    description: string;
    totalYears: number;
    semestersPerYear: number;
    college: { id: number; name: string };
    hod: { id: number; firstName: string; lastName: string } | null;
}

export default api;