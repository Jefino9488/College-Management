import {useState, useEffect, JSX} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Departments from "./pages/Departments";
import { AuthenticationResponseDTO } from "./lib/api";
import CollegeManagement from "@/pages/CollegeManagement.tsx";

function App() {
    const [user, setUser] = useState<AuthenticationResponseDTO | null>(null);

    useEffect(() => {
        const storedAuth = localStorage.getItem("authResponse");
        if (storedAuth) {
            setUser(JSON.parse(storedAuth));
        }
    }, []);

    const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
        if (!user) return <Navigate to="/login" />;
        if (!allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
        return children;
    };

    return (
        <Router>
            <Navbar user={user} />
            <div className="min-h-screen bg-[--color-background]">
                <Routes>
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

                    {/* Student Routes */}
                    <Route
                        path="/dashboard"
                        element={<ProtectedRoute allowedRoles={["STUDENT", "STAFF", "HOD", "PRINCIPAL"]}><div>Dashboard (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/grades"
                        element={<ProtectedRoute allowedRoles={["STUDENT"]}><div>Grades (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/attendance"
                        element={<ProtectedRoute allowedRoles={["STUDENT", "STAFF", "HOD"]}><div>Attendance (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/certificates"
                        element={<ProtectedRoute allowedRoles={["STUDENT"]}><div>Certificates (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/fees"
                        element={<ProtectedRoute allowedRoles={["STUDENT"]}><div>Fees (TBD)</div></ProtectedRoute>}
                    />

                    {/* Staff Routes */}
                    <Route
                        path="/staff/students"
                        element={<ProtectedRoute allowedRoles={["STAFF", "HOD"]}><div>Students (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/staff/grades"
                        element={<ProtectedRoute allowedRoles={["STAFF"]}><div>Grades Management (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/schedule"
                        element={<ProtectedRoute allowedRoles={["STAFF", "HOD"]}><div>Schedule (TBD)</div></ProtectedRoute>}
                    />

                    {/* HOD Routes */}
                    <Route
                        path="/hod/teachers"
                        element={<ProtectedRoute allowedRoles={["HOD"]}><div>Teachers (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/hod/subjects"
                        element={<ProtectedRoute allowedRoles={["HOD"]}><div>Subjects (TBD)</div></ProtectedRoute>}
                    />

                    {/* Principal Routes */}
                    <Route
                        path="/departments"
                        element={<ProtectedRoute allowedRoles={["PRINCIPAL"]}><Departments /></ProtectedRoute>}
                    />
                    <Route
                        path="/staff"
                        element={<ProtectedRoute allowedRoles={["PRINCIPAL"]}><div>Staff (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/students"
                        element={<ProtectedRoute allowedRoles={["PRINCIPAL"]}><div>Students (TBD)</div></ProtectedRoute>}
                    />
                    <Route
                        path="/reports"
                        element={<ProtectedRoute allowedRoles={["PRINCIPAL"]}><div>Reports (TBD)</div></ProtectedRoute>}
                    />

                    {/* Common Route */}
                    <Route
                        path="/profile"
                        element={<ProtectedRoute allowedRoles={["STUDENT", "STAFF", "HOD", "PRINCIPAL"]}><div>Profile (TBD)</div></ProtectedRoute>}
                    />

                    <Route
                        path="/college-management"
                        element={<ProtectedRoute allowedRoles={["PRINCIPAL"]}><CollegeManagement user={user} /></ProtectedRoute>}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;