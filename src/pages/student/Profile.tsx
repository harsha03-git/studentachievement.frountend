import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Mail, GraduationCap, Calendar, Trophy, Award, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AchievementCard } from "@/components/AchievementCard";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { achievements, students, user } = useApp();
  const my = useMemo(() => achievements.filter((a) => a.studentId === user?.studentId), [achievements, user]);

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "student") return <Navigate to="/dashboard" replace />;

  const student = students.find((s) => s.id === user.studentId)!;

  const total = my.length;
  const awards = my.filter((a) => a.type === "Award").length;
  const participation = my.filter((a) => a.type === "Participation").length;
  const recognition = my.filter((a) => a.type === "Recognition").length;
  const highlights = my.filter((a) => a.type === "Award").slice(0, 3);

  const initials = student.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  const stats = [
    { label: "Total", value: total, icon: Trophy, grad: "gradient-primary" },
    { label: "Awards", value: awards, icon: Award, grad: "gradient-warning" },
    { label: "Participation", value: participation, icon: Users, grad: "gradient-secondary" },
    { label: "Recognition", value: recognition, icon: Star, grad: "gradient-accent" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Profile hero */}
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-6 md:p-10 text-white shadow-lg">
          <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-28 w-28 md:h-32 md:w-32 ring-4 ring-white/30 shadow-glow">
              <AvatarFallback className="bg-white/20 backdrop-blur text-white text-3xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left flex-1">
              <h1 className="font-display text-3xl md:text-4xl font-bold">{student.name}</h1>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-white/90 text-sm">
                <span className="inline-flex items-center gap-1.5"><Mail className="h-4 w-4" />{student.email}</span>
                <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-4 w-4" />{student.course}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{student.year}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => (
            <div key={s.label} className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-card hover-lift border border-border/60 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-20 blur-2xl ${s.grad}`} />
              <div className="relative flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl ${s.grad} flex items-center justify-center shadow-md`}>
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-warning" /> Highlight Achievements
          </h2>
          {highlights.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border/60 shadow-card p-8 text-center text-muted-foreground">
              No award-winning achievements yet — keep going! 🌟
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {highlights.map((a, i) => <AchievementCard key={a.id} achievement={a} delay={i * 80} />)}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
