import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/StatCard";
import { Trophy, Users, Award, Star } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Achievement } from "@/data/mockData";

const Dashboard = () => {
  const { user, achievements, students, teachers } = useApp();

  const scoped = useMemo<Achievement[]>(() => {
    if (user?.role === "student") return achievements.filter((a) => a.studentId === user.studentId);
    if (user?.role === "teacher") {
      const myStudentIds = students.filter(s => s.teacherId === user.teacherId).map(s => s.id);
      return achievements.filter(a => myStudentIds.includes(a.studentId));
    }
    return achievements; // admin
  }, [achievements, user, students]);

  const adminStats = [
    { label: "Total Students", value: students.length, icon: Users, gradient: "gradient-secondary", delay: 0 },
    { label: "Pending Approvals", value: achievements.filter(a => a.status === "Pending").length, icon: Star, gradient: "gradient-warning", delay: 80 },
    { label: "Teachers", value: teachers.length, icon: Trophy, gradient: "gradient-primary", delay: 160 },
    { label: "Total Achievements", value: achievements.length, icon: Award, gradient: "gradient-accent", delay: 240 },
  ];

  const teacherStats = [
    { label: "My Students", value: students.filter(s => s.teacherId === user?.teacherId).length, icon: Users, gradient: "gradient-secondary", delay: 0 },
    { label: "Pending Reviews", value: scoped.filter(a => a.status === "Pending").length, icon: Star, gradient: "gradient-warning", delay: 80 },
    { label: "Student Achievements", value: scoped.length, icon: Trophy, gradient: "gradient-primary", delay: 160 },
  ];

  const total = scoped.length;
  const participation = scoped.filter((a) => a.type === "Participation").length;
  const awards = scoped.filter((a) => a.type === "Award").length;
  const recognition = scoped.filter((a) => a.type === "Recognition").length;

  const studentStats = [
    { label: "Total Achievements", value: total, icon: Trophy, gradient: "gradient-primary", delay: 0 },
    { label: "Participation", value: participation, icon: Users, gradient: "gradient-secondary", delay: 80 },
    { label: "Awards Won", value: awards, icon: Award, gradient: "gradient-warning", delay: 160 },
    { label: "Recognition", value: recognition, icon: Star, gradient: "gradient-accent", delay: 240 },
  ];

  const activeStats = user?.role === "admin" ? adminStats : user?.role === "teacher" ? teacherStats : studentStats;

  const barData = ["Sports", "Cultural", "Technical"].map((cat) => ({
    category: cat,
    count: scoped.filter((a) => a.category === cat).length,
  }));

  const pieData = [
    { name: "Participation", value: participation, color: "hsl(200 90% 55%)" },
    { name: "Awards", value: awards, color: "hsl(38 95% 55%)" },
    { name: "Recognition", value: recognition, color: "hsl(290 80% 60%)" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 text-white shadow-lg animate-fade-in-up">
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <div className="text-sm font-medium opacity-90 mb-2">Welcome back 👋</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{user?.name}</h1>
            <p className="mt-2 text-white/80 max-w-xl">
              {user?.role === "admin"
                ? "Track every student's journey beyond academics. Manage achievements and unlock insights."
                : "Your accomplishments at a glance — every milestone matters."}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {activeStats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} icon={s.icon} gradient={s.gradient} delay={s.delay} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-card border border-border/60 shadow-card p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-semibold text-lg">Achievements by Category</h3>
                <p className="text-sm text-muted-foreground">Distribution across activity categories</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(250 84% 60%)" />
                    <stop offset="100%" stopColor="hsl(280 85% 65%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 92%)" />
                <XAxis dataKey="category" stroke="hsl(230 15% 45%)" />
                <YAxis stroke="hsl(230 15% 45%)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(220 20% 90%)", borderRadius: 12, boxShadow: "0 8px 24px -8px hsla(250 50% 40% / 0.15)" }} />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h3 className="font-display font-semibold text-lg mb-1">Type Breakdown</h3>
            <p className="text-sm text-muted-foreground mb-4">Participation vs Awards vs Recognition</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {pieData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(220 20% 90%)", borderRadius: 12 }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent achievements list */}
        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6 animate-fade-in-up">
          <h3 className="font-display font-semibold text-lg mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {scoped.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/60 transition-colors">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.studentName} · {a.category}</div>
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {(() => {
                    const d = a.date || a.submittedAt;
                    if (!d) return "—";
                    const parsed = new Date(d);
                    return isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  })()}
                </div>
              </div>
            ))}
            {scoped.length === 0 && <p className="text-center text-muted-foreground py-6">No achievements yet.</p>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
