import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Achievement, initialAchievements, students, Student, teachers, Teacher, Status } from "@/data/mockData";

export type Role = "admin" | "teacher" | "student";

interface AppUser {
  id: string;
  role: Role;
  name: string;
  email: string;
  studentId?: string;
  teacherId?: string;
}

interface AppContextValue {
  user: AppUser | null;
  login: (role: Role, email: string, password: string) => Promise<void>;
  logout: () => void;
  achievements: Achievement[];
  addAchievement: (a: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, a: Partial<Achievement>) => void;
  deleteAchievement: (id: string) => void;
  updateAchievementStatus: (id: string, status: Status) => void;
  addFeedback: (id: string, feedback: string) => void;
  students: Student[];
  teachers: Teacher[];
  assignTeacher: (studentId: string, teacherId: string) => void;
  registerUser: (role: Role, name: string, email: string, password: string, extraFields?: Record<string, string>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [studentsList, setStudentsList] = useState<Student[]>(students);
  const [teachersList, setTeachersList] = useState<Teacher[]>(teachers);

  const API_BASE = "http://localhost:8081/api";

  const fetchAll = useCallback(async () => {
    try {
      const [achRes, stdRes, tchRes] = await Promise.all([
        fetch(`${API_BASE}/achievements`),
        fetch(`${API_BASE}/users/students`),
        fetch(`${API_BASE}/users/teachers`)
      ]);
      if (achRes.ok) setAchievements(await achRes.json());
      if (stdRes.ok) setStudentsList(await stdRes.json());
      if (tchRes.ok) setTeachersList(await tchRes.json());
    } catch (e) {
      console.warn("Backend not reachable. Using local data.", e);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const login = useCallback(async (role: Role, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Login failed" }));
      throw new Error(err.error || "Login failed");
    }
    const u = await res.json();
    setUser({
      id: u.id,
      role: u.role as Role,
      name: u.name,
      email: u.email,
      teacherId: u.role === "teacher" ? u.id : undefined,
      studentId: u.role === "student" ? u.id : undefined,
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const registerUser = useCallback(async (role: Role, name: string, email: string, password: string, extraFields: Record<string, string> = {}) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, name, email, password, ...extraFields })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Registration failed" }));
      throw new Error(err.error || "Registration failed");
    }
    const u = await res.json();
    if (role === "student") {
      setStudentsList(prev => [...prev, u]);
      setUser({ id: u.id, role, name: u.name, email: u.email, studentId: u.id });
    } else if (role === "teacher") {
      setTeachersList(prev => [...prev, u]);
      setUser({ id: u.id, role, name: u.name, email: u.email, teacherId: u.id });
    } else {
      setUser({ id: u.id, role, name: u.name, email: u.email });
    }
  }, []);

  const addAchievement = useCallback(async (a: Omit<Achievement, "id">) => {
    try {
      const res = await fetch(`${API_BASE}/achievements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(a)
      });
      if (res.ok) {
        const newA = await res.json();
        setAchievements(prev => [newA, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateAchievement = useCallback((id: string, a: Partial<Achievement>) => {
    setAchievements((prev) => prev.map((x) => (x.id === id ? { ...x, ...a } : x)));
  }, []);

  const deleteAchievement = useCallback(async (id: string) => {
    await fetch(`${API_BASE}/achievements/${id}`, { method: "DELETE" });
    setAchievements((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const updateAchievementStatus = useCallback(async (id: string, status: Status) => {
    try {
      const res = await fetch(`${API_BASE}/achievements/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setAchievements((prev) => prev.map((x) => (x.id === id ? updated : x)));
      }
    } catch (e) { console.error(e); }
  }, []);

  const addFeedback = useCallback(async (id: string, feedback: string) => {
    try {
      const res = await fetch(`${API_BASE}/achievements/${id}/feedback`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback })
      });
      if (res.ok) {
        const updated = await res.json();
        setAchievements((prev) => prev.map((x) => (x.id === id ? updated : x)));
      }
    } catch (e) { console.error(e); }
  }, []);

  const assignTeacher = useCallback(async (studentId: string, teacherId: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/students/${studentId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId })
      });
      if (res.ok) {
        const updated = await res.json();
        setStudentsList((prev) => prev.map((s) => (s.id === studentId ? updated : s)));
      }
    } catch (e) { console.error(e); }
  }, []);

  return (
    <AppContext.Provider
      value={{
        user, login, logout, achievements, addAchievement, updateAchievement, deleteAchievement,
        updateAchievementStatus, addFeedback, students: studentsList, teachers: teachersList, assignTeacher, registerUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
