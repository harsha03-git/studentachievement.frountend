import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Category, AchievementType } from "@/data/mockData";
import { Plus, Sparkles } from "lucide-react";

const schema = z.object({
  title: z.string().trim().min(2, "Title required").max(120),
  category: z.enum(["Sports", "Cultural", "Technical"]),
  type: z.enum(["Participation", "Award", "Recognition"]),
  date: z.string().min(1, "Date required"),
  description: z.string().trim().min(5, "Description too short").max(500),
});

const SubmitAchievement = () => {
  const { students, addAchievement, user } = useApp();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", category: "Sports" as Category, type: "Award" as AchievementType,
    date: new Date().toISOString().slice(0, 10), description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "student") return <Navigate to="/dashboard" replace />;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fe[i.path[0] as string] = i.message; });
      setErrors(fe); return;
    }
    const student = students.find((s) => s.id === user.studentId)!;
    addAchievement({
      studentId: student.id,
      title: parsed.data.title,
      category: parsed.data.category,
      type: parsed.data.type,
      date: parsed.data.date,
      description: parsed.data.description,
      studentName: student.name,
      status: "Pending",
    });
    toast({ title: "Achievement submitted", description: "Your achievement is pending review." });
    navigate("/student/achievements");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Submit Achievement</h1>
            <p className="text-sm text-muted-foreground">Record a new extracurricular accomplishment</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl bg-card border border-border/60 shadow-card p-6 md:p-8 space-y-5 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <Label>Activity Title</Label>
              <Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Inter-college Hackathon" />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Category })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as AchievementType })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Participation">Participation</SelectItem>
                  <SelectItem value="Award">Award</SelectItem>
                  <SelectItem value="Recognition">Recognition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Date</Label>
              <Input type="date" className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
            </div>
            <div className="md:col-span-2">
              <Label>Description</Label>
              <Textarea className="mt-1.5 min-h-[110px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe the achievement..." />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" className="gradient-primary text-white shadow-md hover:shadow-glow flex-1 md:flex-none">
              <Sparkles className="h-4 w-4 mr-2" /> Submit Achievement
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default SubmitAchievement;
