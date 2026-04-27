import { Navigate, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Users, ChevronRight, Mail, GraduationCap, Calendar } from "lucide-react";

const MyStudents = () => {
  const { user, students } = useApp();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "teacher") return <Navigate to="/dashboard" replace />;

  const myStudents = students.filter((s) => s.teacherId === user.teacherId);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-secondary flex items-center justify-center shadow-glow">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">My Students</h1>
            <p className="text-sm text-muted-foreground">Monitor and guide your assigned students</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up">
          {myStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => navigate(`/teacher/student/${student.id}`)}
              className="group rounded-2xl bg-card border border-border/60 shadow-card p-6 cursor-pointer hover:border-primary/40 hover:shadow-glow transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold uppercase shadow-md">
                  {student.name.charAt(0)}
                </div>
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
              <h3 className="font-display font-bold text-lg">{student.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {student.email}
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" /> {student.course}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {student.year}
                </div>
              </div>
            </div>
          ))}
          {myStudents.length === 0 && (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-border/60 p-12 text-center">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
              <h3 className="font-medium text-lg">No Students Assigned</h3>
              <p className="text-muted-foreground text-sm mt-1">You currently have no students assigned to mentor.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default MyStudents;
