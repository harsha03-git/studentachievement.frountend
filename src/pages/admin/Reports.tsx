import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Trophy, Users, Award, Star, BarChart3 } from "lucide-react";
import { Navigate } from "react-router-dom";

const Reports = () => {
  const { achievements, students, user } = useApp();
  const approved = useMemo(() => achievements.filter((a) => a.status === "Approved"), [achievements]);

  const byCat = ["Sports", "Cultural", "Technical"].map((c) => ({
    category: c,
    Award: approved.filter((a) => a.category === c && a.type === "Award").length,
    Participation: approved.filter((a) => a.category === c && a.type === "Participation").length,
    Recognition: approved.filter((a) => a.category === c && a.type === "Recognition").length,
  }));

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {};
    approved.forEach((a) => {
      const m = new Date(a.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      map[m] = (map[m] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count })).reverse();
  }, [approved]);

  const topStudents = useMemo(() => {
    return students.map((s) => ({
      name: s.name.split(" ")[0],
      total: approved.filter((a) => a.studentId === s.id).length,
    })).sort((a, b) => b.total - a.total);
  }, [students, approved]);

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const total = approved.length;
  const awards = approved.filter((a) => a.type === "Award").length;
  const participation = approved.filter((a) => a.type === "Participation").length;
  const recognition = approved.filter((a) => a.type === "Recognition").length;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-accent flex items-center justify-center shadow-md">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">Insights across the entire student body</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="Total Records" value={total} icon={Trophy} gradient="gradient-primary" />
          <StatCard label="Active Students" value={students.length} icon={Users} gradient="gradient-secondary" delay={80} />
          <StatCard label="Awards" value={awards} icon={Award} gradient="gradient-warning" delay={160} />
          <StatCard label="Recognitions" value={recognition} icon={Star} gradient="gradient-accent" delay={240} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display font-semibold text-lg mb-1">Category × Type Breakdown</h3>
            <p className="text-sm text-muted-foreground mb-4">Stacked breakdown across categories</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byCat}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 92%)" />
                <XAxis dataKey="category" stroke="hsl(230 15% 45%)" />
                <YAxis stroke="hsl(230 15% 45%)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(220 20% 90%)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="Award" stackId="a" fill="hsl(38 95% 55%)" radius={[0,0,0,0]} />
                <Bar dataKey="Participation" stackId="a" fill="hsl(200 90% 55%)" />
                <Bar dataKey="Recognition" stackId="a" fill="hsl(290 80% 60%)" radius={[10,10,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display font-semibold text-lg mb-1">Activity Over Time</h3>
            <p className="text-sm text-muted-foreground mb-4">Achievements recorded per month</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={byMonth}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(250 84% 60%)" />
                    <stop offset="100%" stopColor="hsl(330 85% 65%)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 92%)" />
                <XAxis dataKey="month" stroke="hsl(230 15% 45%)" />
                <YAxis stroke="hsl(230 15% 45%)" allowDecimals={false} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(220 20% 90%)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="count" stroke="url(#lineGrad)" strokeWidth={3} dot={{ r: 5, fill: "hsl(250 84% 60%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display font-semibold text-lg mb-1">Top Performers</h3>
            <p className="text-sm text-muted-foreground mb-4">Achievement count by student</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topStudents} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 92%)" />
                <XAxis type="number" stroke="hsl(230 15% 45%)" allowDecimals={false} />
                <YAxis type="category" dataKey="name" stroke="hsl(230 15% 45%)" width={80} />
                <Tooltip contentStyle={{ background: "white", border: "1px solid hsl(220 20% 90%)", borderRadius: 12 }} />
                <Bar dataKey="total" fill="hsl(250 84% 60%)" radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-card border border-border/60 shadow-card p-6">
            <h3 className="font-display font-semibold text-lg mb-1">Type Distribution</h3>
            <p className="text-sm text-muted-foreground mb-4">Overall split</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={[
                  { name: "Award", value: awards, color: "hsl(38 95% 55%)" },
                  { name: "Participation", value: participation, color: "hsl(200 90% 55%)" },
                  { name: "Recognition", value: recognition, color: "hsl(290 80% 60%)" },
                ]} dataKey="value" nameKey="name" outerRadius={100} label>
                  {[
                    "hsl(38 95% 55%)", "hsl(200 90% 55%)", "hsl(290 80% 60%)",
                  ].map((c, i) => <Cell key={i} fill={c} />)}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reports;
