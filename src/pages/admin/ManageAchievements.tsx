import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, CheckCircle, XCircle, ListChecks } from "lucide-react";
import { Achievement, Status, allStatuses, statusColors } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

const ManageAchievements = () => {
  const { achievements, updateAchievementStatus, user } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("Pending");

  const filtered = useMemo(() => {
    return achievements
      .filter((a) => (statusFilter === "all" ? true : a.status === statusFilter))
      .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.studentName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [achievements, search, statusFilter]);

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  const handleStatus = (id: string, status: Status) => {
    updateAchievementStatus(id, status);
    toast({ title: "Updated", description: `Achievement marked as ${status}.` });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-secondary flex items-center justify-center shadow-glow">
            <ListChecks className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Review Achievements</h1>
            <p className="text-sm text-muted-foreground">Approve or reject student submissions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-card border-border/60"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Status | "all")}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-card border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {allStatuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 shadow-card overflow-hidden animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Achievement Title</th>
                  <th className="px-6 py-4 font-medium">Category / Type</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{a.studentName}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">{a.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{a.category}</div>
                      <div className="text-xs text-muted-foreground">{a.type}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(a.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full text-white", statusColors[a.status])}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {a.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200" onClick={() => handleStatus(a.id, "Approved")} title="Approve">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200" onClick={() => handleStatus(a.id, "Rejected")} title="Reject">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                      No achievements found.
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

export default ManageAchievements;
