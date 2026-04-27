import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index.tsx";
import Register from "./pages/Register.tsx";
import NotFound from "./pages/NotFound.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ManageStudents from "./pages/admin/ManageStudents.tsx";
import ManageAchievements from "./pages/admin/ManageAchievements.tsx";
import Reports from "./pages/admin/Reports.tsx";
import MyStudents from "./pages/teacher/MyStudents.tsx";
import StudentMonitoring from "./pages/teacher/StudentMonitoring.tsx";
import MyAchievements from "./pages/student/MyAchievements.tsx";
import SubmitAchievement from "./pages/student/SubmitAchievement.tsx";
import Profile from "./pages/student/Profile.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/manage" element={<ManageAchievements />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/teacher/students" element={<MyStudents />} />
            <Route path="/teacher/student/:id" element={<StudentMonitoring />} />
            <Route path="/student/achievements" element={<MyAchievements />} />
            <Route path="/student/add" element={<SubmitAchievement />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
