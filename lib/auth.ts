export interface User {
    id: string
    name: string
    email: string
    role: "principal" | "hod" | "staff" | "student"
    collegeId?: string
    departmentId?: string
}

export interface AuthResponse {
    token: string
    user: User
}

const API_BASE_URL = "http://localhost:8080"

export class AuthService {
    private static token: string | null = null

    static setToken(authResponse: AuthResponse) {
        this.token = authResponse.token
        localStorage.setItem("auth_token", authResponse.token)
        localStorage.setItem("user_id", authResponse.user.id)
        localStorage.setItem("user_role", authResponse.user.role)
    }

    static getToken(): string | null {
        if (this.token) return this.token
        if (typeof window !== "undefined") {
            this.token = localStorage.getItem("auth_token")
        }
        return this.token
    }

    static getUserId(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem("user_id");
        }
        return null;
    }

    static getUserRole(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem("user_role");
        }
        return null;
    }

    static clearToken() {
        this.token = null
        if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user_id")
            localStorage.removeItem("user_role")
        }
    }

    static async validateEmail(email: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/college-manager/registration/email-validation/${email}`)
            return response.ok
        } catch (error) {
            console.error("Email validation error:", error)
            return false
        }
    }

    static async verifyAndRegister(data: {
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
        collegeId: number | null;
    }): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/college-manager/registration/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({ message: "Registration failed" }));
            throw new Error(errorBody.message || "Registration failed");
        }

        const authResponse = await response.json();
        this.setToken(authResponse);
        return authResponse;
    }

    static async login(email: string, password: string): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/college-manager/authentication`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            throw new Error("Login failed")
        }

        const authResponse = await response.json()
        this.setToken(authResponse);
        return authResponse
    }

    static async logout() {
        this.clearToken()
    }

    static getAuthHeaders() {
        const token = this.getToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
    }
}