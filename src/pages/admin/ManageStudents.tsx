import { Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageStudents = () => {
  const { user, students, teachers, assignTeacher } = useApp();

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-secondary flex items-center justify-center shadow-glow">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Manage Students</h1>
            <p className="text-sm text-muted-foreground">Assign teachers to mentor students</p>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Course & Year</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium text-right">Assigned Teacher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{student.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.course} ({student.year})</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.email}</td>
                    <td className="px-6 py-4 text-right">
                      <Select
                        value={student.teacherId || "unassigned"}
                        onValueChange={(val) => assignTeacher(student.id, val === "unassigned" ? "" : val)}
                      >
                        <SelectTrigger className="w-[180px] ml-auto h-9">
                          <SelectValue placeholder="Assign Teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned" className="text-muted-foreground italic">Unassigned</SelectItem>
                          {teachers.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ManageStudents;
