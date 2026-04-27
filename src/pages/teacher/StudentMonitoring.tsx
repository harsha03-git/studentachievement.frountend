import { useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { useApp } from "@/context/AppContext";
import { ArrowLeft, User, Trophy, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AchievementCard } from "@/components/AchievementCard";
import { Achievement } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const StudentMonitoring = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, students, achievements, addFeedback } = useApp();
  const [feedbackItem, setFeedbackItem] = useState<Achievement | null>(null);
  const [feedbackText, setFeedbackText] = useState("");

  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "teacher") return <Navigate to="/dashboard" replace />;

  const student = students.find((s) => s.id === id);
  const studentAchievements = achievements.filter((a) => a.studentId === id).sort((a, b) => b.date.localeCompare(a.date));

  if (!student) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Student not found.</div>
      </AppLayout>
    );
  }

  // Ensure teacher can only see assigned students
  if (student.teacherId !== user.teacherId) {
    return <Navigate to="/teacher/students" replace />;
  }

  const handleSaveFeedback = () => {
    if (!feedbackItem || !feedbackText.trim()) return;
    addFeedback(feedbackItem.id, feedbackText);
    toast({ title: "Feedback Saved", description: "Your remarks have been added to the achievement." });
    setFeedbackItem(null);
    setFeedbackText("");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to My Students
        </button>

        <div className="flex items-center gap-4 bg-card p-6 rounded-3xl border border-border/60 shadow-card animate-fade-in-up">
          <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {student.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{student.name}</h1>
            <p className="text-sm text-muted-foreground">
              {student.course} • {student.year} • {student.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Submitted Achievements</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {studentAchievements.map((a, i) => (
              <div key={a.id} className="relative group">
                <AchievementCard achievement={a} delay={i * 50} />
                <div className="mt-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs font-medium bg-muted hover:bg-primary/10 hover:text-primary"
                    onClick={() => {
                      setFeedbackItem(a);
                      setFeedbackText(a.feedback || "");
                    }}
                  >
                    <MessageSquarePlus className="h-3 w-3 mr-1.5" />
                    {a.feedback ? "Edit Feedback" : "Add Feedback"}
                  </Button>
                </div>
              </div>
            ))}
            {studentAchievements.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border/60 rounded-2xl">
                No achievements submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!feedbackItem} onOpenChange={(o) => !o && setFeedbackItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Remarks</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Add feedback or remarks for <strong>{feedbackItem?.title}</strong>. This will be visible to the student.
            </p>
            <Textarea
              placeholder="Great work on this participation..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackItem(null)}>Cancel</Button>
            <Button className="gradient-primary text-white" onClick={handleSaveFeedback}>Save Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default StudentMonitoring;
