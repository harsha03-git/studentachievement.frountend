import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AchievementCard } from "@/components/AchievementCard";
import { EmptyState } from "@/components/EmptyState";
import { Trophy, Search } from "lucide-react";
import { Navigate } from "react-router-dom";

const MyAchievements = () => {
  const { achievements, user } = useApp();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [type, setType] = useState("all");

  const list = useMemo(() => {
    return achievements
      .filter((a) => a.studentId === user?.studentId)
      .filter((a) => (cat === "all" || a.category === cat) && (type === "all" || a.type === type))
      .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [achievements, user, cat, type, search]);

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "student") return <Navigate to="/dashboard" replace />;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-warning flex items-center justify-center shadow-md">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">My Achievements</h1>
            <p className="text-sm text-muted-foreground">{list.length} total accomplishments</p>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 shadow-card p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Cultural">Cultural</SelectItem>
              <SelectItem value="Technical">Technical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Participation">Participation</SelectItem>
              <SelectItem value="Award">Award</SelectItem>
              <SelectItem value="Recognition">Recognition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {list.length === 0 ? (
          <EmptyState title="No achievements found" description="Try clearing filters, or check back when your admin records new ones." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {list.map((a, i) => <AchievementCard key={a.id} achievement={a} delay={i * 60} />)}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyAchievements;
